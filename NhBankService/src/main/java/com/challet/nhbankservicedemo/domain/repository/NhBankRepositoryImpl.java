package com.challet.nhbankservicedemo.domain.repository;

import com.challet.nhbankservicedemo.domain.dto.request.BankToAnalysisMessageRequestDTO;
import com.challet.nhbankservicedemo.domain.dto.request.MonthlyTransactionRequestDTO;
import com.challet.nhbankservicedemo.domain.dto.response.AccountInfoResponseDTO;
import com.challet.nhbankservicedemo.domain.dto.response.AccountInfoResponseListDTO;
import com.challet.nhbankservicedemo.domain.dto.response.CategoryAmountMonthResponseDTO;
import com.challet.nhbankservicedemo.domain.dto.response.CategoryAmountResponseDTO;
import com.challet.nhbankservicedemo.domain.dto.response.MonthlyTransactionHistoryDTO;
import com.challet.nhbankservicedemo.domain.dto.response.MonthlyTransactionHistoryListDTO;
import com.challet.nhbankservicedemo.domain.dto.response.TransactionDetailResponseDTO;
import com.challet.nhbankservicedemo.domain.dto.response.TransactionResponseDTO;
import com.challet.nhbankservicedemo.domain.entity.Category;
import com.challet.nhbankservicedemo.domain.entity.NhBank;
import com.challet.nhbankservicedemo.domain.entity.QNhBank;
import com.challet.nhbankservicedemo.domain.entity.QNhBankTransaction;
import com.querydsl.core.types.Projections;
import com.querydsl.core.types.dsl.Expressions;
import com.querydsl.jpa.impl.JPAQueryFactory;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Repository;

@Repository
@RequiredArgsConstructor
public class NhBankRepositoryImpl implements NhBankRepositoryCustom {

    private static final int BATCH_SIZE = 1000;

    private final JPAQueryFactory query;

    @Override
    public AccountInfoResponseListDTO getAccountInfoByPhoneNumber(String phoneNumber) {
        QNhBank bank = QNhBank.nhBank;
        List<AccountInfoResponseDTO> accountList = query.select(
                Projections.constructor(AccountInfoResponseDTO.class,
                    bank.id,
                    bank.accountNumber,
                    bank.accountBalance))
            .from(bank)
            .where(bank.phoneNumber.eq(phoneNumber)
                .and(bank.myDataStatus.isTrue()))
            .fetch();

        return AccountInfoResponseListDTO.
            builder()
            .accountCount(accountList.size())
            .accounts(accountList)
            .build();
    }

    @Override
    public List<TransactionResponseDTO> getTransactionByAccountId(Long accountId) {
        QNhBankTransaction bankTransaction = QNhBankTransaction.nhBankTransaction;
        QNhBank bank = QNhBank.nhBank;

        return query
            .select(Projections.constructor(TransactionResponseDTO.class,
                bankTransaction.id,
                bankTransaction.transactionDatetime,
                bankTransaction.deposit,
                bankTransaction.withdrawal,
                bankTransaction.transactionBalance,
                bankTransaction.transactionAmount))
            .from(bankTransaction)
            .join(bankTransaction.nhBank, bank)
            .where(bank.id.eq(accountId))
            .orderBy(bankTransaction.transactionDatetime.desc())
            .fetch();
    }

    @Override
    public TransactionDetailResponseDTO getTransactionDetailById(Long transactionId) {
        QNhBankTransaction bankTransaction = QNhBankTransaction.nhBankTransaction;

        return query
            .select(Projections.constructor(TransactionDetailResponseDTO.class,
                bankTransaction.transactionAmount,
                bankTransaction.transactionDatetime,
                bankTransaction.deposit,
                bankTransaction.withdrawal,
                bankTransaction.transactionBalance,
                bankTransaction.category))
            .from(bankTransaction)
            .where(bankTransaction.id.eq(transactionId))
            .fetchOne();
    }


    @Override
    public Long findAccountBalanceById(Long accountId) {
        QNhBank bank = QNhBank.nhBank;

        return query
            .select(bank.accountBalance)
            .from(bank)
            .where(bank.id.eq(accountId))
            .fetchOne();
    }

    @Override
    public void connectMyDataAccount(String phoneNumber, boolean myDataStatus) {
        QNhBank nhBank = QNhBank.nhBank;
        query
            .update(nhBank)
            .set(nhBank.myDataStatus, myDataStatus)
            .where(nhBank.phoneNumber.eq(phoneNumber))
            .execute();
    }

    @Override
    public Optional<NhBank> findByAccountNumber(String accountNumber) {
        QNhBank nhBank = QNhBank.nhBank;
        NhBank result = query
            .selectFrom(nhBank)
            .where(nhBank.accountNumber.eq(accountNumber))
            .fetchOne();
        return Optional.ofNullable(result);
    }

