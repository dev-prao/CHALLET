package com.challet.kbbankservice.domain.dto.response;

import com.challet.kbbankservice.domain.entity.SearchedTransaction;
import java.util.List;
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
