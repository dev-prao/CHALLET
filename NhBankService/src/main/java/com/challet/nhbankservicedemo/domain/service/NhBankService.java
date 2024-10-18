package com.challet.nhbankservicedemo.domain.service;

import com.challet.nhbankservicedemo.domain.dto.request.AccountTransferRequestDTO;
import com.challet.nhbankservicedemo.domain.dto.request.BankToAnalysisMessageRequestDTO;
import com.challet.nhbankservicedemo.domain.dto.request.MonthlyTransactionRequestDTO;
import com.challet.nhbankservicedemo.domain.dto.request.PaymentRequestDTO;
import com.challet.nhbankservicedemo.domain.dto.request.SearchTransactionRequestDTO;
import com.challet.nhbankservicedemo.domain.dto.response.AccountInfoResponseListDTO;
import com.challet.nhbankservicedemo.domain.dto.response.BankTransferResponseDTO;
import com.challet.nhbankservicedemo.domain.dto.response.CategoryAmountResponseListDTO;
import com.challet.nhbankservicedemo.domain.dto.response.MonthlyTransactionHistoryListDTO;
import com.challet.nhbankservicedemo.domain.dto.response.PaymentResponseDTO;
import com.challet.nhbankservicedemo.domain.dto.response.SearchedTransactionResponseDTO;
import com.challet.nhbankservicedemo.domain.dto.response.TransactionDetailResponseDTO;
import com.challet.nhbankservicedemo.domain.dto.response.TransactionResponseListDTO;
import com.challet.nhbankservicedemo.domain.entity.Category;
import java.util.Map;

public interface NhBankService {

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
