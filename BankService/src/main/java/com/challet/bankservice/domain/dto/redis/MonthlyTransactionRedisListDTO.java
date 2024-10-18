package com.challet.bankservice.domain.dto.redis;

import com.challet.bankservice.domain.dto.response.MonthlyTransactionHistoryDTO;
import jakarta.persistence.Id;
import java.io.Serializable;
import java.util.List;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import org.springframework.data.redis.core.RedisHash;

@Getter
@Builder
@NoArgsConstructor
@AllArgsConstructor
@RedisHash(value = "MonthlyTransactionHistoryList")
public class MonthlyTransactionRedisListDTO implements Serializable {

    @Id
    private String id;
    private List<MonthlyTransactionHistoryDTO> monthlyTransactions;
}