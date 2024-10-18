package com.challet.bankservice.domain.repository;

import com.challet.bankservice.domain.entity.CategoryT;
import com.challet.bankservice.domain.entity.QCategoryT;
import com.querydsl.jpa.impl.JPAQueryFactory;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Repository;

@Repository
@RequiredArgsConstructor
public class CategoryRepositoryImpl implements CategoryRepositoryCustom {

    private final JPAQueryFactory query;


    @Override
    public CategoryT getCategoryInfo(Long accountId, String categoryName) {
        QCategoryT category = QCategoryT.categoryT;
        return query.selectFrom(category)
            .where(category.challetBank.id.eq(accountId)
                .and(category.categoryName.eq(categoryName)))
            .fetchFirst();
    }
}
