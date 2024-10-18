package com.challet.bankservice.domain.elastic.repository;

import java.util.List;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import com.challet.bankservice.domain.entity.SearchedTransaction;

public interface CustomSearchedTransactionRepository {
	Page<SearchedTransaction> findByAccountIdAndKeyword(Long accountId, String keyword, Pageable pageable);
}
