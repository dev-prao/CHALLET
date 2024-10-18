package com.challet.shbankservice.domain.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.challet.shbankservice.domain.entity.ShBankTransaction;

public interface ShBankTransactionRepository extends JpaRepository<ShBankTransaction, Long> {

}
