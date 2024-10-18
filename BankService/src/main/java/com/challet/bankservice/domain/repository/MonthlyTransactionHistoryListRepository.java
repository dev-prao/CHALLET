package com.challet.bankservice.domain.repository;

import com.challet.bankservice.domain.dto.redis.MonthlyTransactionRedisListDTO;
import org.springframework.data.repository.CrudRepository;

public interface MonthlyTransactionHistoryListRepository extends
    CrudRepository<MonthlyTransactionRedisListDTO, String> {
}