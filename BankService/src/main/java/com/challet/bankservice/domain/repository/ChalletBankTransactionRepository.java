package com.challet.bankservice.domain.repository;

import com.challet.bankservice.domain.entity.ChalletBankTransaction;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ChalletBankTransactionRepository extends
    JpaRepository<ChalletBankTransaction, Long> {

}
