package com.challet.bankservice.domain.controller;

import com.challet.bankservice.domain.dto.request.AccountTransferRequestDTO;
import com.challet.bankservice.domain.dto.request.MyDataConnectionRequestDTO;
import com.challet.bankservice.domain.dto.request.PaymentRequestDTO;
import com.challet.bankservice.domain.dto.response.AccountInfoResponseListDTO;
import com.challet.bankservice.domain.dto.response.TransactionDetailResponseDto;
import com.challet.bankservice.domain.dto.response.TransactionHistoryResponseDTO;
import com.challet.bankservice.domain.dto.response.TransactionResponseListDTO;
import com.challet.bankservice.domain.service.ChalletBankService;
import com.challet.bankservice.global.exception.ExceptionDto;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import java.util.List;
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
@RequestMapping("/bank-service/challet-banks")
@Tag(name = "ChalletController", description = "챌렛 은행 컨트롤러")
@RequiredArgsConstructor
public class ChalletBankController {

    private final ChalletBankService challetBankService;

    @GetMapping()
    @Operation(summary = "챌렛은행 조회", description = "전화번호를 이용하여 계좌를 조회합니다")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "성공"),
        @ApiResponse(responseCode = "400", description = "계좌 조회 실패", content = @Content(schema = @Schema(implementation = ExceptionDto.class))),
    })
    public ResponseEntity<AccountInfoResponseListDTO> getAccountInfo(
        @RequestParam String phoneNumber) {
        AccountInfoResponseListDTO account = challetBankService.findAccount(phoneNumber);
        return ResponseEntity.status(HttpStatus.CREATED).body(account);
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
        return ResponseEntity.status(HttpStatus.CREATED).body(transactionList);
    }

    @PostMapping()
    @Operation(summary = "챌렛은행 계좌 생성", description = "계좌를 생성하며 입력받은 전화번호를 ")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "201", description = "계좌 생성 성공"),
        @ApiResponse(responseCode = "400", description = "계좌 생성 실패", content = @Content(schema = @Schema(implementation = Exception.class))),
    })
    public ResponseEntity createAccount(@RequestParam String phoneNumber) {
        challetBankService.createAccount(phoneNumber);
        return ResponseEntity.status(HttpStatus.CREATED).build();
    }

    @GetMapping("/details")
    @Operation(summary = "챌렛계좌 상세 거래 내역 조회", description = "계좌 상세 거래내역 조회 내역")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "201", description = "계좌 상세 거래내역 조회 성공"),
        @ApiResponse(responseCode = "400", description = "계좌 상세 거래내역 조회 실패", content = @Content(schema = @Schema(implementation = Exception.class))),
    })
    public ResponseEntity<TransactionDetailResponseDto> getAccountTransactionDetails() {
        return null;
    }

    @GetMapping("/search")
    @Operation(summary = "챌렛은행 계좌 거래 내역 검색", description = "keyword, category를 통해 거래 내역 검색")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "검색 성공"),
        @ApiResponse(responseCode = "400", description = "검색 실패", content = @Content(schema = @Schema(implementation = Exception.class))),
    })
    public ResponseEntity<List<TransactionHistoryResponseDTO>> searchAccountTransactions(
        @RequestParam String keyword,
        @RequestParam String category) {
        return null;
    }


    @PostMapping("/payments")
    @Operation(summary = "결제 서비스", description = "결제 금액, 결제 장소, 결제 카테고리 데이터를 이용한 결제")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "결제 성공"),
        @ApiResponse(responseCode = "400", description = "결제 실패", content = @Content(schema = @Schema(implementation = Exception.class))),
    })
    public ResponseEntity processPayment(@RequestBody PaymentRequestDTO paymentRequestDTO) {
        return ResponseEntity.status(HttpStatus.CREATED).build();
    }

    @PostMapping("/account-transfers")
    @Operation(summary = "계좌 이체 서비스", description = "이체 계좌, 이체 금액  데이터를 이용한 결제")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "201", description = "이체 성공"),
        @ApiResponse(responseCode = "400", description = "이체 실패", content = @Content(schema = @Schema(implementation = Exception.class))),
    })
    public ResponseEntity processAccountTransfer(
        @RequestBody AccountTransferRequestDTO accountTransferRequestDTO) {
        return ResponseEntity.status(HttpStatus.CREATED).build();
    }

    @PostMapping("/mydatas")
    @Operation(summary = "마이데이터 연결", description = "선택한 은행 기반 마이 데이터 연결")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "201", description = "마이데이터 연결 성공"),
        @ApiResponse(responseCode = "400", description = "마이데이터 연결 실패", content = @Content(schema = @Schema(implementation = Exception.class))),
    })
    public ResponseEntity connectMyData(
        @RequestBody MyDataConnectionRequestDTO myDataConnectionRequestDTO) {
        return ResponseEntity.status(HttpStatus.CREATED).build();
    }
}
