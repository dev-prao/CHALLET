package com.challet.bankservice.domain.service;

import com.challet.bankservice.domain.dto.request.AccountTransferRequestDTO;
import com.challet.bankservice.domain.dto.request.BankSelectionDTO;
import com.challet.bankservice.domain.dto.request.BankSelectionRequestDTO;
import com.challet.bankservice.domain.dto.request.BankTransferRequestDTO;
import com.challet.bankservice.domain.dto.request.ConfirmPaymentRequestDTO;
import com.challet.bankservice.domain.dto.request.PaymentRequestDTO;
import com.challet.bankservice.domain.dto.request.SearchTransactionRequestDTO;
import com.challet.bankservice.domain.dto.response.AccountInfoResponseListDTO;
import com.challet.bankservice.domain.dto.response.AccountTransferResponseDTO;
import com.challet.bankservice.domain.dto.response.BankTransferResponseDTO;
import com.challet.bankservice.domain.dto.response.MyDataBankAccountInfoResponseDTO;
import com.challet.bankservice.domain.dto.response.PaymentHttpMessageResponseDTO;
import com.challet.bankservice.domain.dto.response.PaymentResponseDTO;
import com.challet.bankservice.domain.dto.response.SearchedTransactionResponseDTO;
import com.challet.bankservice.domain.dto.response.TransactionDetailResponseDTO;
import com.challet.bankservice.domain.dto.response.TransactionResponseDTO;
import com.challet.bankservice.domain.dto.response.TransactionResponseListDTO;
import com.challet.bankservice.domain.entity.Category;
import com.challet.bankservice.domain.entity.CategoryMapping;
import com.challet.bankservice.domain.entity.CategoryT;
import com.challet.bankservice.domain.entity.ChalletBank;
import com.challet.bankservice.domain.entity.ChalletBankTransaction;
import com.challet.bankservice.domain.entity.SearchedTransaction;
import com.challet.bankservice.domain.repository.CategoryMappingRepository;
import com.challet.bankservice.domain.repository.CategoryRepository;
import com.challet.bankservice.domain.repository.ChalletBankRepository;
import com.challet.bankservice.domain.repository.ChalletBankTransactionRepository;
import com.challet.bankservice.domain.repository.SearchedTransactionRepository;
import com.challet.bankservice.global.client.ChalletFeignClient;
import com.challet.bankservice.global.client.KbBankFeignClient;
import com.challet.bankservice.global.client.NhBankFeignClient;
import com.challet.bankservice.global.client.ShBankFeignClient;
import com.challet.bankservice.global.exception.CustomException;
import com.challet.bankservice.global.exception.ExceptionResponse;
import com.challet.bankservice.global.util.JwtUtil;
import com.querydsl.core.NonUniqueResultException;
import java.time.LocalDateTime;
import java.util.Arrays;
import java.util.Collections;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.Random;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.core.env.Environment;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Slf4j
@Service
@RequiredArgsConstructor
public class ChalletBankServiceImpl implements ChalletBankService {

    private final ChalletBankRepository challetBankRepository;
    private final ChalletBankTransactionRepository challetBankTransactionRepository;
    private final CategoryRepository categoryRepository;
    private final CategoryMappingRepository categoryMappingRepository;
    private final SearchedTransactionRepository searchedTransactionRepository;
    private final Environment env;
    private final JwtUtil jwtUtil;
    private final KbBankFeignClient kbBankFeignClient;
    private final NhBankFeignClient nhBankFeignClient;
    private final ShBankFeignClient shBankFeignClient;
    private final ChalletFeignClient challetFeignClient;

    @Override
    public void createAccount(String name, String phoneNumber) {
        for (int retry = 0; retry < 6; retry++) {
            String accountNum = createAccountNum();
            try {
                ChalletBank challetBank = saveAccount(name, phoneNumber, accountNum);
                createDefaultCategoriesAndMappingsForAccount(challetBank);
                return;
            } catch (DataIntegrityViolationException e) {
                log.warn("중복된 계좌 번호 발견, 다시 생성합니다. 중복 계좌 번호: " + accountNum);
            }
        }
        throw new ExceptionResponse(CustomException.NOT_CREATE_USER_ACCOUNT_EXCEPTION);
    }

