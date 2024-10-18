package com.challet.kbbankservice.domain.service;

import com.challet.kbbankservice.domain.dto.request.AccountTransferRequestDTO;
import com.challet.kbbankservice.domain.dto.request.BankToAnalysisMessageRequestDTO;
import com.challet.kbbankservice.domain.dto.request.MonthlyTransactionRequestDTO;
import com.challet.kbbankservice.domain.dto.request.PaymentRequestDTO;
import com.challet.kbbankservice.domain.dto.request.SearchTransactionRequestDTO;
import com.challet.kbbankservice.domain.dto.response.AccountInfoResponseListDTO;
import com.challet.kbbankservice.domain.dto.response.BankTransferResponseDTO;
import com.challet.kbbankservice.domain.dto.response.MonthlyTransactionHistoryListDTO;
import com.challet.kbbankservice.domain.dto.response.PaymentResponseDTO;
import com.challet.kbbankservice.domain.dto.response.SearchedTransactionResponseDTO;
import com.challet.kbbankservice.domain.dto.response.TransactionDetailResponseDTO;
import com.challet.kbbankservice.domain.dto.response.TransactionResponseListDTO;
import com.challet.kbbankservice.domain.entity.Category;
import java.util.Map;

public interface KbBankService {

    AccountInfoResponseListDTO getAccountsByPhoneNumber(String tokenHeader);

    TransactionResponseListDTO getAccountTransactionList(Long accountId);

    TransactionDetailResponseDTO getTransactionInfo(Long transactionId);

    String getAccountName(String accountNumber);

    void connectMyDataAccount(String tokenHeader, boolean myDataStatus);

    BankTransferResponseDTO addFundsToAccount(AccountTransferRequestDTO requestDTO);

    MonthlyTransactionHistoryListDTO getMonthlyTransactionHistory(String tokenHeader,
        MonthlyTransactionRequestDTO requestDTO);

    Map<Category, Long> getTransactionByGroupCategory(BankToAnalysisMessageRequestDTO requestDTO);

    SearchedTransactionResponseDTO searchTransaction(SearchTransactionRequestDTO searchTransactionRequestDTO);

    PaymentResponseDTO qrPayment(Long accountId, PaymentRequestDTO paymentRequestDTO);

    Map<Category, Long> getMyTransactionByCategory(String phoneNumber,
        MonthlyTransactionRequestDTO requestDTO);
}
