package com.challet.kbbankservice.domain.elasticsearch.repository;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import com.challet.kbbankservice.domain.entity.SearchedTransaction;

public interface CustomSearchedTransactionRepository {
	Page<SearchedTransaction> findByAccountIdAndKeyword(Long accountId, String keyword, Pageable pageable);
}