    // 계좌별 기본 카테고리 및 매핑 생성
    public void createDefaultCategoriesAndMappingsForAccount(ChalletBank challetBank) {
        Map<String, List<String>> categoryMappingData = new HashMap<>();
        categoryMappingData.put("DELIVERY", Arrays.asList("쿠팡이츠", "배달", "요기요"));
        categoryMappingData.put("TRANSPORT", Arrays.asList("택시", "킥보드", "우버", "SRT", "코레일", "버스"));
        categoryMappingData.put("COFFEE",
            Arrays.asList("스타벅스", "할리스", "파스쿠치", "투썸", "이디야", "커피", "카페"));
        categoryMappingData.put("SHOPPING", Arrays.asList("무신사", "네이버쇼핑"));
        categoryMappingData.put("ETC", Collections.emptyList());

        for (Map.Entry<String, List<String>> entry : categoryMappingData.entrySet()) {
            String categoryName = entry.getKey();
            List<String> paymentNames = entry.getValue();

            // 카테고리 생성
            CategoryT category = CategoryT.builder()
                .categoryName(categoryName)
                .challetBank(challetBank)
                .build();

            categoryRepository.save(category);

            // 결제명과 카테고리 매핑 생성
            for (String paymentName : paymentNames) {
                CategoryMapping categoryMapping = CategoryMapping.builder()
                    .depositName(paymentName)
                    .challetBank(challetBank)
                    .categoryT(category)
                    .build();
                categoryMappingRepository.save(categoryMapping);
            }
        }
    }

    @Override
    public AccountInfoResponseListDTO getAccountsByPhoneNumber(String header) {
        String phoneNumber = jwtUtil.getLoginUserPhoneNumber(header);
        AccountInfoResponseListDTO accountInfo = challetBankRepository.getAccountInfoByPhoneNumber(
            phoneNumber);
        if (accountInfo.accountCount() == 0) {
            throw new ExceptionResponse(CustomException.NOT_FOUND_USER_ACCOUNT_EXCEPTION);
        }
        return accountInfo;
    }

    @Transactional
    @Override
    public TransactionResponseListDTO getAccountTransactionList(Long accountId) {
        Long accountBalance = challetBankRepository.findAccountBalanceById(accountId);
        List<TransactionResponseDTO> transactionList = challetBankRepository.getTransactionByAccountId(
            accountId);

        return TransactionResponseListDTO
            .builder()
            .transactionCount(transactionList.stream().count())
            .accountBalance(accountBalance)
            .transactionResponseDTO(transactionList).build();
    }

    @Override
    public TransactionDetailResponseDTO getTransactionInfo(Long transactionId) {
        try {
            return Optional.ofNullable(
                    challetBankRepository.getTransactionDetailById(transactionId))
                .orElseThrow(() -> new ExceptionResponse(
                    CustomException.NOT_FOUND_TRANSACTION_DETAIL_EXCEPTION));
        } catch (NonUniqueResultException e) {
            throw new ExceptionResponse(CustomException.NOT_GET_TRANSACTION_DETAIL_EXCEPTION);
        }
    }

    @Transactional
    protected ChalletBank saveAccount(String name, String phoneNumber, String accountNum) {
        ChalletBank account = ChalletBank.createAccount(name, phoneNumber, accountNum);
        return challetBankRepository.save(account);
    }

    private String createAccountNum() {
        String bankCode = env.getProperty("8082");  // 은행 코드
        String accountType = "01";  // 계좌 유형

        // 밀리초 단위 시간에서 마지막 6자리 사용
        String timePart = generateTimeBasedCode();

        // 4자리 난수 생성
        String randomPart = generateRandomNumber(4);

        return bankCode + accountType + timePart + randomPart;
    }

    private String generateTimeBasedCode() {
        long currentTimeInMillis = System.currentTimeMillis();
        long currentTimeInSeconds = currentTimeInMillis / 1000;

        // 초 단위로 변환된 시간에서 마지막 6자리 추출
        return String.valueOf(currentTimeInSeconds).substring(4);
    }

    private String generateRandomNumber(int size) {
        Random random = new Random();
        StringBuilder sb = new StringBuilder();
        for (int i = 0; i < size; i++) {
            sb.append(random.nextInt(10));
        }
        return sb.toString();
    }

    @Override
    public boolean verifyPassword(String password) {
        return challetFeignClient.sendSimplePassword(password);
    }

