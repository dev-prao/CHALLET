package com.challet.kbbankservice.domain.repository;

import com.challet.kbbankservice.domain.dto.request.BankToAnalysisMessageRequestDTO;
import com.challet.kbbankservice.domain.dto.request.MonthlyTransactionRequestDTO;
import com.challet.kbbankservice.domain.dto.response.AccountInfoResponseListDTO;
import com.challet.kbbankservice.domain.dto.response.MonthlyTransactionHistoryListDTO;
import com.challet.kbbankservice.domain.dto.response.TransactionDetailResponseDTO;
import com.challet.kbbankservice.domain.dto.response.TransactionResponseDTO;
import com.challet.kbbankservice.domain.entity.Category;
import com.challet.kbbankservice.domain.entity.KbBank;
import java.util.List;
import java.util.Map;
import java.util.Optional;

public interface KbBankRepositoryCustom {

    AccountInfoResponseListDTO getAccountInfoByPhoneNumber(String phoneNumber);

    List<TransactionResponseDTO> getTransactionByAccountId(Long accountId);

    TransactionDetailResponseDTO getTransactionDetailById(Long transactionId);

    Long findAccountBalanceById(Long accountId);

    void connectMyDataAccount(String phoneNumber, boolean myDataStatus);

    Optional<KbBank> findByAccountNumber(String accountNumber);

    MonthlyTransactionHistoryListDTO getTransactionByPhoneNumberAndYearMonth(String phoneNumber,
        MonthlyTransactionRequestDTO requestDTO);

    Map<Category, Long> getTransactionByGroupCategory(BankToAnalysisMessageRequestDTO requestDTO);

    Map<Category, Long> getMyTransactionByCategory(String tokenHeader,
        MonthlyTransactionRequestDTO requestDTO);
}
