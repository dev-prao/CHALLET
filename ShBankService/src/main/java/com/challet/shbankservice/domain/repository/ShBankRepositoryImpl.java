package com.challet.shbankservice.domain.repository;

import com.challet.shbankservice.domain.dto.request.BankToAnalysisMessageRequestDTO;
import com.challet.shbankservice.domain.dto.request.MonthlyTransactionRequestDTO;
import com.challet.shbankservice.domain.dto.response.AccountInfoResponseDTO;
import com.challet.shbankservice.domain.dto.response.AccountInfoResponseListDTO;
import com.challet.shbankservice.domain.dto.response.CategoryAmountMonthResponseDTO;
import com.challet.shbankservice.domain.dto.response.CategoryAmountResponseDTO;
import com.challet.shbankservice.domain.dto.response.MonthlyTransactionHistoryDTO;
import com.challet.shbankservice.domain.dto.response.MonthlyTransactionHistoryListDTO;
import com.challet.shbankservice.domain.dto.response.TransactionDetailResponseDTO;
import com.challet.shbankservice.domain.dto.response.TransactionResponseDTO;
import com.challet.shbankservice.domain.entity.Category;
import com.challet.shbankservice.domain.entity.QShBank;
import com.challet.shbankservice.domain.entity.QShBankTransaction;
import com.challet.shbankservice.domain.entity.ShBank;
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
public class ShBankRepositoryImpl implements ShBankRepositoryCustom {

    private static final int BATCH_SIZE = 1000;

    private final JPAQueryFactory query;

    @Override
    public AccountInfoResponseListDTO getAccountInfoByPhoneNumber(String phoneNumber) {
        QShBank bank = QShBank.shBank;
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
        QShBankTransaction bankTransaction = QShBankTransaction.shBankTransaction;
        QShBank bank = QShBank.shBank;

        return query
            .select(Projections.constructor(TransactionResponseDTO.class,
                bankTransaction.id,
                bankTransaction.transactionDatetime,
                bankTransaction.deposit,
                bankTransaction.withdrawal,
                bankTransaction.transactionBalance,
                bankTransaction.transactionAmount))
            .from(bankTransaction)
            .join(bankTransaction.shBank, bank)
            .where(bank.id.eq(accountId))
            .orderBy(bankTransaction.transactionDatetime.desc())
            .fetch();
    }

