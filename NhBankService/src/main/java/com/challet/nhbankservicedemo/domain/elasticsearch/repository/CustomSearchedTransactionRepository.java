package com.challet.nhbankservicedemo.domain.elasticsearch.repository;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import com.challet.nhbankservicedemo.domain.entity.SearchedTransaction;

public interface CustomSearchedTransactionRepository {
	Page<SearchedTransaction> findByAccountIdAndKeyword(Long accountId, String keyword, Pageable pageable);
}
