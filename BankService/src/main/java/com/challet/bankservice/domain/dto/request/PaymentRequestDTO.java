package com.challet.bankservice.domain.dto.request;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Schema(description = "결제 요청 데이터 DTO")
public class PaymentRequestDTO {
    @Schema(description = "결제 금액")
    private Long transactionAmount;
    @Schema(description = "결제 장소")
    private String withdrawal;
    @Schema(description = "결제 카테고리", allowableValues = {"DELIVERY","TRANSPORT","COFFEE","SHOPPING"})
    private String category;
}
