package com.challet.bankservice.domain.controller;

import com.challet.bankservice.domain.dto.request.AccountTransferRequestDTO;
import com.challet.bankservice.domain.dto.request.BankSelectionRequestDTO;
import com.challet.bankservice.domain.dto.request.ConfirmPaymentRequestDTO;
import com.challet.bankservice.domain.dto.request.PaymentRequestDTO;
import com.challet.bankservice.domain.dto.request.SearchTransactionRequestDTO;
import com.challet.bankservice.domain.dto.request.SimplePasswordRequestDTO;
import com.challet.bankservice.domain.dto.response.AccountInfoResponseListDTO;
import com.challet.bankservice.domain.dto.response.AccountTransferResponseDTO;
import com.challet.bankservice.domain.dto.response.MyDataBankAccountInfoResponseDTO;
import com.challet.bankservice.domain.dto.response.PaymentResponseDTO;
import com.challet.bankservice.domain.dto.response.SearchedTransactionResponseDTO;
import com.challet.bankservice.domain.dto.response.TransactionDetailResponseDTO;
import com.challet.bankservice.domain.dto.response.TransactionResponseListDTO;
import com.challet.bankservice.domain.service.ChalletBankService;
import com.challet.bankservice.global.exception.ExceptionDto;
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
@RequestMapping("/api/ch-bank")
@Tag(name = "ChalletBankController", description = "챌렛 은행 컨트롤러")
@RequiredArgsConstructor
public class ChalletBankController {

    private final ChalletBankService challetBankService;