    @Transactional
    @Override
    public PaymentResponseDTO qrPayment(Long accountId,
        PaymentRequestDTO paymentRequestDTO) {
        ChalletBank challetBank = getChalletBank(accountId);

        long transactionBalance = calculateTransactionBalance(challetBank,
            paymentRequestDTO.transactionAmount());

        String categoryName = getCategoryName(challetBank, paymentRequestDTO.deposit());
        ChalletBankTransaction paymentTransaction = createTransaction(challetBank,
            paymentRequestDTO, transactionBalance, categoryName);

        challetBank.addTransaction(paymentTransaction);
        challetBankTransactionRepository.save(paymentTransaction);
        searchedTransactionRepository.save(
            SearchedTransaction.fromAccountIdAndChalletBankTransaction(accountId,
                paymentTransaction));

        return PaymentResponseDTO.fromPaymentResponseDTO(paymentTransaction);
    }

    private long calculateTransactionBalance(ChalletBank challetBank, long transactionAmount) {
        long transactionBalance = challetBank.getAccountBalance() - transactionAmount;
        if (transactionBalance < 0) {
            throw new ExceptionResponse(CustomException.NOT_ENOUGH_FUNDS_EXCEPTION);
        }
        return transactionBalance;
    }

    private String getCategoryName(ChalletBank challetBank, String deposit) {
        String categoryName = challetBankRepository.getCategoryName(challetBank.getId(),
            deposit);

        if (categoryName.equals("ETC")) {
            CategoryT categoryInfo = categoryRepository.getCategoryInfo(challetBank.getId(),
                categoryName);

            CategoryMapping newPayment = CategoryMapping
                .builder()
                .depositName(deposit)
                .categoryT(categoryInfo)
                .challetBank(challetBank)
                .build();
            categoryMappingRepository.save(newPayment);
        }
        return categoryName;
    }

    private ChalletBankTransaction createTransaction(ChalletBank challetBank,
        PaymentRequestDTO paymentRequestDTO, long transactionBalance, String categoryName) {
        return ChalletBankTransaction.builder()
            .transactionAmount(-1 * paymentRequestDTO.transactionAmount())
            .transactionDatetime(LocalDateTime.now())
            .deposit(paymentRequestDTO.deposit())
            .withdrawal(challetBank.getAccountNumber())
            .transactionBalance(transactionBalance)
            .category(Category.valueOf(categoryName))
            .build();
    }

    @Transactional
    @Override
    public PaymentResponseDTO confirmPaymentInfo(Long accountId,
        ConfirmPaymentRequestDTO paymentRequestDTO) {

        ChalletBankTransaction transaction = challetBankTransactionRepository.findById(
                paymentRequestDTO.id())
            .orElseThrow(() -> new ExceptionResponse(
                CustomException.NOT_FOUND_TRANSACTION_DETAIL_EXCEPTION));

        if (!transaction.getCategory().equals(paymentRequestDTO.category())) {
            CategoryT categoryInfo = categoryRepository.getCategoryInfo(accountId,
                paymentRequestDTO.category());
            long notFindSameCategory = categoryMappingRepository.updateCategory(accountId,
                categoryInfo.getId(), paymentRequestDTO);

            if (notFindSameCategory == 0) {
                CategoryMapping newPayment = CategoryMapping
                    .builder()
                    .depositName(paymentRequestDTO.deposit())
                    .categoryT(categoryInfo)
                    .challetBank(transaction.getChalletBank())
                    .build();
                categoryMappingRepository.save(newPayment);
            }
            transaction.updateCategory(paymentRequestDTO.category());
        }
        return PaymentResponseDTO.fromPaymentResponseDTO(transaction);
    }

    @Transactional
    @Override
    public int sendPaymentInfoToChallet(Long accountId, PaymentResponseDTO paymentInfoDTO) {
        try {
            ChalletBank challetBank = getChalletBank(accountId);
            PaymentHttpMessageResponseDTO paymentHttpMessageResponseDTO = PaymentHttpMessageResponseDTO
                .ofPaymentMessage(challetBank.getPhoneNumber(), paymentInfoDTO);
            challetFeignClient.sendPaymentMessage(paymentHttpMessageResponseDTO);
            return 1;
        } catch (Exception e) {
            return 0;
        }
    }

