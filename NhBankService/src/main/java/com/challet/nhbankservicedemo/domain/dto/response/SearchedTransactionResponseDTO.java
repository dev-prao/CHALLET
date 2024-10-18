package com.challet.nhbankservicedemo.domain.dto.response;

import java.util.List;

import com.challet.nhbankservicedemo.domain.entity.SearchedTransaction;

import lombok.Builder;

@Builder
public record SearchedTransactionResponseDTO(int count, boolean isLastPage, List<SearchedTransaction> searchedTransactions) {

    public static SearchedTransactionResponseDTO fromSearchedTransaction(List<SearchedTransaction> searchedTransactions, boolean isLastPage) {
        return SearchedTransactionResponseDTO.builder()
            .count(searchedTransactions.size())
            .isLastPage(isLastPage)
            .searchedTransactions(searchedTransactions)
            .build();
    }
}
