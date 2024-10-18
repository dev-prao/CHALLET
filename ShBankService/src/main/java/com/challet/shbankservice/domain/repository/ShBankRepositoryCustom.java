package com.challet.shbankservice.domain.repository;

import com.challet.shbankservice.domain.dto.request.BankToAnalysisMessageRequestDTO;
import com.challet.shbankservice.domain.dto.request.MonthlyTransactionRequestDTO;
import com.challet.shbankservice.domain.dto.response.AccountInfoResponseListDTO;
import com.challet.shbankservice.domain.dto.response.MonthlyTransactionHistoryListDTO;
import com.challet.shbankservice.domain.dto.response.TransactionDetailResponseDTO;
import com.challet.shbankservice.domain.dto.response.TransactionResponseDTO;
import com.challet.shbankservice.domain.entity.Category;
import com.challet.shbankservice.domain.entity.ShBank;
import java.util.List;
import java.util.Map;
import java.util.Optional;

public interface ShBankRepositoryCustom {

    AccountInfoResponseListDTO getAccountInfoByPhoneNumber(String phoneNumber);

    List<TransactionResponseDTO> getTransactionByAccountId(Long accountId);

    TransactionDetailResponseDTO getTransactionDetailById(Long transactionId);

    Long getAccountBalanceById(Long accountId);

    void connectMyDataAccount(String phoneNumber, boolean myDataStatus);

    Optional<ShBank> findByAccountNumber(String accountNumber);

    MonthlyTransactionHistoryListDTO getTransactionByPhoneNumberAndYearMonth(String phoneNumber,
        MonthlyTransactionRequestDTO requestDTO);

    Map<Category, Long> getTransactionByGroupCategory(BankToAnalysisMessageRequestDTO requestDTO);

    Map<Category, Long> getMyTransactionByCategory(String tokenHeader,
        MonthlyTransactionRequestDTO requestDTO);
}
