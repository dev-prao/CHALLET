package com.challet.shbankservice.domain.dto.request;

import lombok.Builder;

@Builder
public record SearchTransactionRequestDTO(Long accountId, String keyword, int page, int size) {

    public static SearchTransactionRequestDTO of(Long accountId, String keyword, int page,
        int size) {

        return SearchTransactionRequestDTO.builder()
            .accountId(accountId)
            .keyword(keyword)
            .page(page)
            .size(size)
            .build();
    }
}
