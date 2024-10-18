package com.challet.kbbankservice.domain.repository;

import com.challet.kbbankservice.domain.dto.request.BankToAnalysisMessageRequestDTO;
import com.challet.kbbankservice.domain.dto.request.MonthlyTransactionRequestDTO;
import com.challet.kbbankservice.domain.dto.response.AccountInfoResponseDTO;
import com.challet.kbbankservice.domain.dto.response.AccountInfoResponseListDTO;
import com.challet.kbbankservice.domain.dto.response.CategoryAmountMonthResponseDTO;
import com.challet.kbbankservice.domain.dto.response.CategoryAmountResponseDTO;
import com.challet.kbbankservice.domain.dto.response.MonthlyTransactionHistoryDTO;
import com.challet.kbbankservice.domain.dto.response.MonthlyTransactionHistoryListDTO;
import com.challet.kbbankservice.domain.dto.response.TransactionDetailResponseDTO;
import com.challet.kbbankservice.domain.dto.response.TransactionResponseDTO;
import com.challet.kbbankservice.domain.entity.Category;
import com.challet.kbbankservice.domain.entity.KbBank;
import com.challet.kbbankservice.domain.entity.QKbBank;
import com.challet.kbbankservice.domain.entity.QKbBankTransaction;
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
public class KbBankRepositoryImpl implements KbBankRepositoryCustom {

    private static final int BATCH_SIZE = 1000;

    private final JPAQueryFactory query;

    @Override
    public AccountInfoResponseListDTO getAccountInfoByPhoneNumber(String phoneNumber) {
        QKbBank bank = QKbBank.kbBank;
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
        QKbBankTransaction bankTransaction = QKbBankTransaction.kbBankTransaction;
        QKbBank bank = QKbBank.kbBank;

        return query
            .select(Projections.constructor(TransactionResponseDTO.class,
                bankTransaction.id,
                bankTransaction.transactionDatetime,
                bankTransaction.deposit,
                bankTransaction.withdrawal,
                bankTransaction.transactionBalance,
                bankTransaction.transactionAmount))
            .from(bankTransaction)
            .join(bankTransaction.kbBank, bank)
            .where(bank.id.eq(accountId))
            .orderBy(bankTransaction.transactionDatetime.desc())
            .fetch();
    }

    @Override
    public TransactionDetailResponseDTO getTransactionDetailById(Long transactionId) {
        QKbBankTransaction bankTransaction = QKbBankTransaction.kbBankTransaction;

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
        QKbBank bank = QKbBank.kbBank;

        return query
            .select(bank.accountBalance)
            .from(bank)
            .where(bank.id.eq(accountId))
            .fetchOne();
    }

    @Override
    public void connectMyDataAccount(String phoneNumber, boolean myDataStatus) {
        QKbBank bank = QKbBank.kbBank;
        query
            .update(bank)
            .set(bank.myDataStatus, myDataStatus)
            .where(bank.phoneNumber.eq(phoneNumber))
            .execute();
    }

    @Override
    public Optional<KbBank> findByAccountNumber(String accountNumber) {
        QKbBank kbBank = QKbBank.kbBank;
        KbBank result = query
            .selectFrom(kbBank)
            .where(kbBank.accountNumber.eq(accountNumber))
            .fetchOne();

        return Optional.ofNullable(result);
    }

    @Override
    public MonthlyTransactionHistoryListDTO getTransactionByPhoneNumberAndYearMonth(
        String phoneNumber, MonthlyTransactionRequestDTO requestDTO) {
        QKbBankTransaction kbBankTransaction = QKbBankTransaction.kbBankTransaction;
        QKbBank kbBank = QKbBank.kbBank;

        List<MonthlyTransactionHistoryDTO> result = query
            .select(Projections.constructor(MonthlyTransactionHistoryDTO.class,
                Expressions.constant("kb-bank"),
                kbBank.accountNumber,
                kbBank.accountBalance,
                kbBankTransaction.transactionDatetime,
                kbBankTransaction.deposit,
                kbBankTransaction.withdrawal,
                kbBankTransaction.transactionBalance,
                kbBankTransaction.transactionAmount,
                kbBankTransaction.category))
            .from(kbBankTransaction)
            .join(kbBankTransaction.kbBank, kbBank)
            .where(kbBank.phoneNumber.eq(phoneNumber)
                .and(kbBank.myDataStatus.isTrue())
                .and(kbBankTransaction.transactionDatetime.year().eq(requestDTO.year()))
                .and(kbBankTransaction.transactionDatetime.month().eq(requestDTO.month())))
            .orderBy(kbBankTransaction.transactionDatetime.desc())
            .fetch();

        return MonthlyTransactionHistoryListDTO.from(result);
    }

