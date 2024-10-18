package com.challet.shbankservice.domain.controller;

import java.util.Map;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.challet.shbankservice.domain.dto.request.AccountTransferRequestDTO;
import com.challet.shbankservice.domain.dto.request.BankToAnalysisMessageRequestDTO;
import com.challet.shbankservice.domain.dto.request.MonthlyTransactionRequestDTO;
import com.challet.shbankservice.domain.dto.request.PaymentRequestDTO;
import com.challet.shbankservice.domain.dto.request.SearchTransactionRequestDTO;
import com.challet.shbankservice.domain.dto.response.AccountInfoResponseListDTO;
import com.challet.shbankservice.domain.dto.response.BankTransferResponseDTO;
import com.challet.shbankservice.domain.dto.response.MonthlyTransactionHistoryListDTO;
import com.challet.shbankservice.domain.dto.response.PaymentResponseDTO;
import com.challet.shbankservice.domain.dto.response.SearchedTransactionResponseDTO;
import com.challet.shbankservice.domain.dto.response.TransactionDetailResponseDTO;
import com.challet.shbankservice.domain.dto.response.TransactionResponseListDTO;
import com.challet.shbankservice.domain.entity.Category;
import com.challet.shbankservice.domain.service.ShBankService;
import com.challet.shbankservice.global.exception.ExceptionDto;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.Parameters;
import io.swagger.v3.oas.annotations.enums.ParameterIn;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Slf4j
@RestController
@RequestMapping("/api/sh-bank")
@RequiredArgsConstructor
@Tag(name = "ChalletController", description = "SH은행 컨트롤러")
public class ShBankController {

    private final ShBankService shBankService;

