package com.challet.shbankservice.domain.elasticsearch.repository;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import com.challet.shbankservice.domain.entity.SearchedTransaction;

public interface CustomSearchedTransactionRepository {
	Page<SearchedTransaction> findByAccountIdAndKeyword(Long accountId, String keyword, Pageable pageable);
}