    @Override
    public Map<Category, Long> getTransactionByGroupCategory(
        BankToAnalysisMessageRequestDTO requestDTO) {
        QKbBankTransaction kbBankTransaction = QKbBankTransaction.kbBankTransaction;
        QKbBank kbBank = QKbBank.kbBank;

        List<String> phoneNumbers = requestDTO.getUserInfo();
        Map<Category, Long> categorySums = new HashMap<>();

        for (int i = 0; i < phoneNumbers.size(); i += BATCH_SIZE) {
            List<String> subListPhoneNumbers = subList(i, phoneNumbers);
            List<CategoryAmountResponseDTO> results = getCategoryList(requestDTO, kbBankTransaction,
                kbBank, subListPhoneNumbers);
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
        QKbBankTransaction kbBankTransaction, QKbBank kbBank, List<String> subListPhoneNumbers) {
        return query
            .select(Projections.constructor(CategoryAmountResponseDTO.class,
                kbBankTransaction.category,
                kbBankTransaction.transactionAmount.sum(),
                kbBank.phoneNumber.countDistinct()))
            .from(kbBankTransaction)
            .join(kbBankTransaction.kbBank, kbBank)
            .where(
                kbBank.phoneNumber.in(subListPhoneNumbers)
                .and(kbBank.myDataStatus.isTrue())
                .and(kbBankTransaction.transactionDatetime.year().eq(requestDTO.getYear()))
                .and(kbBankTransaction.transactionDatetime.month().eq(requestDTO.getMonth()))
                .and(kbBankTransaction.category.in(Category.COFFEE, Category.DELIVERY,
                    Category.SHOPPING, Category.TRANSPORT, Category.ETC))
                .and(kbBankTransaction.transactionAmount.lt(0)))
            .groupBy(kbBankTransaction.category)
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
        QKbBankTransaction kbBankTransaction = QKbBankTransaction.kbBankTransaction;
        QKbBank kbBank = QKbBank.kbBank;

        Map<Category, Long> categorySums = new HashMap<>();

        List<CategoryAmountMonthResponseDTO> results = getCategoryMyList(requestDTO,
            kbBankTransaction, kbBank, phoneNumber);

        for (CategoryAmountMonthResponseDTO result : results) {
            categorySums.put(result.category(),
                categorySums.getOrDefault(result.category(), 0l) + (result.totalAmount()));
        }
        return categorySums;
    }

    private List<CategoryAmountMonthResponseDTO> getCategoryMyList(MonthlyTransactionRequestDTO requestDTO,
        QKbBankTransaction kbBankTransaction, QKbBank kbBank, String phoneNumber) {
        return query
            .select(Projections.constructor(CategoryAmountMonthResponseDTO.class,
                kbBankTransaction.category,
                kbBankTransaction.transactionAmount.sum()))
            .from(kbBankTransaction)
            .join(kbBankTransaction.kbBank, kbBank)
            .where(
                kbBank.phoneNumber.eq(phoneNumber)
                    .and(kbBank.myDataStatus.isTrue())
                    .and(kbBankTransaction.transactionDatetime.year().eq(requestDTO.year()))
                    .and(kbBankTransaction.transactionDatetime.month().eq(requestDTO.month()))
                    .and(kbBankTransaction.category.in(Category.COFFEE, Category.DELIVERY,
                        Category.SHOPPING, Category.TRANSPORT, Category.ETC))
                    .and(kbBankTransaction.transactionAmount.lt(0)))
            .groupBy(kbBankTransaction.category)
            .fetch();
    }
}
