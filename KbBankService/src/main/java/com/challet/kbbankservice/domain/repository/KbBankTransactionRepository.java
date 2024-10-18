package com.challet.kbbankservice.domain.repository;

import com.challet.kbbankservice.domain.entity.KbBankTransaction;
import org.springframework.data.jpa.repository.JpaRepository;

public interface KbBankTransactionRepository extends JpaRepository<KbBankTransaction, Long> {

}
