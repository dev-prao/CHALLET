package com.challet.nhbankservicedemo.domain.controller;

import com.challet.nhbankservicedemo.domain.dto.request.AccountTransferRequestDTO;
import com.challet.nhbankservicedemo.domain.dto.request.BankToAnalysisMessageRequestDTO;
import com.challet.nhbankservicedemo.domain.dto.request.MonthlyTransactionRequestDTO;
import com.challet.nhbankservicedemo.domain.dto.response.AccountInfoResponseListDTO;
import com.challet.nhbankservicedemo.domain.dto.response.BankTransferResponseDTO;
import com.challet.nhbankservicedemo.domain.dto.response.CategoryAmountResponseListDTO;
import com.challet.nhbankservicedemo.domain.dto.response.MonthlyTransactionHistoryListDTO;
import com.challet.nhbankservicedemo.domain.dto.response.TransactionDetailResponseDTO;
import com.challet.nhbankservicedemo.domain.dto.response.TransactionResponseListDTO;
import com.challet.nhbankservicedemo.domain.entity.Category;
import com.challet.nhbankservicedemo.domain.service.NhBankService;
import com.challet.nhbankservicedemo.global.exception.ExceptionDto;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import java.util.Map;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/nh-bank")
@RequiredArgsConstructor
@Tag(name = "ChalletController", description = "NH은행 컨트롤러")
public class NhBankController {

    private final NhBankService nhBankService;

    @GetMapping()
    @Operation(summary = "농협은행 조회", description = "전화번호를 이용하여 농협은행 조회")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "조회 성공"),
        @ApiResponse(responseCode = "400", description = "조회 실패", content = @Content(schema = @Schema(implementation = ExceptionDto.class))),
    })
    public ResponseEntity<AccountInfoResponseListDTO> getAccountInfo(
        @RequestHeader(value = "Authorization", required = false) String tokenHeader) {
        AccountInfoResponseListDTO accounts = nhBankService.getAccountsByPhoneNumber(tokenHeader);
        if (accounts.accountCount() == 0) {
            return ResponseEntity.status(HttpStatus.NO_CONTENT).build();
        }
        return ResponseEntity.status(HttpStatus.OK).body(accounts);
    }

    @GetMapping("/account")
    @Operation(summary = "농협은행 계좌내역 조회", description = "계좌 ID를 통해 계좌내역 조회")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "조회 성공"),
        @ApiResponse(responseCode = "400", description = "조회 실패", content = @Content(schema = @Schema(implementation = ExceptionDto.class))),
    })
    public ResponseEntity<TransactionResponseListDTO> getAccountTransactions(
        @RequestHeader("AccountId") Long accountId) {
        TransactionResponseListDTO transactionList = nhBankService.getAccountTransactionList(
            accountId);
        return ResponseEntity.status(HttpStatus.OK).body(transactionList);
    }

    @GetMapping("/details")
    @Operation(summary = "농협은행 상세 거래 내역 조회", description = "거래내역 ID를 통해 상세 거래 내역 조회 내역")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "계좌 상세 거래내역 조회 성공"),
        @ApiResponse(responseCode = "400", description = "계좌 상세 거래내역 조회 실패", content = @Content(schema = @Schema(implementation = Exception.class))),
    })
    public ResponseEntity<TransactionDetailResponseDTO> getAccountTransactionDetails(
        @RequestHeader("TransactionId") Long transactionId) {
        TransactionDetailResponseDTO transaction = nhBankService.getTransactionInfo(transactionId);
        return ResponseEntity.status(HttpStatus.OK).body(transaction);
    }

    @PostMapping("/mydata-connect")
    @Operation(summary = "농협은행 계좌 마이데이터 연결", description = "전화번호를 통해 계좌 연결")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "계좌 연결 성공"),
        @ApiResponse(responseCode = "400", description = "계좌 연결 실패", content = @Content(schema = @Schema(implementation = Exception.class))),
    })
    public ResponseEntity<AccountInfoResponseListDTO> connectMyDataAccount(
        @RequestHeader(value = "Authorization", required = false) String tokenHeader) {
        nhBankService.connectMyDataAccount(tokenHeader);
        AccountInfoResponseListDTO myDataAccounts = nhBankService.getAccountsByPhoneNumber(
            tokenHeader);
        return ResponseEntity.status(HttpStatus.OK).body(myDataAccounts);
    }

    @PostMapping("/account-transfers")
    @Operation(summary = "계좌 이체시 계좌 입금", description = "계좌 번호, 입금금액, 사용자 정보를 받아 계좌 입금")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "계좌 입금 성공"),
        @ApiResponse(responseCode = "400", description = "계좌 입금 실패", content = @Content(schema = @Schema(implementation = Exception.class))),
    })
    public ResponseEntity<BankTransferResponseDTO> addAccountFromTransfer(
        @RequestBody AccountTransferRequestDTO requestDTO) {

        BankTransferResponseDTO bankTransferResponseDTO = nhBankService.addFundsToAccount(
            requestDTO);
        return ResponseEntity.status(HttpStatus.OK).body(bankTransferResponseDTO);
    }


    @GetMapping("/search")
    @Operation(summary = "농협은행 계좌 거래 내역 검색", description = "keyword, category를 통해 거래 내역 검색")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "검색 성공"),
        @ApiResponse(responseCode = "400", description = "검색 실패", content = @Content(schema = @Schema(implementation = Exception.class))),
    })
    public ResponseEntity<TransactionResponseListDTO> searchAccountTransactions(
        @RequestParam String keyword,
        @RequestParam String category) {
        return null;
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
        MonthlyTransactionHistoryListDTO monthlyTransactionHistory = nhBankService.getMonthlyTransactionHistory(
            tokenHeader, requestDTO);
        return ResponseEntity.status(HttpStatus.OK).body(monthlyTransactionHistory);
    }

    @PostMapping("/transaction-category")
    public ResponseEntity<Map<Category, Long>> getTransactionGroupCategory(
        @RequestBody BankToAnalysisMessageRequestDTO requestDTO) {

        Map<Category, Long> transactionByGroupCategory = nhBankService.getTransactionByGroupCategory(
            requestDTO);
        return ResponseEntity.status(HttpStatus.OK).body(transactionByGroupCategory);
    }
}
