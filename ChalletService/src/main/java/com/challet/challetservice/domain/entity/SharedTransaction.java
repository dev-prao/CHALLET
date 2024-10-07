package com.challet.challetservice.domain.entity;

import com.challet.challetservice.domain.dto.request.SharedTransactionRegisterRequestDTO;
import com.challet.challetservice.domain.dto.request.SharedTransactionUpdateRequestDTO;
import com.challet.challetservice.domain.request.PaymentHttpMessageRequestDTO;
import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
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
@Builder
@Getter
@AllArgsConstructor
@NoArgsConstructor
@Table(name = "shared_transaction")
public class SharedTransaction {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_challenge_id", nullable = false)
    private UserChallenge userChallenge;

    @Column(nullable = false)
    private String deposit;

    @Column(nullable = false)
    private Long transactionAmount;

    @Column(name = "transaction_datetime", nullable = false, columnDefinition = "DATETIME")
    private LocalDateTime transactionDateTime;

    @Column(name = "content", nullable = true, columnDefinition = "TEXT")
    private String content;

    @Column(name = "image", nullable = true)
    private String image;

    @Builder.Default
    @OneToMany(mappedBy = "sharedTransaction", fetch = FetchType.LAZY, cascade = CascadeType.ALL, orphanRemoval = true)
    private List<Emoji> emojis = new ArrayList<>();

    @Builder.Default
    @OneToMany(mappedBy = "sharedTransaction", fetch = FetchType.LAZY, cascade = CascadeType.ALL, orphanRemoval = true)
    private List<Comment> comments = new ArrayList<>();

    public static SharedTransaction fromRequest(SharedTransactionRegisterRequestDTO request, UserChallenge userChallenge) {
        SharedTransaction sharedTransaction = SharedTransaction.builder()
            .userChallenge(userChallenge)
            .deposit(request.deposit())
            .transactionAmount(request.transactionAmount())
            .transactionDateTime(LocalDateTime.now())
            .content(request.content())
            .image(request.image())
            .build();

        userChallenge.getSharedTransactions().add(sharedTransaction);
        return sharedTransaction;
    }

    public static SharedTransaction fromPayment(PaymentHttpMessageRequestDTO paymentNotification, UserChallenge userChallenge){
        SharedTransaction sharedTransaction = SharedTransaction.builder()
            .userChallenge(userChallenge)
            .deposit(paymentNotification.deposit())
            .transactionAmount(-paymentNotification.transactionAmount())
            .transactionDateTime(LocalDateTime.now())
            .build();

        userChallenge.getSharedTransactions().add(sharedTransaction);
        return sharedTransaction;
    }

    public void updateSharedTransaction(SharedTransactionUpdateRequestDTO updateRequest){
        this.deposit = updateRequest.deposit();
        this.transactionAmount = updateRequest.transactionAmount();
        this.content = updateRequest.content();
        this.image = updateRequest.image();
    }

}
