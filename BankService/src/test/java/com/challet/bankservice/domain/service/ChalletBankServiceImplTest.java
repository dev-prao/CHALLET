//package com.challet.bankservice.domain.service;
//
//import static org.junit.jupiter.api.Assertions.assertThrows;
//
//import com.challet.bankservice.domain.dto.request.PaymentRequestDTO;
//import com.challet.bankservice.domain.entity.ChalletBank;
//import com.challet.bankservice.domain.repository.ChalletBankRepository;
//import com.challet.bankservice.global.exception.CustomException;
//import com.challet.bankservice.global.exception.ExceptionResponse;
//import java.util.concurrent.CountDownLatch;
//import java.util.concurrent.ExecutorService;
//import java.util.concurrent.Executors;
//import org.assertj.core.api.Assertions;
//import org.junit.jupiter.api.AfterEach;
//import org.junit.jupiter.api.BeforeEach;
//import org.junit.jupiter.api.DisplayName;
//import org.junit.jupiter.api.Test;
//import org.springframework.beans.factory.annotation.Autowired;
//import org.springframework.boot.test.context.SpringBootTest;
//
//@SpringBootTest
//class ChalletBankServiceImplTest {
//
//    @Autowired
//    private ChalletBankService challetBankService;
//    @Autowired
//    private ChalletBankServiceImpl challetBankServiceImpl;
//
//    @Autowired
//    private ChalletBankRepository challetBankRepository;
//
//    private ChalletBank testAccount;
//
//    @BeforeEach
//    public void before() {
//        // 테스트 시작 전에 계좌를 생성하고 저장
//        testAccount = ChalletBank.builder()
//            .accountBalance(100L)
//            .phoneNumber("01012345678")
//            .accountNumber("9999999999998723")
//            .build();
//
//        ChalletBank test = challetBankRepository.save(testAccount);
//        challetBankServiceImpl.createDefaultCategoriesAndMappingsForAccount(test);
//    }
//
//    @AfterEach
//    public void after() {
//        testAccount = challetBankRepository.findById(testAccount.getId()).orElse(null);
//        if (testAccount != null) {
//            challetBankRepository.delete(testAccount);
//        }
//    }
//
//
//    @Test
//    @DisplayName("동시에 100개의 결제시 동시성 테스트")
//    void qrPayment_simultaneous() throws InterruptedException {
//        // 자동 생성된 ID 확인
//        Long accountId = testAccount.getId();
//
//        PaymentRequestDTO paymentRequestDTO = PaymentRequestDTO
//            .builder()
//            .transactionAmount(1L)
//            .accountNumber("01012345678")
//            .deposit("할리스")
//            .build();
//
//        int threadCount = 100;
//        CountDownLatch countDownLatch = new CountDownLatch(threadCount);
//        ExecutorService executorService = Executors.newFixedThreadPool(32);
//
//        for (int i = 0; i < threadCount; i++) {
//            executorService.submit(() -> {
//                try {
//                    challetBankService.qrPayment(accountId, paymentRequestDTO);
//                } finally {
//                    countDownLatch.countDown();
//                }
//            });
//        }
//
//        countDownLatch.await();
//
//        // 테스트 후 상태 확인
//        ChalletBank updatedChalletBank = challetBankRepository.findById(accountId).orElseThrow();
//        Long updatedAccountBalance = updatedChalletBank.getAccountBalance();
//
//        Assertions.assertThat(updatedAccountBalance).isEqualTo(0);
//    }
//
//    @Test
//    @DisplayName("결제 금액이 잔액보다 많을 경우 예외 발생 테스트")
//    void payment_insufficient_balance() {
//        // 자동 생성된 ID 확인
//        Long accountId = testAccount.getId();
//
//        // 결제 금액이 잔액보다 큼 (잔액 100보다 큰 금액 설정)
//        PaymentRequestDTO paymentRequestDTO = PaymentRequestDTO
//            .builder()
//            .transactionAmount(1000L)
//            .accountNumber("01012345678")
//            .deposit("test1")
//            .build();
//
//
//        // 예외가 발생하는지 확인
//        Exception exception = assertThrows(ExceptionResponse.class, () -> {
//            challetBankService.qrPayment(accountId, paymentRequestDTO);
//        });
//
//        // 예외 메시지 확인
//        Assertions.assertThat(((ExceptionResponse) exception).getCustomException())
//            .isEqualTo(CustomException.NOT_ENOUGH_FUNDS_EXCEPTION);
//
//        // 계좌 잔액이 변하지 않았는지 확인 (잔액이 부족하여 트랜잭션이 실패했으므로 잔액이 100으로 유지되어야 함)
//        ChalletBank updatedChalletBank = challetBankRepository.findById(accountId).orElseThrow();
//        Long updatedAccountBalance = updatedChalletBank.getAccountBalance();
//
//        Assertions.assertThat(updatedAccountBalance).isEqualTo(100);
//    }
//
//}
