package com.challet.shbankservice.domain.service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;
import java.util.Optional;

import org.hibernate.NonUniqueResultException;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

import com.challet.shbankservice.domain.dto.request.AccountTransferRequestDTO;
import com.challet.shbankservice.domain.dto.request.BankToAnalysisMessageRequestDTO;
import com.challet.shbankservice.domain.dto.request.MonthlyTransactionRequestDTO;
import com.challet.shbankservice.domain.dto.request.PaymentRequestDTO;
import com.challet.shbankservice.domain.dto.request.SearchTransactionRequestDTO;
import com.challet.shbankservice.domain.dto.response.AccountInfoResponseListDTO;
import com.challet.shbankservice.domain.dto.response.BankTransferResponseDTO;
import com.challet.shbankservice.domain.dto.response.MonthlyTransactionHistoryListDTO;
import com.challet.shbankservice.domain.dto.response.PaymentResponseDTO;
import com.challet.shbankservice.domain.dto.response.SearchedTransactionResponseDTO;
import com.challet.shbankservice.domain.dto.response.TransactionDetailResponseDTO;
import com.challet.shbankservice.domain.dto.response.TransactionResponseDTO;
import com.challet.shbankservice.domain.dto.response.TransactionResponseListDTO;
import com.challet.shbankservice.domain.entity.Category;
import com.challet.shbankservice.domain.entity.SearchedTransaction;
import com.challet.shbankservice.domain.entity.ShBank;
import com.challet.shbankservice.domain.entity.ShBankTransaction;
import com.challet.shbankservice.domain.elasticsearch.repository.SearchedTransactionRepository;
import com.challet.shbankservice.domain.repository.ShBankRepository;
import com.challet.shbankservice.domain.repository.ShBankTransactionRepository;
import com.challet.shbankservice.global.exception.CustomException;
import com.challet.shbankservice.global.exception.ExceptionResponse;
import com.challet.shbankservice.global.util.JwtUtil;

import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Slf4j
@Service
@RequiredArgsConstructor
public class ShBankServiceImpl implements ShBankService {

	private final ShBankRepository shBankRepository;
	private final ShBankTransactionRepository shBankTransactionRepository;
	private final SearchedTransactionRepository searchedTransactionRepository;
	private final JwtUtil jwtUtil;

	@Override
	public AccountInfoResponseListDTO getAccountsByPhoneNumber(String tokenHeader) {
		String loginUserPhoneNumber = jwtUtil.getLoginUserPhoneNumber(tokenHeader);
		return shBankRepository.getAccountInfoByPhoneNumber(
			loginUserPhoneNumber);
	}

	@Transactional
	@Override
	public TransactionResponseListDTO getAccountTransactionList(Long accountId) {
		Long accountBalance = shBankRepository.getAccountBalanceById(accountId);
		List<TransactionResponseDTO> transactionList = shBankRepository.getTransactionByAccountId(
			accountId);

		return TransactionResponseListDTO
			.builder()
			.transactionCount((long)transactionList.size())
			.accountBalance(accountBalance)
			.transactionResponseDTO(transactionList).build();
	}

	@Override
	public TransactionDetailResponseDTO getTransactionInfo(Long transactionId) {
		try {
			return Optional.ofNullable(
					shBankRepository.getTransactionDetailById(transactionId))
				.orElseThrow(() -> new ExceptionResponse(
					CustomException.NOT_FOUND_TRANSACTION_DETAIL_EXCEPTION));
		} catch (NonUniqueResultException e) {
			throw new ExceptionResponse(CustomException.NOT_GET_TRANSACTION_DETAIL_EXCEPTION);
		}
	}

	@Override
	public String getAccountName(String accountNumber) {
		String memberName = shBankRepository.findByAccountNumber(accountNumber)
			.orElseThrow(() -> new ExceptionResponse(CustomException.ACCOUNT_NOT_FOUND_EXCEPTION))
			.getName();
		return memberName;
	}

