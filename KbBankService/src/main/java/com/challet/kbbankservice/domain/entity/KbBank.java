package com.challet.kbbankservice.domain.entity;

import io.swagger.v3.oas.annotations.media.Schema;
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
@Table(name = "kb_bank")
public class KbBank {

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
    private LocalDateTime createDateTime;

    @Column(name = "phone_number", nullable = false)
    private String phoneNumber;

    @Column(name = "mydata_status", nullable = false)
    private boolean myDataStatus;

    @Builder.Default
    @OneToMany(mappedBy = "kbBank", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<KbBankTransaction> kbBankTransactions = new ArrayList<>();

    public void addTransaction(KbBankTransaction kbBankTransaction) {
        this.accountBalance += kbBankTransaction.getTransactionAmount();
        this.kbBankTransactions.add(kbBankTransaction);
        kbBankTransaction.assignTransactionKbAccount(this);
    }
}