    private ChalletBank getChalletBank(Long accountId) {
        return challetBankRepository.findByIdWithLock(accountId);
    }

    @Override
    public MyDataBankAccountInfoResponseDTO connectMyDataBanks(String tokenHeader,
        BankSelectionRequestDTO bankSelectionRequestDTO) {

        setMyDataAuth(tokenHeader);

        AccountInfoResponseListDTO kbBanks = null;
        AccountInfoResponseListDTO nhBanks = null;
        AccountInfoResponseListDTO shBanks = null;

        for (BankSelectionDTO bank : bankSelectionRequestDTO.selectedBanks()) {
            kbBanks = getKbBankAccounts(tokenHeader, bank, kbBanks);
            nhBanks = getNhBankAccounts(tokenHeader, bank, nhBanks);
            shBanks = getShBankAccounts(tokenHeader, bank, shBanks);
        }

        return getMyDataAccounts(kbBanks, nhBanks, shBanks);
    }

    private void setMyDataAuth(String tokenHeder) {
        String phoneNumber = jwtUtil.getLoginUserPhoneNumber(tokenHeder);
        challetBankRepository.setMyDataAuthorization(phoneNumber);
    }

    private AccountInfoResponseListDTO getKbBankAccounts(String tokenHeader,
        BankSelectionDTO bank, AccountInfoResponseListDTO kbBanks) {
        if (bank.bankCode().equals("8083") && bank.isSelected()) {
            kbBanks = kbBankFeignClient.connectMyDataKbBank(
                tokenHeader);
        }
        return kbBanks;
    }

    private AccountInfoResponseListDTO getNhBankAccounts(String tokenHeder,
        BankSelectionDTO bank, AccountInfoResponseListDTO nhBanks) {
        if (bank.bankCode().equals("8084") && bank.isSelected()) {
            nhBanks = nhBankFeignClient.connectMyDataKbBank(tokenHeder);
        }
        return nhBanks;
    }

    private AccountInfoResponseListDTO getShBankAccounts(String tokenHeder,
        BankSelectionDTO bank, AccountInfoResponseListDTO shBanks) {
        if (bank.bankCode().equals("8085") && bank.isSelected()) {
            shBanks = shBankFeignClient.connectMyDataKbBank(tokenHeder);
        }
        return shBanks;
    }

    private MyDataBankAccountInfoResponseDTO getMyDataAccounts(AccountInfoResponseListDTO kbBanks,
        AccountInfoResponseListDTO nhBanks, AccountInfoResponseListDTO shBanks) {
        return MyDataBankAccountInfoResponseDTO
            .builder()
            .kbBanks(kbBanks)
            .nhBanks(nhBanks)
            .shBanks(shBanks)
            .build();
    }

    @Override
    public MyDataBankAccountInfoResponseDTO getMyDataAccounts(String tokenHeader) {
        String phoneNumber = jwtUtil.getLoginUserPhoneNumber(tokenHeader);
        if (!challetBankRepository.isMyDataConnectedByPhoneNumber(phoneNumber)) {
            throw new ExceptionResponse(CustomException.NOT_CONNECTED_MYDATA_EXCEPTION);
        }
        AccountInfoResponseListDTO kbBanks = kbBankFeignClient.getMyDataKbBank(tokenHeader);
        AccountInfoResponseListDTO nhBanks = nhBankFeignClient.getMyDataKbBank(tokenHeader);
        AccountInfoResponseListDTO shBanks = shBankFeignClient.getMyDataKbBank(tokenHeader);

        return getMyDataAccounts(kbBanks, nhBanks, shBanks);
    }

    @Transactional
    @Override
    public AccountTransferResponseDTO accountTransfer(Long accountId,
        AccountTransferRequestDTO requestTransactionDTO) {

        ChalletBank fromBank = challetBankRepository.findByIdWithLock(accountId);
        long transactionBalance = calculateTransactionBalance(fromBank,
            requestTransactionDTO.transactionAmount());

        if (requestTransactionDTO.bankCode().equals("8082")) {
            return processInternalTransfer(fromBank, requestTransactionDTO, transactionBalance);
        }

        return processExternalTransfer(fromBank, requestTransactionDTO, transactionBalance);
    }

