package com.challet.nhbankservicedemo.domain.entity;

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

@Entity
@Getter
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "nh_bank")
public class NhBank {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "name")
    private String name;

    @Column(name = "account_number", nullable = false, unique = true)
    private String accountNumber;

    @Column(name = "account_balance", nullable = false)
    private Long accountBalance;

    @Column(name = "create_date_time", nullable = false, columnDefinition = "DATETIME")
    private LocalDateTime createDateTime;

    @Column(name = "phone_number", nullable = false)
    private String phoneNumber;

    @Column(name = "mydata_status", nullable = false)
    private boolean myDataStatus;

    @Builder.Default
    @OneToMany(mappedBy = "nhBank", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<NhBankTransaction> nhBankTransactions = new ArrayList<>();

    public void addTransaction(NhBankTransaction nhBankTransaction) {
        this.accountBalance += nhBankTransaction.getTransactionAmount();
        this.nhBankTransactions.add(nhBankTransaction);
        nhBankTransaction.assignTransactionNhAccount(this);
    }
}