    @Override
    public TransactionDetailResponseDTO getTransactionDetailById(Long transactionId) {
        QShBankTransaction bankTransaction = QShBankTransaction.shBankTransaction;

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
    public Long getAccountBalanceById(Long accountId) {
        QShBank bank = QShBank.shBank;

        return query
            .select(bank.accountBalance)
            .from(bank)
            .where(bank.id.eq(accountId))
            .fetchOne();
    }

    @Override
    public void connectMyDataAccount(String phoneNumber, boolean myDataStatus) {
        QShBank shBank = QShBank.shBank;
        query
            .update(shBank)
            .set(shBank.myDataStatus, myDataStatus)
            .where(shBank.phoneNumber.eq(phoneNumber))
            .execute();
    }

    @Override
    public Optional<ShBank> findByAccountNumber(String accountNumber) {
        QShBank shBank = QShBank.shBank;
        ShBank result = query
            .selectFrom(shBank)
            .where(shBank.accountNumber.eq(accountNumber))
            .fetchOne();

        return Optional.ofNullable(result);
    }

    @Override
    public MonthlyTransactionHistoryListDTO getTransactionByPhoneNumberAndYearMonth(
        String phoneNumber, MonthlyTransactionRequestDTO requestDTO) {
        QShBankTransaction shBankTransaction = QShBankTransaction.shBankTransaction;
        QShBank shbank = QShBank.shBank;

        List<MonthlyTransactionHistoryDTO> result = query
            .select(Projections.constructor(MonthlyTransactionHistoryDTO.class,
                Expressions.constant("sh-bank"),
                shbank.accountNumber,
                shbank.accountBalance,
                shBankTransaction.transactionDatetime,
                shBankTransaction.deposit,
                shBankTransaction.withdrawal,
                shBankTransaction.transactionBalance,
                shBankTransaction.transactionAmount,
                shBankTransaction.category))
            .from(shBankTransaction)
            .join(shBankTransaction.shBank, shbank)
            .where(shbank.phoneNumber.eq(phoneNumber)
                .and(shbank.myDataStatus.isTrue())
                .and(shBankTransaction.transactionDatetime.year().eq(requestDTO.year()))
                .and(shBankTransaction.transactionDatetime.month().eq(requestDTO.month())))
            .orderBy(shBankTransaction.transactionDatetime.desc())
            .fetch();

        return MonthlyTransactionHistoryListDTO.from(result);
    }

    @Override
    public Map<Category, Long> getTransactionByGroupCategory(
        BankToAnalysisMessageRequestDTO requestDTO) {
        QShBankTransaction shBankTransaction = QShBankTransaction.shBankTransaction;
        QShBank shBank = QShBank.shBank;

        List<String> phoneNumbers = requestDTO.getUserInfo();
        Map<Category, Long> categorySums = new HashMap<>();

        for(int i=0; i<phoneNumbers.size(); i+=BATCH_SIZE) {
            List<String> subListPhoneNumbers = subList(i, phoneNumbers);

            List<CategoryAmountResponseDTO> results = getCategoryList(requestDTO, shBankTransaction,
                shBank, subListPhoneNumbers);

            addCategoryList(results, categorySums);
        }
        return categorySums;
    }

    private List<String> subList(int i, List<String> phoneNumbers){
        int end = Math.min(i + BATCH_SIZE, phoneNumbers.size());
        return phoneNumbers.subList(i, end);
    }

    private List<CategoryAmountResponseDTO> getCategoryList(BankToAnalysisMessageRequestDTO requestDTO,
        QShBankTransaction shBankTransaction, QShBank shBank, List<String> subListPhoneNumbers) {
        return query
            .select(Projections.constructor(CategoryAmountResponseDTO.class,
                shBankTransaction.category,
                shBankTransaction.transactionAmount.sum(),
                shBank.phoneNumber.countDistinct()))
            .from(shBankTransaction)
            .join(shBankTransaction.shBank, shBank)
            .where(
                shBank.phoneNumber.in(subListPhoneNumbers)
                    .and(shBank.myDataStatus.isTrue())
                    .and(shBankTransaction.transactionDatetime.year().eq(requestDTO.getYear()))
                    .and(shBankTransaction.transactionDatetime.month().eq(requestDTO.getMonth()))
                    .and(shBankTransaction.category.in(Category.COFFEE, Category.DELIVERY,
                        Category.SHOPPING, Category.TRANSPORT, Category.ETC))
                    .and(shBankTransaction.transactionAmount.lt(0)))
            .groupBy(shBankTransaction.category)
            .fetch();
    }

    private static void addCategoryList(List<CategoryAmountResponseDTO> results,
        Map<Category, Long> categorySums) {
        for (CategoryAmountResponseDTO result : results) {
            categorySums.put(result.category(),
                categorySums.getOrDefault(result.category(), 0l) + (result.totalAmount()/result.count()));
        }
    }

    @Override
    public Map<Category, Long> getMyTransactionByCategory(
        String phoneNumber, MonthlyTransactionRequestDTO requestDTO) {
        QShBankTransaction shBankTransaction = QShBankTransaction.shBankTransaction;
        QShBank shBank = QShBank.shBank;

        Map<Category, Long> categorySums = new HashMap<>();

        List<CategoryAmountMonthResponseDTO> results = getCategoryMyList(requestDTO,
            shBankTransaction, shBank, phoneNumber);

        for (CategoryAmountMonthResponseDTO result : results) {
            categorySums.put(result.category(),
                categorySums.getOrDefault(result.category(), 0l) + (result.totalAmount()));
        }
        return categorySums;
    }

    private List<CategoryAmountMonthResponseDTO> getCategoryMyList(MonthlyTransactionRequestDTO requestDTO,
        QShBankTransaction shBankTransaction, QShBank shBank, String phoneNumber) {
        return query
            .select(Projections.constructor(CategoryAmountMonthResponseDTO.class,
                shBankTransaction.category,
                shBankTransaction.transactionAmount.sum()))
            .from(shBankTransaction)
            .join(shBankTransaction.shBank, shBank)
            .where(
                shBank.phoneNumber.eq(phoneNumber)
                    .and(shBank.myDataStatus.isTrue())
                    .and(shBankTransaction.transactionDatetime.year().eq(requestDTO.year()))
                    .and(shBankTransaction.transactionDatetime.month().eq(requestDTO.month()))
                    .and(shBankTransaction.category.in(Category.COFFEE, Category.DELIVERY,
                        Category.SHOPPING, Category.TRANSPORT, Category.ETC))
                    .and(shBankTransaction.transactionAmount.lt(0)))
            .groupBy(shBankTransaction.category)
            .fetch();
    }
}
