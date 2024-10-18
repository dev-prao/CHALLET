package com.challet.nhbankservicedemo.domain.repository;

import com.challet.nhbankservicedemo.domain.dto.request.BankToAnalysisMessageRequestDTO;
import com.challet.nhbankservicedemo.domain.dto.request.MonthlyTransactionRequestDTO;
import com.challet.nhbankservicedemo.domain.dto.response.AccountInfoResponseListDTO;
import com.challet.nhbankservicedemo.domain.dto.response.MonthlyTransactionHistoryListDTO;
import com.challet.nhbankservicedemo.domain.dto.response.TransactionDetailResponseDTO;
import com.challet.nhbankservicedemo.domain.dto.response.TransactionResponseDTO;
import com.challet.nhbankservicedemo.domain.entity.Category;
import com.challet.nhbankservicedemo.domain.entity.NhBank;
import java.util.List;
import java.util.Map;
import java.util.Optional;

public interface NhBankRepositoryCustom {

    AccountInfoResponseListDTO getAccountInfoByPhoneNumber(String phoneNumber);

    List<TransactionResponseDTO> getTransactionByAccountId(Long accountId);

    TransactionDetailResponseDTO getTransactionDetailById(Long transactionId);

    Long findAccountBalanceById(Long accountId);

    void connectMyDataAccount(String phoneNumber, boolean myDataStatus);

    Optional<NhBank> findByAccountNumber(String accountNumber);

    MonthlyTransactionHistoryListDTO getTransactionByPhoneNumberAndYearMonth(String phoneNumber,
        MonthlyTransactionRequestDTO requestDTO);

    Map<Category, Long> getTransactionByGroupCategory(BankToAnalysisMessageRequestDTO requestDTO);

    Map<Category, Long> getMyTransactionByCategory(String tokenHeader,
        MonthlyTransactionRequestDTO requestDTO);
}