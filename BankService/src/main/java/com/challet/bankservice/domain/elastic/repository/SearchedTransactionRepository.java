package com.challet.bankservice.domain.elastic.repository;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.elasticsearch.repository.ElasticsearchRepository;

import com.challet.bankservice.domain.entity.SearchedTransaction;

public interface SearchedTransactionRepository extends
	ElasticsearchRepository<SearchedTransaction, String>, CustomSearchedTransactionRepository {

	Page<SearchedTransaction> findByAccountId(Long accountId, Pageable pageable);
}
