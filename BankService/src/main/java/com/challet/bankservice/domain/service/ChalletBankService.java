package com.challet.bankservice.domain.service;

import com.challet.bankservice.domain.dto.request.AccountTransferRequestDTO;
import com.challet.bankservice.domain.dto.request.BankSelectionRequestDTO;
import com.challet.bankservice.domain.dto.request.ConfirmPaymentRequestDTO;
import com.challet.bankservice.domain.dto.request.PaymentRequestDTO;
import com.challet.bankservice.domain.dto.request.SearchTransactionRequestDTO;
import com.challet.bankservice.domain.dto.response.AccountInfoResponseListDTO;
import com.challet.bankservice.domain.dto.response.AccountTransferResponseDTO;
import com.challet.bankservice.domain.dto.response.MyDataBankAccountInfoResponseDTO;
import com.challet.bankservice.domain.dto.response.PaymentResponseDTO;
import com.challet.bankservice.domain.dto.response.SearchedTransactionResponseDTO;
import com.challet.bankservice.domain.dto.response.TransactionDetailResponseDTO;
import com.challet.bankservice.domain.dto.response.TransactionResponseListDTO;

public interface ChalletBankService {

	void createAccount(String name, String phoneNumber);

	AccountInfoResponseListDTO getAccountsByPhoneNumber(String phoneNumber);

	TransactionResponseListDTO getAccountTransactionList(Long accountId);

	TransactionDetailResponseDTO getTransactionInfo(Long transactionId);

	boolean verifyPassword(String accountId,String password);

	PaymentResponseDTO qrPayment(Long accountId, PaymentRequestDTO paymentRequestDTO);

    PaymentResponseDTO confirmPaymentInfo(Long accountId, ConfirmPaymentRequestDTO paymentRequestDTO);

    int sendPaymentInfoToChallet(Long accountId, PaymentResponseDTO paymentInfoDTO);

	MyDataBankAccountInfoResponseDTO connectMyDataBanks(String tokenHeader,
		BankSelectionRequestDTO bankSelectionRequestDTO);

	MyDataBankAccountInfoResponseDTO getMyDataAccounts(String tokenHeader);

	String getAccountName(String tokenHeader, AccountTransferRequestDTO accountTransferRequestDTO);

	AccountTransferResponseDTO accountTransfer(Long accountId,
		AccountTransferRequestDTO accountTransferRequestDTO);

	SearchedTransactionResponseDTO searchTransaction(
		SearchTransactionRequestDTO searchTransactionRequestDTO);
}
