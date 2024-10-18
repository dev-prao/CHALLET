package com.challet.bankservice.domain.entity;

import com.challet.bankservice.domain.dto.request.AccountTransferRequestDTO;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import java.time.LocalDateTime;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Entity
@Getter
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "ch_transaction")
public class ChalletBankTransaction {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "ch_bank_id", nullable = false)
    private ChalletBank challetBank;

    @Column(name = "transaction_amount", nullable = false)
    private Long transactionAmount;

    @Column(name = "transaction_datetime", nullable = false, columnDefinition = "DATETIME")
    private LocalDateTime transactionDatetime;

    @Column(name = "deposit", nullable = false)
    private String deposit;

    @Column(name = "withdrawal", nullable = false)
    private String withdrawal;

    @Column(name = "transaction_balance", nullable = false)
    private Long transactionBalance;

    @Enumerated(EnumType.STRING)
    private Category category;


    public void assignTransactionChAccount(ChalletBank challetBank) {
        this.challetBank = challetBank;
    }

    public static ChalletBankTransaction createAccountTransferHistory(ChalletBank fromBank,
        String toBankName, AccountTransferRequestDTO requestTransactionDTO,
        long transactionBalance, boolean isWithdrawal, String deposit) {

        return ChalletBankTransaction.builder()
            .transactionAmount(isWithdrawal ? -1 * requestTransactionDTO.transactionAmount()
                : requestTransactionDTO.transactionAmount())
            .transactionDatetime(LocalDateTime.now())
            .deposit(isWithdrawal ? toBankName
                : requestTransactionDTO.depositAccountNumber()) // 입금처
            .withdrawal(isWithdrawal ? fromBank.getAccountNumber() : fromBank.getName()) // 출금처
            .transactionBalance(transactionBalance)
            .category(Category.valueOf(deposit))
            .build();
    }

    public void updateCategory(String category) {
        this.category = Category.valueOf(category);
    }
}
