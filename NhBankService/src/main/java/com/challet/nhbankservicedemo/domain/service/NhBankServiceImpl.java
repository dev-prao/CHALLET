package com.challet.nhbankservicedemo.domain.service;

import com.challet.nhbankservicedemo.domain.dto.request.AccountTransferRequestDTO;
import com.challet.nhbankservicedemo.domain.dto.request.BankToAnalysisMessageRequestDTO;
import com.challet.nhbankservicedemo.domain.dto.request.MonthlyTransactionRequestDTO;
import com.challet.nhbankservicedemo.domain.dto.request.PaymentRequestDTO;
import com.challet.nhbankservicedemo.domain.dto.request.SearchTransactionRequestDTO;
import com.challet.nhbankservicedemo.domain.dto.response.AccountInfoResponseListDTO;
import com.challet.nhbankservicedemo.domain.dto.response.BankTransferResponseDTO;
import com.challet.nhbankservicedemo.domain.dto.response.MonthlyTransactionHistoryListDTO;
import com.challet.nhbankservicedemo.domain.dto.response.PaymentResponseDTO;
import com.challet.nhbankservicedemo.domain.dto.response.SearchedTransactionResponseDTO;
import com.challet.nhbankservicedemo.domain.dto.response.TransactionDetailResponseDTO;
import com.challet.nhbankservicedemo.domain.dto.response.TransactionResponseDTO;
import com.challet.nhbankservicedemo.domain.dto.response.TransactionResponseListDTO;
import com.challet.nhbankservicedemo.domain.elasticsearch.repository.SearchedTransactionRepository;
import com.challet.nhbankservicedemo.domain.entity.Category;
import com.challet.nhbankservicedemo.domain.entity.NhBank;
import com.challet.nhbankservicedemo.domain.entity.NhBankTransaction;
import com.challet.nhbankservicedemo.domain.entity.SearchedTransaction;
import com.challet.nhbankservicedemo.domain.repository.NhBankRepository;
import com.challet.nhbankservicedemo.domain.repository.NhBankTransactionRepository;
import com.challet.nhbankservicedemo.global.exception.CustomException;
import com.challet.nhbankservicedemo.global.exception.ExceptionResponse;
import com.challet.nhbankservicedemo.global.util.JwtUtil;
import com.querydsl.core.NonUniqueResultException;
import jakarta.transaction.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import lombok.RequiredArgsConstructor;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class NhBankServiceImpl implements NhBankService {

    private final NhBankRepository nhBankRepository;
    private final NhBankTransactionRepository nhBankTransactionRepository;
    private final SearchedTransactionRepository searchedTransactionRepository;
    private final JwtUtil jwtUtil;

    @Override
    public AccountInfoResponseListDTO getAccountsByPhoneNumber(String tokenHeader) {
        String loginUserPhoneNumber = jwtUtil.getLoginUserPhoneNumber(tokenHeader);
        return nhBankRepository.getAccountInfoByPhoneNumber(
            loginUserPhoneNumber);
    }

    @Transactional
    @Override
    public TransactionResponseListDTO getAccountTransactionList(Long accountId) {
        Long accountBalance = nhBankRepository.findAccountBalanceById(accountId);
        List<TransactionResponseDTO> transactionList = nhBankRepository.getTransactionByAccountId(
            accountId);

        return TransactionResponseListDTO
            .builder()
            .transactionCount((long) transactionList.size())
            .accountBalance(accountBalance)
            .transactionResponseDTO(transactionList).build();
    }

    @Override
    public TransactionDetailResponseDTO getTransactionInfo(Long transactionId) {
        try {
            return Optional.ofNullable(
                    nhBankRepository.getTransactionDetailById(transactionId))
                .orElseThrow(() -> new ExceptionResponse(
                    CustomException.NOT_FOUND_TRANSACTION_DETAIL_EXCEPTION));
        } catch (NonUniqueResultException e) {
            throw new ExceptionResponse(CustomException.NOT_GET_TRANSACTION_DETAIL_EXCEPTION);
        }
    }

    @Override
    public String getAccountName(String accountNumber) {
        String memberName = nhBankRepository.findByAccountNumber(accountNumber)
            .orElseThrow(() -> new ExceptionResponse(CustomException.ACCOUNT_NOT_FOUND_EXCEPTION))
            .getName();
        return memberName;
    }

    @Transactional
    @Override
    public void connectMyDataAccount(String tokenHeader, boolean myDataStatus) {
        String phoneNumber = jwtUtil.getLoginUserPhoneNumber(tokenHeader);
        nhBankRepository.connectMyDataAccount(phoneNumber, myDataStatus);
    }

    @Transactional
    @Override
    public BankTransferResponseDTO addFundsToAccount(AccountTransferRequestDTO requestDTO) {
        NhBank nhBank = nhBankRepository.findByAccountNumber(requestDTO.depositAccountNumber())
            .orElseThrow(() -> new ExceptionResponse(CustomException.ACCOUNT_NOT_FOUND_EXCEPTION));

        long accountTransactionBalance = nhBank.getAccountBalance() + requestDTO.amount();
        NhBankTransaction transaction = NhBankTransaction.createAccountTransferHistory(nhBank,
            requestDTO, accountTransactionBalance, "ETC");

        nhBank.addTransaction(transaction);
        NhBankTransaction savedToTransaction = nhBankTransactionRepository.save(transaction);
        searchedTransactionRepository.save(SearchedTransaction.fromAccountTransferByTo(savedToTransaction));

        return BankTransferResponseDTO.fromBankTransferResponseDTO(nhBank);
    }

    @Override
    public MonthlyTransactionHistoryListDTO getMonthlyTransactionHistory(String tokenHeader,
        MonthlyTransactionRequestDTO requestDTO) {
        String phoneNumber = jwtUtil.getLoginUserPhoneNumber(tokenHeader);
        MonthlyTransactionHistoryListDTO transactions = nhBankRepository.getTransactionByPhoneNumberAndYearMonth(
            phoneNumber, requestDTO);

        return transactions;
    }

    @Override
    public Map<Category, Long> getTransactionByGroupCategory(
        BankToAnalysisMessageRequestDTO requestDTO) {
        return nhBankRepository.getTransactionByGroupCategory(requestDTO);
    }

    @Override
    public SearchedTransactionResponseDTO searchTransaction(
        final SearchTransactionRequestDTO searchTransactionRequestDTO) {
        Pageable pageable = PageRequest.of(
            searchTransactionRequestDTO.page(),
            searchTransactionRequestDTO.size(),
            Sort.by(Sort.Order.desc("transactionDate"))
        );

        Page<SearchedTransaction> searchedTransactions = getResult(searchTransactionRequestDTO,
            pageable);

        boolean isLastPage = searchedTransactions.isLast();

        return SearchedTransactionResponseDTO.fromSearchedTransaction(
            searchedTransactions.getContent(), isLastPage);
    }

    private Page<SearchedTransaction> getResult(
        SearchTransactionRequestDTO searchTransactionRequestDTO, Pageable pageable) {
        if (searchTransactionRequestDTO.keyword() != null && !searchTransactionRequestDTO.keyword()
            .isEmpty()) {
            return searchedTransactionRepository.findByAccountIdAndKeyword(
                searchTransactionRequestDTO.accountId(), searchTransactionRequestDTO.keyword(),
                pageable);
        }
        return searchedTransactionRepository.findByAccountId(
            searchTransactionRequestDTO.accountId(), pageable);
    }

    @org.springframework.transaction.annotation.Transactional
    @Override
    public PaymentResponseDTO qrPayment(Long accountId, PaymentRequestDTO paymentRequestDTO) {

        NhBank nhBank = nhBankRepository.findById(accountId)
            .orElseThrow(() -> new ExceptionResponse(CustomException.ACCOUNT_NOT_FOUND_EXCEPTION));
        long transactionBalance = calculateTransactionBalance(nhBank,
            paymentRequestDTO.transactionAmount());

        NhBankTransaction paymentTransaction = createTransaction(nhBank, paymentRequestDTO,
            transactionBalance);

        nhBank.addTransaction(paymentTransaction);

        nhBankTransactionRepository.save(paymentTransaction);


        searchedTransactionRepository.save(SearchedTransaction.fromAccountIdAndNhBankTransaction(accountId, paymentTransaction));

        return PaymentResponseDTO.fromPaymentResponseDTO(paymentTransaction);
    }

    private long calculateTransactionBalance(NhBank kbBank, long transactionAmount) {
        long transactionBalance = kbBank.getAccountBalance() - transactionAmount;
        if (transactionBalance < 0) {
            throw new ExceptionResponse(CustomException.NOT_ENOUGH_FUNDS_EXCEPTION);
        }
        return transactionBalance;
    }

    private NhBankTransaction createTransaction(NhBank kbBank,
        PaymentRequestDTO paymentRequestDTO, long transactionBalance) {
        return NhBankTransaction.builder()
            .transactionAmount(-1 * paymentRequestDTO.transactionAmount())
            .transactionDatetime(LocalDateTime.now())
            .deposit(paymentRequestDTO.deposit())
            .withdrawal(kbBank.getAccountNumber())
            .transactionBalance(transactionBalance)
            .build();
    }

    @Override
    public Map<Category, Long> getMyTransactionByCategory(String tokenHeader,
        MonthlyTransactionRequestDTO requestDTO) {
        String phoneNumber = jwtUtil.getLoginUserPhoneNumber(tokenHeader);
        return nhBankRepository.getMyTransactionByCategory(phoneNumber, requestDTO);
    }
}
