package com.challet.shbankservice.domain.service;

import java.util.Map;

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

public interface ShBankService {

    AccountInfoResponseListDTO getAccountsByPhoneNumber(String tokenHeader);

    TransactionResponseListDTO getAccountTransactionList(Long accountId);

    TransactionDetailResponseDTO getTransactionInfo(Long transactionId);

    String getAccountName(String accountNumber);

    void connectMyDataAccount(String tokenHeader, boolean myDataStatus);

    BankTransferResponseDTO addFundsToAccount(AccountTransferRequestDTO requestDTO);

    MonthlyTransactionHistoryListDTO getMonthlyTransactionHistory(String tokenHeader,
        MonthlyTransactionRequestDTO requestDTO);

    Map<Category, Long> getTransactionByGroupCategory(BankToAnalysisMessageRequestDTO requestDTO);

    SearchedTransactionResponseDTO searchTransaction(
        SearchTransactionRequestDTO searchTransactionRequestDTO);

    PaymentResponseDTO qrPayment(Long accountId, PaymentRequestDTO paymentRequestDTO);

    Map<Category, Long> getMyTransactionByCategory(String phoneNumber,
        MonthlyTransactionRequestDTO requestDTO);
}