    @PostMapping()
    @Operation(summary = "챌렛은행 계좌 생성", description = "계좌를 생성하며 입력받은 전화번호를 ")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "201", description = "계좌 생성 성공"),
        @ApiResponse(responseCode = "400", description = "계좌 생성 실패", content = @Content(schema = @Schema(implementation = Exception.class))),
    })
    public ResponseEntity createAccount(@RequestParam("name") String name,
        @RequestHeader("phoneNumber") String phoneNumber) {
        challetBankService.createAccount(name, phoneNumber);
        return ResponseEntity.status(HttpStatus.CREATED).build();
    }

    @GetMapping()
    @Operation(summary = "챌렛은행 조회", description = "전화번호를 이용하여 계좌를 조회합니다")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "성공"),
        @ApiResponse(responseCode = "400", description = "계좌 조회 실패", content = @Content(schema = @Schema(implementation = ExceptionDto.class))),
    })
    public ResponseEntity<AccountInfoResponseListDTO> getAccountInfo(
        @RequestHeader(value = "Authorization", required = false) String header) {
        AccountInfoResponseListDTO account = challetBankService.getAccountsByPhoneNumber(header);
        return ResponseEntity.status(HttpStatus.OK).body(account);
    }

    @GetMapping("/accounts")
    @Operation(summary = "챌렛계좌 거래 내역 조회", description = "계좌id를 이용하여 조회합니다")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "성공"),
        @ApiResponse(responseCode = "400", description = "계좌 조회 실패", content = @Content(schema = @Schema(implementation = ExceptionDto.class))),
    })
    public ResponseEntity<TransactionResponseListDTO> getAccountTransactions(
        @RequestHeader("AccountId") Long accountId) {
        TransactionResponseListDTO transactionList = challetBankService.getAccountTransactionList(
            accountId);
        return ResponseEntity.status(HttpStatus.OK).body(transactionList);
    }

    @GetMapping("/details")
    @Operation(summary = "챌렛계좌 상세 거래 내역 조회", description = "계좌 상세 거래내역 조회 내역")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "201", description = "계좌 상세 거래내역 조회 성공"),
        @ApiResponse(responseCode = "400", description = "계좌 상세 거래내역 조회 실패", content = @Content(schema = @Schema(implementation = Exception.class))),
    })
    public ResponseEntity<TransactionDetailResponseDTO> getAccountTransactionDetails(
        @RequestHeader("TransactionId") Long transactionId) {
        TransactionDetailResponseDTO transaction = challetBankService.getTransactionInfo(
            transactionId);
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
//    @Parameters(value = {
//        @Parameter(name = "category", description = "카테고리", in = ParameterIn.QUERY),
//        @Parameter(name = "keyword", description = "검색어", in = ParameterIn.QUERY),
//    })
    @GetMapping("/search")
    public ResponseEntity<SearchedTransactionResponseDTO> searchTransactions(
        @RequestHeader("Authorization") String header,
        @RequestParam Long accountId,
        @RequestParam(required = false) String keyword,
        @RequestParam(defaultValue = "0") int page,
        @RequestParam(defaultValue = "10") int size) {

        if (challetBankService.getAccountsByPhoneNumber(header).accountCount() == 0) {
            return ResponseEntity.status(HttpStatus.NO_CONTENT).build();
        }

        SearchTransactionRequestDTO searchTransactionRequestDTO = SearchTransactionRequestDTO.of(
            accountId, keyword, page, size);

        SearchedTransactionResponseDTO searchedTransactionResponseDTO = challetBankService.searchTransaction(
            searchTransactionRequestDTO);

        return ResponseEntity.ok(searchedTransactionResponseDTO);
    }
    
    @PostMapping("/simple-password")
    @Operation(summary = "간편 비밀번호 확인", description = "간편 비밀번호 확인")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "비밀번호 인증 성공"),
        @ApiResponse(responseCode = "400", description = "비밀번호 인증 실패", content = @Content(schema = @Schema(implementation = Exception.class))),
    })
    public ResponseEntity<?> checkPassword(
        @RequestHeader("Authorization") String header,
        @RequestBody SimplePasswordRequestDTO requestDTO){
        if(challetBankService.verifyPassword(header, requestDTO.password())){
            return ResponseEntity.status(HttpStatus.OK).build();
        }
        return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
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
        PaymentResponseDTO paymentResponseDTO = challetBankService.qrPayment(accountId,
            paymentRequestDTO);
        return ResponseEntity.status(HttpStatus.CREATED).body(paymentResponseDTO);
    }

    @PostMapping("/confirm-payment")
    @Operation(summary = "결제 확인 서비스", description = "결제 금액, 결제 장소, 결제 카테고리 데이터를 이용한 확인 및 메시지전달")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "확인 및 메시지 성공"),
        @ApiResponse(responseCode = "400", description = "실패", content = @Content(schema = @Schema(implementation = Exception.class))),
    })
    public ResponseEntity<PaymentResponseDTO> confirmPayment(
        @RequestHeader("AccountId") Long accountId,
        @RequestBody ConfirmPaymentRequestDTO paymentRequestDTO) {
        PaymentResponseDTO paymentResponseDTO = challetBankService.confirmPaymentInfo(accountId,
            paymentRequestDTO);
        challetBankService.sendPaymentInfoToChallet(accountId, paymentResponseDTO);
        return ResponseEntity.status(HttpStatus.CREATED).body(paymentResponseDTO);
    }

    @PostMapping("/account-username")
    @Operation(summary = "계좌번호의 유저 이름 메시지", description = "계좌 번호를 이용한 유저의 이름 메시지")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "201", description = "조회 성공"),
        @ApiResponse(responseCode = "400", description = "조회 실패", content = @Content(schema = @Schema(implementation = Exception.class))),
    })
    public ResponseEntity<String> accountUserName(
        @RequestHeader("Authorization") String tokenHeader,
        @RequestBody AccountTransferRequestDTO accountTransferRequestDTO) {
        String accountName = challetBankService.getAccountName(tokenHeader, accountTransferRequestDTO);
        return ResponseEntity.status(HttpStatus.OK).body(accountName);
    }

    @PostMapping("/account-transfers")
    @Operation(summary = "계좌 이체 서비스", description = "이체 계좌, 이체 금액  데이터를 이용한 결제")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "201", description = "이체 성공"),
        @ApiResponse(responseCode = "400", description = "이체 실패", content = @Content(schema = @Schema(implementation = Exception.class))),
    })
    public ResponseEntity<AccountTransferResponseDTO> processAccountTransfer(
        @RequestHeader("AccountId") Long accountId,
        @RequestBody AccountTransferRequestDTO accountTransferRequestDTO) {
        AccountTransferResponseDTO accountTransferResponseDTO = challetBankService.accountTransfer(
            accountId, accountTransferRequestDTO);

        return ResponseEntity.status(HttpStatus.CREATED).body(accountTransferResponseDTO);
    }

    @PostMapping("/confirm-account-transfers")
    @Operation(summary = "계좌이체 확인 서비스", description = "이체 확인시 카테고리 변경확인 및 수정")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "확인 및 메시지 성공"),
        @ApiResponse(responseCode = "400", description = "실패", content = @Content(schema = @Schema(implementation = Exception.class))),
    })
    public ResponseEntity<PaymentResponseDTO> confirmAccountTransfer(
        @RequestHeader("AccountId") Long accountId,
        @RequestBody ConfirmPaymentRequestDTO paymentRequestDTO) {
        PaymentResponseDTO paymentResponseDTO = challetBankService.confirmPaymentInfo(accountId,
            paymentRequestDTO);
        challetBankService.sendPaymentInfoToChallet(accountId, paymentResponseDTO);
        return ResponseEntity.status(HttpStatus.CREATED).body(paymentResponseDTO);
    }

    @PostMapping("/mydata-connect")
    @Operation(summary = "마이데이터 연결", description = "선택한 은행 기반 마이 데이터 연결")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "201", description = "마이데이터 연결 성공"),
        @ApiResponse(responseCode = "400", description = "마이데이터 연결 실패", content = @Content(schema = @Schema(implementation = Exception.class))),
    })
    public ResponseEntity<MyDataBankAccountInfoResponseDTO> connectMyDataBanks(
        @RequestHeader(value = "Authorization", required = false) String tokenHeader,
        @RequestBody BankSelectionRequestDTO bankSelectionRequestDTO) {
        MyDataBankAccountInfoResponseDTO myDataAccounts = challetBankService.connectMyDataBanks(
            tokenHeader, bankSelectionRequestDTO);
        return ResponseEntity.status(HttpStatus.CREATED).body(myDataAccounts);
    }


    @GetMapping("/mydatas")
    @Operation(summary = "마이데이터 조회", description = "마이 데이터 조회")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "201", description = "마이데이터 조회 성공"),
        @ApiResponse(responseCode = "400", description = "마이데이터 조회 실패", content = @Content(schema = @Schema(implementation = Exception.class))),
    })
    public ResponseEntity<MyDataBankAccountInfoResponseDTO> getMyDataBanks(
        @RequestHeader(value = "Authorization", required = false) String tokenHeader) {
        MyDataBankAccountInfoResponseDTO myDataAccounts = challetBankService.getMyDataAccounts(
            tokenHeader);
        return ResponseEntity.status(HttpStatus.OK).body(myDataAccounts);
    }
}