    @Override
    public MonthlyTransactionHistoryListDTO getTransactionByPhoneNumberAndYearMonth(
        String phoneNumber, MonthlyTransactionRequestDTO requestDTO) {
        QNhBankTransaction nhBankTransaction = QNhBankTransaction.nhBankTransaction;
        QNhBank nhbank = QNhBank.nhBank;

        List<MonthlyTransactionHistoryDTO> result = query
            .select(Projections.constructor(MonthlyTransactionHistoryDTO.class,
                Expressions.constant("nh-bank"),
                nhbank.accountNumber,
                nhbank.accountBalance,
                nhBankTransaction.transactionDatetime,
                nhBankTransaction.deposit,
                nhBankTransaction.withdrawal,
                nhBankTransaction.transactionBalance,
                nhBankTransaction.transactionAmount,
                nhBankTransaction.category))
            .from(nhBankTransaction)
            .join(nhBankTransaction.nhBank, nhbank)
            .where(nhbank.phoneNumber.eq(phoneNumber)
                .and(nhbank.myDataStatus.isTrue())
                .and(nhBankTransaction.transactionDatetime.year().eq(requestDTO.year()))
                .and(nhBankTransaction.transactionDatetime.month().eq(requestDTO.month())))
            .orderBy(nhBankTransaction.transactionDatetime.desc())
            .fetch();

        return MonthlyTransactionHistoryListDTO.from(result);
    }

    @Override
    public Map<Category, Long> getTransactionByGroupCategory(
        BankToAnalysisMessageRequestDTO requestDTO) {
        QNhBankTransaction nhBankTransaction = QNhBankTransaction.nhBankTransaction;
        QNhBank nhbank = QNhBank.nhBank;

        List<String> phoneNumbers = requestDTO.getUserInfo();
        Map<Category, Long> categorySums = new HashMap<>();

        for (int i = 0; i < phoneNumbers.size(); i += BATCH_SIZE) {
            List<String> subListPhoneNumbers = subList(i, phoneNumbers);
            List<CategoryAmountResponseDTO> results = getCategoryList(requestDTO, nhBankTransaction,
                nhbank, subListPhoneNumbers);
            addCategoryList(results, categorySums);
        }
        return categorySums;
    }

    private List<String> subList(int start, List<String> phoneNumbers) {
        int end = Math.min(start + BATCH_SIZE, phoneNumbers.size());
        return phoneNumbers.subList(start, end);
    }

    private List<CategoryAmountResponseDTO> getCategoryList(
        BankToAnalysisMessageRequestDTO requestDTO,
        QNhBankTransaction nhBankTransaction, QNhBank nhbank, List<String> subListPhoneNumbers) {
        return query
            .select(Projections.constructor(CategoryAmountResponseDTO.class,
                nhBankTransaction.category,
                nhBankTransaction.transactionAmount.sum(),
                nhbank.phoneNumber.countDistinct()))
            .from(nhBankTransaction)
            .join(nhBankTransaction.nhBank, nhbank)
            .where(nhbank.phoneNumber.in(subListPhoneNumbers)
                .and(nhbank.myDataStatus.isTrue())
                .and(nhBankTransaction.transactionDatetime.year().eq(requestDTO.getYear()))
                .and(nhBankTransaction.transactionDatetime.month().eq(requestDTO.getMonth()))
                .and(nhBankTransaction.category.in(Category.COFFEE, Category.DELIVERY,
                    Category.SHOPPING, Category.TRANSPORT, Category.ETC))
                .and(nhBankTransaction.transactionAmount.lt(0)))
            .groupBy(nhBankTransaction.category)
            .fetch();
    }

    private static void addCategoryList(List<CategoryAmountResponseDTO> results,
        Map<Category, Long> categorySums) {
        for (CategoryAmountResponseDTO result : results) {
            categorySums.put(result.category(),
                categorySums.getOrDefault(result.category(), 0l) + (result.totalAmount()
                    / result.count()));
        }
    }

    @Override
    public Map<Category, Long> getMyTransactionByCategory(
        String phoneNumber, MonthlyTransactionRequestDTO requestDTO) {
        QNhBankTransaction nhBankTransaction = QNhBankTransaction.nhBankTransaction;
        QNhBank nhBank = QNhBank.nhBank;

        Map<Category, Long> categorySums = new HashMap<>();

        List<CategoryAmountMonthResponseDTO> results = getCategoryMyList(requestDTO,
            nhBankTransaction, nhBank, phoneNumber);

        for (CategoryAmountMonthResponseDTO result : results) {
            categorySums.put(result.category(),
                categorySums.getOrDefault(result.category(), 0l) + (result.totalAmount()));
        }
        return categorySums;
    }

    private List<CategoryAmountMonthResponseDTO> getCategoryMyList(MonthlyTransactionRequestDTO requestDTO,
        QNhBankTransaction nhBankTransaction, QNhBank nhBank, String phoneNumber) {
        return query
            .select(Projections.constructor(CategoryAmountMonthResponseDTO.class,
                nhBankTransaction.category,
                nhBankTransaction.transactionAmount.sum()))
            .from(nhBankTransaction)
            .join(nhBankTransaction.nhBank, nhBank)
            .where(
                nhBank.phoneNumber.eq(phoneNumber)
                    .and(nhBank.myDataStatus.isTrue())
                    .and(nhBankTransaction.transactionDatetime.year().eq(requestDTO.year()))
                    .and(nhBankTransaction.transactionDatetime.month().eq(requestDTO.month()))
                    .and(nhBankTransaction.category.in(Category.COFFEE, Category.DELIVERY,
                        Category.SHOPPING, Category.TRANSPORT, Category.ETC))
                    .and(nhBankTransaction.transactionAmount.lt(0)))
            .groupBy(nhBankTransaction.category)
            .fetch();
    }
}