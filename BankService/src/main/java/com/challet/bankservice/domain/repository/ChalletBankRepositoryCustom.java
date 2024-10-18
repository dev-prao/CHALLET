package com.challet.bankservice.domain.repository;

import com.challet.bankservice.domain.dto.request.MonthlyTransactionRequestDTO;
import com.challet.bankservice.domain.dto.request.UserInfoMessageRequestDTO;
import com.challet.bankservice.domain.dto.response.AccountInfoResponseListDTO;
import com.challet.bankservice.domain.dto.response.MonthlyTransactionHistoryListDTO;
import com.challet.bankservice.domain.dto.response.TransactionDetailResponseDTO;
import com.challet.bankservice.domain.dto.response.TransactionResponseDTO;
import com.challet.bankservice.domain.entity.Category;
import com.challet.bankservice.domain.entity.ChalletBank;
import java.util.List;
import java.util.Map;

public interface ChalletBankRepositoryCustom {

    AccountInfoResponseListDTO getAccountInfoByPhoneNumber(String phoneNumber);

    List<TransactionResponseDTO> getTransactionByAccountId(Long accountId);

    TransactionDetailResponseDTO getTransactionDetailById(Long transactionId);

    Long findAccountBalanceById(Long accountId);

    ChalletBank findByIdWithLock(Long accountId);

    boolean isMyDataConnectedByPhoneNumber(String phoneNumber);

    ChalletBank getAccountByAccountNumber(String accountNumber);

    MonthlyTransactionHistoryListDTO getTransactionByPhoneNumberAndYearMonth(String phoneNumber,
        MonthlyTransactionRequestDTO requestDTO);

    Map<Category, Long> getTransactionByGroupCategory(
        UserInfoMessageRequestDTO analysisInfo,
        MonthlyTransactionRequestDTO requestDTO);

    String getCategoryName(Long accountId, String deposit);

    ChalletBank getAccountByPhoneNumber(String phoneNumber);

    Map<Category, Long> getMyTransactionByCategory(String phoneNumber,
        MonthlyTransactionRequestDTO requestDTO);

    String getCheckSameAccount(String phoneNumber);
}