	@Transactional
	@Override
	public void connectMyDataAccount(String tokenHeader, boolean myDataStatus) {
		String phoneNumber = jwtUtil.getLoginUserPhoneNumber(tokenHeader);
		shBankRepository.connectMyDataAccount(phoneNumber, myDataStatus);
	}

	@Transactional
	@Override
	public BankTransferResponseDTO addFundsToAccount(AccountTransferRequestDTO requestDTO) {
		ShBank shBank = shBankRepository.findByAccountNumber(requestDTO.depositAccountNumber())
			.orElseThrow(() -> new ExceptionResponse(CustomException.ACCOUNT_NOT_FOUND_EXCEPTION));

		long accountTransactionBalance = shBank.getAccountBalance() + requestDTO.amount();
		ShBankTransaction transaction = ShBankTransaction.createAccountTransferHistory(shBank,
			requestDTO, accountTransactionBalance, "ETC");

		shBank.addTransaction(transaction);
		ShBankTransaction savedToTransaction = shBankTransactionRepository.save(transaction);
		searchedTransactionRepository.save(SearchedTransaction.fromAccountTransferByTo(savedToTransaction));

		return BankTransferResponseDTO.fromBankTransferResponseDTO(shBank);
	}

	@Override
	public MonthlyTransactionHistoryListDTO getMonthlyTransactionHistory(String tokenHeader,
		MonthlyTransactionRequestDTO requestDTO) {
		String phoneNumber = jwtUtil.getLoginUserPhoneNumber(tokenHeader);
		MonthlyTransactionHistoryListDTO transactions = shBankRepository.getTransactionByPhoneNumberAndYearMonth(
			phoneNumber, requestDTO);

		return transactions;
	}

	@Override
	public Map<Category, Long> getTransactionByGroupCategory(
		BankToAnalysisMessageRequestDTO requestDTO) {
		return shBankRepository.getTransactionByGroupCategory(requestDTO);
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
	public PaymentResponseDTO qrPayment(final Long accountId,
		final PaymentRequestDTO paymentRequestDTO) {
		ShBank shBank = shBankRepository.findById(accountId)
			.orElseThrow(() -> new ExceptionResponse(CustomException.ACCOUNT_NOT_FOUND_EXCEPTION));
		long transactionBalance = calculateTransactionBalance(shBank,
			paymentRequestDTO.transactionAmount());

		ShBankTransaction paymentTransaction = createTransaction(shBank, paymentRequestDTO,
			transactionBalance);

		shBank.addTransaction(paymentTransaction);

		shBankTransactionRepository.save(paymentTransaction);

		searchedTransactionRepository.save(
			SearchedTransaction.fromAccountIdAndShBankTransaction(accountId, paymentTransaction));

		return PaymentResponseDTO.fromPaymentResponseDTO(paymentTransaction);
	}

	private long calculateTransactionBalance(ShBank shBank, long transactionAmount) {
		long transactionBalance = shBank.getAccountBalance() - transactionAmount;
		if (transactionBalance < 0) {
			throw new ExceptionResponse(CustomException.NOT_ENOUGH_FUNDS_EXCEPTION);
		}
		return transactionBalance;
	}

	private ShBankTransaction createTransaction(ShBank shBank,
		PaymentRequestDTO paymentRequestDTO, long transactionBalance) {
		return ShBankTransaction.builder()
			.transactionAmount(-1 * paymentRequestDTO.transactionAmount())
			.transactionDatetime(LocalDateTime.now())
			.deposit(paymentRequestDTO.deposit())
			.withdrawal(shBank.getAccountNumber())
			.transactionBalance(transactionBalance)
			.build();
	}

	@Override
	public Map<Category, Long> getMyTransactionByCategory(String tokenHeader,
		MonthlyTransactionRequestDTO requestDTO) {
		String phoneNumber = jwtUtil.getLoginUserPhoneNumber(tokenHeader);
		return shBankRepository.getMyTransactionByCategory(phoneNumber, requestDTO);
	}
}
