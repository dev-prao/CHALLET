package com.challet.bankservice.domain.entity;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.OneToMany;
import jakarta.persistence.Table;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.CreationTimestamp;

@Entity
@Getter
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "ch_bank")
public class ChalletBank {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name="name")
    private String name;

    @Column(name = "account_number", nullable = false, unique = true)
    private String accountNumber;

    @Column(name = "account_balance", nullable = false)
    private Long accountBalance;

    @Column(name = "create_date_time", nullable = false, columnDefinition = "DATETIME")
    @CreationTimestamp
    private LocalDateTime createDateTime;

    @Column(name = "phone_number", nullable = false)
    private String phoneNumber;

    @Builder.Default
    @Column(name = "mydata_status", nullable = false)
    private boolean myDataStatus = false;

    // 거래 발생시 처리
    @Builder.Default
    @OneToMany(mappedBy = "challetBank", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<ChalletBankTransaction> challetBankTransactions = new ArrayList<>();

    public void addTransaction(ChalletBankTransaction challetBankTransaction) {
        this.accountBalance += challetBankTransaction.getTransactionAmount();
        this.challetBankTransactions.add(challetBankTransaction);
        challetBankTransaction.assignTransactionChAccount(this);
    }

    public static ChalletBank createAccount(String name,String phoneNumber, String accountNumber) {
        return ChalletBank.builder()
            .name(name)
            .phoneNumber(phoneNumber)
            .accountNumber(accountNumber)
            .accountBalance(0L)
            .build();
    }

    public void updateMyDataStatus(boolean myDataStatus){
        this.myDataStatus = myDataStatus;
    }
}
