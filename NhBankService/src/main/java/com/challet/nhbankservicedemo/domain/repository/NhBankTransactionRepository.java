package com.challet.nhbankservicedemo.domain.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.challet.nhbankservicedemo.domain.entity.NhBankTransaction;

public interface NhBankTransactionRepository extends JpaRepository<NhBankTransaction, Long> {

}
