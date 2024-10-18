package com.challet.nhbankservicedemo.domain.elasticsearch.repository;

import feign.Param;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.elasticsearch.annotations.Query;
import org.springframework.data.elasticsearch.repository.ElasticsearchRepository;

import com.challet.nhbankservicedemo.domain.entity.SearchedTransaction;

public interface SearchedTransactionRepository extends
    ElasticsearchRepository<SearchedTransaction, String>, CustomSearchedTransactionRepository {

    Page<SearchedTransaction> findByAccountId(Long accountId, Pageable pageable);
}

