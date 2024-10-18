package com.challet.kbbankservice.domain.elasticsearch.repository;

import com.challet.kbbankservice.domain.entity.SearchedTransaction;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.elasticsearch.repository.ElasticsearchRepository;

public interface SearchedTransactionRepository extends
    ElasticsearchRepository<SearchedTransaction, String>, CustomSearchedTransactionRepository {

    Page<SearchedTransaction> findByAccountId(Long accountId, Pageable pageable);
}
