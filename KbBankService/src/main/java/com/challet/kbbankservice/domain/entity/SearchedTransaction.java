package com.challet.kbbankservice.domain.entity;

import io.swagger.v3.oas.annotations.media.Schema;
import java.time.LocalDateTime;
import java.time.ZoneId;
import java.util.Date;
import lombok.Builder;
import org.springframework.data.annotation.Id;
import org.springframework.data.elasticsearch.annotations.DateFormat;
import org.springframework.data.elasticsearch.annotations.Document;
import org.springframework.data.elasticsearch.annotations.Field;
import org.springframework.data.elasticsearch.annotations.FieldType;

@Builder
@Document(indexName = "kb_bank_transaction")
@Schema(description = "국민은행 거래내역 검색")
public record SearchedTransaction(

    @Id
    @Schema(description = "거래내역 ID")
    String transactionId,

    @Field(type = FieldType.Keyword)
    @Schema(description = "계좌 ID")
    Long accountId,

    @Field(type = FieldType.Date, format = DateFormat.date_time, pattern = "uuuu-MM-dd'T'HH:mm:ss")
    @Schema(description = "거래 날짜 시간")
    Date transactionDate,

    @Field(type = FieldType.Text)
    @Schema(description = "입금처")
    String deposit,

    @Field(type = FieldType.Long)
    @Schema(description = "거래 후 잔액")
    Long transactionBalance,

    @Field(type = FieldType.Long)
    @Schema(description = "거래 금액")
    Long transactionAmount
) {

    public static SearchedTransaction fromAccountIdAndKbBankTransaction(final Long accountId, final KbBankTransaction transaction) {
        return SearchedTransaction.builder()
            .transactionId(String.valueOf(transaction.getId()))
            .accountId(accountId)
            .transactionDate(convertToDate(transaction.getTransactionDatetime()))
            .deposit(transaction.getDeposit())
            .transactionBalance(transaction.getTransactionBalance())
            .transactionAmount(transaction.getTransactionAmount())
            .build();
    }

    public static Date convertToDate(LocalDateTime localDateTime) {
        return Date.from(localDateTime.atZone(ZoneId.systemDefault()).toInstant());
    }
}
