package com.challet.shbankservice.domain.elasticsearch.repository;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.elasticsearch.repository.ElasticsearchRepository;

import com.challet.shbankservice.domain.entity.SearchedTransaction;

public interface SearchedTransactionRepository extends ElasticsearchRepository<SearchedTransaction, String>, CustomSearchedTransactionRepository {

    Page<SearchedTransaction> findByAccountId(Long accountId, Pageable pageable);
}
