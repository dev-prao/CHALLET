package com.challet.bankservice.domain.repository;

import com.challet.bankservice.domain.dto.request.ConfirmPaymentRequestDTO;
import com.challet.bankservice.domain.entity.QCategoryMapping;
import com.querydsl.jpa.impl.JPAQueryFactory;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Repository;

@Repository
@RequiredArgsConstructor
public class CategoryMappingRepositoryImpl implements CategoryMappingRepositoryCustom{

    private final JPAQueryFactory query;

    @Override
    public long updateCategory(Long accountId, Long categoryId,
        ConfirmPaymentRequestDTO paymentRequestDTO) {
        QCategoryMapping categoryMapping = QCategoryMapping.categoryMapping;

        return query
            .update(categoryMapping)
            .set(categoryMapping.categoryT.id, categoryId)
            .where(categoryMapping.challetBank.id.eq(accountId)
                .and(categoryMapping.depositName.eq(paymentRequestDTO.deposit())))
            .execute();

    }
}