    @GetMapping()
    @Operation(summary = "SH은행 조회", description = "전화번호를 이용하여 SH은행 조회")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "조회 성공"),
        @ApiResponse(responseCode = "400", description = "조회 실패", content = @Content(schema = @Schema(implementation = ExceptionDto.class))),
    })
    public ResponseEntity<AccountInfoResponseListDTO> getAccountInfo(
        @RequestHeader(value = "Authorization", required = false) String tokenHeader) {
        AccountInfoResponseListDTO accounts = shBankService.getAccountsByPhoneNumber(tokenHeader);
        if (accounts.accountCount() == 0) {
            return ResponseEntity.status(HttpStatus.NO_CONTENT).build();
        }
        return ResponseEntity.status(HttpStatus.OK).body(accounts);
    }


    @GetMapping("/account")
    @Operation(summary = "SH은행 계좌내역 조회", description = "계좌 ID를 통해 계좌내역 조회")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "조회 성공"),
        @ApiResponse(responseCode = "400", description = "조회 실패", content = @Content(schema = @Schema(implementation = ExceptionDto.class))),
    })
    public ResponseEntity<TransactionResponseListDTO> getAccountTransactions(
        @RequestHeader("AccountId") Long accountId) {
        TransactionResponseListDTO transactionList = shBankService.getAccountTransactionList(
            accountId);
        return ResponseEntity.status(HttpStatus.OK).body(transactionList);
    }


    @GetMapping("/details")
    @Operation(summary = "SH은행 상세 거래 내역 조회", description = "거래내역 ID를 통해 상세 거래 내역 조회 내역")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "계좌 상세 거래내역 조회 성공"),
        @ApiResponse(responseCode = "400", description = "계좌 상세 거래내역 조회 실패", content = @Content(schema = @Schema(implementation = Exception.class))),
    })
    public ResponseEntity<TransactionDetailResponseDTO> getAccountTransactionDetails(
        @RequestHeader("TransactionId") Long transactionId) {
        TransactionDetailResponseDTO transaction = shBankService.getTransactionInfo(transactionId);
        return ResponseEntity.status(HttpStatus.OK).body(transaction);
    }


    @Operation(summary = "거래내역 검색 - Elasticsearch (완료)", description = "내 거래내역 중 검색어로 검색" +
        "검색어와 카테고리 모두 주어진 값이 없다면 전체조회")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "거래내역 검색 성공"),
        @ApiResponse(responseCode = "204", description = "검색 결과 없음"),
        @ApiResponse(responseCode = "400", description = "챌린지 검색 실패", content = @Content(schema = @Schema(implementation = ExceptionDto.class))),
        @ApiResponse(responseCode = "401", description = "접근 권한 없음", content = @Content(schema = @Schema(implementation = ExceptionDto.class)))
    })
    @Parameters(value = {
        @Parameter(name = "accountId", description = "계좌 ID", in = ParameterIn.QUERY),
        @Parameter(name = "keyword", description = "검색어", in = ParameterIn.QUERY),
        @Parameter(name = "page", description = "페이지", in = ParameterIn.QUERY),
        @Parameter(name = "size", description = "사이즈", in = ParameterIn.QUERY),
    })
    @GetMapping("/search")
    public ResponseEntity<SearchedTransactionResponseDTO> searchTransactions(
        @RequestHeader("Authorization") String header,
        @RequestParam Long accountId,
        @RequestParam(required = false) String keyword,
        @RequestParam(defaultValue = "0") int page,
        @RequestParam(defaultValue = "10") int size) {

        if (shBankService.getAccountsByPhoneNumber(header).accountCount() == 0) {
            log.info("accountCount == 0");
            return ResponseEntity.status(HttpStatus.NO_CONTENT).build();
        }

        SearchTransactionRequestDTO searchTransactionRequestDTO = SearchTransactionRequestDTO.of(
            accountId, keyword, page, size);

        log.info("controller request dto {}", searchTransactionRequestDTO.toString());

        SearchedTransactionResponseDTO searchedTransactionResponseDTO = shBankService.searchTransaction(
            searchTransactionRequestDTO);

        log.info("controller response dto {}", searchedTransactionResponseDTO.toString());

        return ResponseEntity.ok(searchedTransactionResponseDTO);
    }

    @PostMapping("/mydata-connect")
    @Operation(summary = "신한은행 계좌 마이데이터 연결", description = "전화번호를 통해 계좌 연결")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "계좌 연결 성공"),
        @ApiResponse(responseCode = "400", description = "계좌 연결 실패", content = @Content(schema = @Schema(implementation = Exception.class))),
    })
    public ResponseEntity<AccountInfoResponseListDTO> connectMyDataAccount(
        @RequestHeader(value = "Authorization", required = false) String tokenHeader) {
        shBankService.connectMyDataAccount(tokenHeader, true);
        AccountInfoResponseListDTO myDataAccounts = shBankService.getAccountsByPhoneNumber(
            tokenHeader);
        return ResponseEntity.status(HttpStatus.OK).body(myDataAccounts);
    }

    @PostMapping("/mydata-disconnect")
    @Operation(summary = "은행 계좌 마이데이터 취소", description = "전화번호를 통해 계좌 취소")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "계좌 취소 성공"),
        @ApiResponse(responseCode = "400", description = "계좌 취소 실패", content = @Content(schema = @Schema(implementation = Exception.class))),
    })
    public void disconnectMyDataKbBank(@RequestHeader(value = "Authorization") String tokenHeader){
        shBankService.connectMyDataAccount(tokenHeader, false);
    }

    @PostMapping("/account-name")
    @Operation(summary = "계좌 유저이름 반환", description = "계좌 번호를 이용한 계좌 유저이름 반환")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "조회 성공"),
        @ApiResponse(responseCode = "400", description = "조회 실패", content = @Content(schema = @Schema(implementation = Exception.class))),
    })
    public ResponseEntity<String> userAccountName(
        @RequestBody String accountNumber) {
        String accountName = shBankService.getAccountName(accountNumber);
        return ResponseEntity.status(HttpStatus.OK).body(accountName);
    }

    @PostMapping("/account-transfers")
    @Operation(summary = "계좌 이체시 계좌 입금", description = "계좌 번호, 입금금액, 사용자 정보를 받아 계좌 입금")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "계좌 입금 성공"),
        @ApiResponse(responseCode = "400", description = "계좌 입금 실패", content = @Content(schema = @Schema(implementation = Exception.class))),
    })
    public ResponseEntity<BankTransferResponseDTO> addAccountFromTransfer(
        @RequestBody AccountTransferRequestDTO requestDTO) {

        BankTransferResponseDTO bankTransferResponseDTO = shBankService.addFundsToAccount(
            requestDTO);
        return ResponseEntity.status(HttpStatus.OK).body(bankTransferResponseDTO);
    }


    @GetMapping("/transactions-monthly")
    @Operation(summary = "한달 결제내역", description = "year, month를 통해 거래 내역 검색")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "검색 성공"),
        @ApiResponse(responseCode = "400", description = "검색 실패", content = @Content(schema = @Schema(implementation = Exception.class))),
    })
    public ResponseEntity<MonthlyTransactionHistoryListDTO> getMonthlyTransactionHistory(
        @RequestHeader(value = "Authorization", required = false) String tokenHeader,
        @RequestParam int year, @RequestParam int month) {

        MonthlyTransactionRequestDTO requestDTO = MonthlyTransactionRequestDTO.fromDTO(year, month);
        MonthlyTransactionHistoryListDTO monthlyTransactionHistory = shBankService.getMonthlyTransactionHistory(
            tokenHeader, requestDTO);
        return ResponseEntity.status(HttpStatus.OK).body(monthlyTransactionHistory);
    }

    @PostMapping("/transaction-category")
    public ResponseEntity<Map<Category, Long>> getTransactionGroupCategory(
        @RequestBody BankToAnalysisMessageRequestDTO requestDTO) {

        Map<Category, Long> transactionByGroupCategory = shBankService.getTransactionByGroupCategory(
            requestDTO);
        return ResponseEntity.status(HttpStatus.OK).body(transactionByGroupCategory);
    }

    @GetMapping("/transaction-category-month")
    @Operation(summary = "카테고리별 한달 결제내역", description = "year, month를 통해 거래 내역 검색")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "조회 성공"),
        @ApiResponse(responseCode = "400", description = "조회 실패", content = @Content(schema = @Schema(implementation = Exception.class))),
    })
    public ResponseEntity<Map<Category, Long>> getMyTransactionCategory(
        @RequestHeader(value = "Authorization", required = false) String tokenHeader,
        @RequestParam int year, @RequestParam int month) {

        MonthlyTransactionRequestDTO requestDTO = MonthlyTransactionRequestDTO.fromDTO(year, month);
        Map<Category, Long> transactionByGroupCategory = shBankService.getMyTransactionByCategory(
            tokenHeader, requestDTO);
        return ResponseEntity.status(HttpStatus.OK).body(transactionByGroupCategory);
    }

    @PostMapping("/payments")
    @Operation(summary = "결제 서비스", description = "결제 금액, 결제 장소 데이터를 이용한 결제")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "결제 성공"),
        @ApiResponse(responseCode = "400", description = "결제 실패", content = @Content(schema = @Schema(implementation = Exception.class))),
    })
    public ResponseEntity<PaymentResponseDTO> processPayment(
        @RequestHeader("AccountId") Long accountId
        , @RequestBody PaymentRequestDTO paymentRequestDTO) {
        PaymentResponseDTO paymentResponseDTO = shBankService.qrPayment(accountId,
            paymentRequestDTO);
        return ResponseEntity.status(HttpStatus.CREATED).body(paymentResponseDTO);
    }
}