    @Override
    public SearchedTransactionResponseDTO searchTransaction(
        final SearchTransactionRequestDTO searchTransactionRequestDTO) {
        Pageable pageable = PageRequest.of(searchTransactionRequestDTO.page(),
            searchTransactionRequestDTO.size());
        Page<SearchedTransaction> searchedTransactions = getResult(searchTransactionRequestDTO,
            pageable);

        boolean isLastPage = searchedTransactions.isLast();

        return SearchedTransactionResponseDTO.fromSearchedTransaction(
            searchedTransactions.getContent(), isLastPage);
    }

    private Page<SearchedTransaction> getResult(
        SearchTransactionRequestDTO searchTransactionRequestDTO, Pageable pageable) {
        if (searchTransactionRequestDTO.deposit() != null) {
            return searchedTransactionRepository.findByAccountIdAndDepositContaining(
                searchTransactionRequestDTO.accountId(),
                searchTransactionRequestDTO.deposit(), pageable);
        }
        return searchedTransactionRepository.findByAccountId(
            searchTransactionRequestDTO.accountId(), pageable);
    }

    private AccountTransferResponseDTO processInternalTransfer(ChalletBank fromBank,
        AccountTransferRequestDTO requestTransactionDTO, long transactionBalance) {

        ChalletBank toBank = challetBankRepository.getAccountByAccountNumber(
            requestTransactionDTO.depositAccountNumber());

        if (toBank == null) {
            throw new ExceptionResponse(CustomException.ACCOUNT_NOT_FOUND_EXCEPTION);
        }

        long addMoney = toBank.getAccountBalance() + requestTransactionDTO.transactionAmount();

        //카테고리 확인
        String categoryName = getCategoryName(fromBank,
            requestTransactionDTO.depositAccountNumber());

        ChalletBankTransaction paymentTransaction = ChalletBankTransaction.createAccountTransferHistory(
            fromBank, toBank.getName(), requestTransactionDTO, transactionBalance, true,
            categoryName);
        fromBank.addTransaction(paymentTransaction);

        ChalletBankTransaction accountTransferHistory = ChalletBankTransaction.createAccountTransferHistory(
            fromBank, toBank.getName(), requestTransactionDTO, addMoney, false, "ETC");
        toBank.addTransaction(accountTransferHistory);

        challetBankTransactionRepository.save(accountTransferHistory);

        return AccountTransferResponseDTO.fromTransferInfo(accountTransferHistory.getId(), fromBank,
            toBank, requestTransactionDTO.transactionAmount(), categoryName);
    }

    private AccountTransferResponseDTO processExternalTransfer(ChalletBank fromBank,
        AccountTransferRequestDTO requestTransactionDTO, long transactionBalance) {

        BankTransferResponseDTO bankDTO = BankTransferResponseDTO.fromDTO(fromBank,
            requestTransactionDTO);

        try {
            BankTransferRequestDTO toBank = getExternalBankTransferAccount(bankDTO,
                requestTransactionDTO.bankCode());

            //카테고리 확인
            String categoryName = getCategoryName(fromBank,
                requestTransactionDTO.depositAccountNumber());

            ChalletBankTransaction paymentTransaction = ChalletBankTransaction.createAccountTransferHistory(
                fromBank, toBank.name(), requestTransactionDTO, transactionBalance, true,
                categoryName);
            fromBank.addTransaction(paymentTransaction);

            challetBankTransactionRepository.save(paymentTransaction);

            /// 외부에서 받을때 name만 받아서 안됌, accountNumber가 필요

            return AccountTransferResponseDTO.fromExternalTransferInfo(paymentTransaction.getId(),
                fromBank, toBank, requestTransactionDTO.transactionAmount(), categoryName);
        } catch (Exception e) {
            throw new ExceptionResponse(CustomException.ACCOUNT_NOT_FOUND_EXCEPTION);
        }
    }

    private BankTransferRequestDTO getExternalBankTransferAccount(BankTransferResponseDTO bankDTO,
        String bankCode) {
        switch (bankCode) {
            case "8083":
                return kbBankFeignClient.getTransferAccount(bankDTO);
            case "8084":
                return nhBankFeignClient.getTransferAccount(bankDTO);
            case "8085":
                return shBankFeignClient.getTransferAccount(bankDTO);
            default:
                throw new ExceptionResponse(CustomException.INVALID_BANK_CODE_EXCEPTION);
        }
    }
}