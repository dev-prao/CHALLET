package com.challet.kbbankservice.domain.service;

import com.challet.kbbankservice.domain.dto.request.AccountTransferRequestDTO;
import com.challet.kbbankservice.domain.dto.request.BankToAnalysisMessageRequestDTO;
import com.challet.kbbankservice.domain.dto.request.MonthlyTransactionRequestDTO;
import com.challet.kbbankservice.domain.dto.request.PaymentRequestDTO;
import com.challet.kbbankservice.domain.dto.request.SearchTransactionRequestDTO;
import com.challet.kbbankservice.domain.dto.response.AccountInfoResponseListDTO;
import com.challet.kbbankservice.domain.dto.response.BankTransferResponseDTO;
import com.challet.kbbankservice.domain.dto.response.MonthlyTransactionHistoryListDTO;
import com.challet.kbbankservice.domain.dto.response.PaymentResponseDTO;
import com.challet.kbbankservice.domain.dto.response.SearchedTransactionResponseDTO;
import com.challet.kbbankservice.domain.dto.response.TransactionDetailResponseDTO;
import com.challet.kbbankservice.domain.dto.response.TransactionResponseDTO;
import com.challet.kbbankservice.domain.dto.response.TransactionResponseListDTO;
import com.challet.kbbankservice.domain.elasticsearch.repository.SearchedTransactionRepository;
import com.challet.kbbankservice.domain.entity.Category;
import com.challet.kbbankservice.domain.entity.KbBank;
import com.challet.kbbankservice.domain.entity.KbBankTransaction;
import com.challet.kbbankservice.domain.entity.SearchedTransaction;
import com.challet.kbbankservice.domain.repository.KbBankRepository;
import com.challet.kbbankservice.domain.repository.KbBankTransactionRepository;
import com.challet.kbbankservice.global.exception.CustomException;
import com.challet.kbbankservice.global.exception.ExceptionResponse;
import com.challet.kbbankservice.global.util.JwtUtil;
import com.querydsl.core.NonUniqueResultException;
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
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class KbBankServiceImpl implements KbBankService {

    private final KbBankRepository kbBankRepository;
    private final SearchedTransactionRepository searchedTransactionRepository;
    private final JwtUtil jwtUtil;
    private final KbBankTransactionRepository kbBankTransactionRepository;

    @Override
    public AccountInfoResponseListDTO getAccountsByPhoneNumber(String tokenHeader) {
        String loginUserPhoneNumber = jwtUtil.getLoginUserPhoneNumber(tokenHeader);
        return kbBankRepository.getAccountInfoByPhoneNumber(
            loginUserPhoneNumber);
    }

    @Transactional
    @Override
    public TransactionResponseListDTO getAccountTransactionList(Long accountId) {
        Long accountBalance = kbBankRepository.findAccountBalanceById(accountId);
        List<TransactionResponseDTO> transactionList = kbBankRepository.getTransactionByAccountId(
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
                    kbBankRepository.getTransactionDetailById(transactionId))
                .orElseThrow(() -> new ExceptionResponse(
                    CustomException.NOT_FOUND_TRANSACTION_DETAIL_EXCEPTION));
        } catch (NonUniqueResultException e) {
            throw new ExceptionResponse(CustomException.NOT_GET_TRANSACTION_DETAIL_EXCEPTION);
        }
    }

    @Override
    public String getAccountName(String accountNumber) {
        String memberName = kbBankRepository.findByAccountNumber(accountNumber)
            .orElseThrow(() -> new ExceptionResponse(CustomException.ACCOUNT_NOT_FOUND_EXCEPTION))
            .getName();
        return memberName;
    }

    @Transactional
    @Override
    public void connectMyDataAccount(String tokenHeader, boolean myDataStatus) {
        String phoneNumber = jwtUtil.getLoginUserPhoneNumber(tokenHeader);
        kbBankRepository.connectMyDataAccount(phoneNumber, myDataStatus);
    }

    @Override
    @Transactional
    public BankTransferResponseDTO addFundsToAccount(AccountTransferRequestDTO requestDTO) {
        KbBank kbBank = kbBankRepository.findByAccountNumber(requestDTO.depositAccountNumber())
            .orElseThrow(() -> new ExceptionResponse(CustomException.ACCOUNT_NOT_FOUND_EXCEPTION));

        long accountTransactionBalance = kbBank.getAccountBalance() + requestDTO.amount();
        KbBankTransaction transaction = KbBankTransaction.createAccountTransferHistory(kbBank,
            requestDTO, accountTransactionBalance, "ETC");

        kbBank.addTransaction(transaction);
        KbBankTransaction savedToTransaction = kbBankTransactionRepository.save(transaction);
        searchedTransactionRepository.save(SearchedTransaction.fromAccountTransferByTo(savedToTransaction));
        try{
            BankTransferResponseDTO bankTransferResponseDTO = BankTransferResponseDTO.fromBankTransferResponseDTO(
                kbBank);
            return bankTransferResponseDTO;
        }catch (Exception e){
            throw new ExceptionResponse(CustomException.ACCOUNT_NOT_FOUND_EXCEPTION);
        }
    }

    @Override
    public MonthlyTransactionHistoryListDTO getMonthlyTransactionHistory(String tokenHeader,
        MonthlyTransactionRequestDTO requestDTO) {
        String phoneNumber = jwtUtil.getLoginUserPhoneNumber(tokenHeader);
        return kbBankRepository.getTransactionByPhoneNumberAndYearMonth(phoneNumber, requestDTO);
    }

    @Override
    public Map<Category, Long> getTransactionByGroupCategory(
        BankToAnalysisMessageRequestDTO requestDTO) {
        return kbBankRepository.getTransactionByGroupCategory(requestDTO);
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

    @Transactional
    @Override
    public PaymentResponseDTO qrPayment(Long accountId, PaymentRequestDTO paymentRequestDTO) {

        KbBank kbBank = kbBankRepository.findById(accountId)
            .orElseThrow(() -> new ExceptionResponse(CustomException.ACCOUNT_NOT_FOUND_EXCEPTION));
        long transactionBalance = calculateTransactionBalance(kbBank,
            paymentRequestDTO.transactionAmount());

        KbBankTransaction paymentTransaction = createTransaction(kbBank, paymentRequestDTO,
            transactionBalance);

        kbBank.addTransaction(paymentTransaction);

        kbBankTransactionRepository.save(paymentTransaction);


        searchedTransactionRepository.save(SearchedTransaction.fromAccountIdAndKbBankTransaction(accountId, paymentTransaction));

        return PaymentResponseDTO.fromPaymentResponseDTO(paymentTransaction);
    }

    private long calculateTransactionBalance(KbBank kbBank, long transactionAmount) {
        long transactionBalance = kbBank.getAccountBalance() - transactionAmount;
        if (transactionBalance < 0) {
            throw new ExceptionResponse(CustomException.NOT_ENOUGH_FUNDS_EXCEPTION);
        }
        return transactionBalance;
    }

    private KbBankTransaction createTransaction(KbBank kbBank,
        PaymentRequestDTO paymentRequestDTO, long transactionBalance) {
        return KbBankTransaction.builder()
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
        return kbBankRepository.getMyTransactionByCategory(phoneNumber, requestDTO);
    }
}
