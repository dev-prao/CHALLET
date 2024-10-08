package com.challet.bankservice.domain.repository;

import feign.Param;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.elasticsearch.annotations.Query;
import org.springframework.data.elasticsearch.repository.ElasticsearchRepository;

import com.challet.bankservice.domain.entity.SearchedTransaction;

public interface SearchedTransactionRepository extends
    ElasticsearchRepository<SearchedTransaction, String>{

    Page<SearchedTransaction> findByAccountId(Long accountId, Pageable pageable);

    Page<SearchedTransaction> findByAccountIdAndDepositContaining(Long accountId, String deposit,
        Pageable pageable);

    Page<SearchedTransaction> findByAccountIdAndDepositContainingOrWithdrawalContaining(
        Long accountId, String deposit, String withdrawal, Pageable pageable);

    @Query("{\"bool\": { \"must\": [ { \"term\": { \"accountId\": \"?0\" } }, { \"bool\": { \"should\": [ { \"wildcard\": { \"deposit\": \"*?1*\" } }, { \"wildcard\": { \"withdrawal\": \"*?1*\" } } ] } } ] }}")
    Page<SearchedTransaction> findByAccountIdAndKeyword(@Param("accountId") Long accountId, @Param("keyword") String keyword, Pageable pageable);



}
