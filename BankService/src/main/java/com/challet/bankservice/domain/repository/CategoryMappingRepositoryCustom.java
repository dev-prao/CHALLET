package com.challet.bankservice.domain.repository;

import com.challet.bankservice.domain.dto.request.ConfirmPaymentRequestDTO;

public interface CategoryMappingRepositoryCustom {

    long updateCategory(Long accountId, Long categoryId, ConfirmPaymentRequestDTO paymentRequestDTO);

}
