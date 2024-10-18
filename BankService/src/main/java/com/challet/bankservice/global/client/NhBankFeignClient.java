package com.challet.bankservice.global.client;

import com.challet.bankservice.domain.dto.request.BankToAnalysisMessageRequestDTO;
import com.challet.bankservice.domain.dto.request.BankTransferRequestDTO;
import com.challet.bankservice.domain.dto.response.AccountInfoResponseListDTO;
import com.challet.bankservice.domain.dto.response.BankTransferResponseDTO;
import com.challet.bankservice.domain.dto.response.MonthlyTransactionHistoryListDTO;
import com.challet.bankservice.domain.entity.Category;
import java.util.Map;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestParam;

@FeignClient(name = "nh-bank")
public interface NhBankFeignClient {

    @PostMapping("/api/nh-bank/mydata-connect")
    AccountInfoResponseListDTO connectMyDataKbBank(
        @RequestHeader(value = "Authorization") String tokenHeader);

    @PostMapping("/api/nh-bank/mydata-disconnect")
    void disconnectMyDataKbBank(@RequestHeader(value = "Authorization") String tokenHeader);

    @GetMapping("/api/nh-bank")
    AccountInfoResponseListDTO getMyDataKbBank(
        @RequestHeader(value = "Authorization", required = false) String tokenHeader);

    @PostMapping("/api/nh-bank/account-transfers")
    BankTransferRequestDTO getTransferAccount(BankTransferResponseDTO responseDTO);

    @GetMapping("/api/nh-bank/transactions-monthly")
    MonthlyTransactionHistoryListDTO getMonthlyTransactionHistory(
        @RequestHeader(value = "Authorization", required = false) String tokenHeader,
        @RequestParam int year, @RequestParam int month);

    @PostMapping("/api/nh-bank/transaction-category")
    Map<Category, Long> getTransactionGroupCategory(
        @RequestBody BankToAnalysisMessageRequestDTO message);

    @GetMapping("/api/nh-bank/transaction-category-month")
    Map<Category, Long> getMyTransactionCategory(
        @RequestHeader(value = "Authorization", required = false) String tokenHeader,
        @RequestParam int year, @RequestParam int month);

    @PostMapping("/api/nh-bank/account-name")
    String getAccountInfo(@RequestBody String accountNumber);
}
