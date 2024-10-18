package com.challet.bankservice.domain.repository;

import com.challet.bankservice.domain.entity.CategoryT;

public interface CategoryRepositoryCustom {

    CategoryT getCategoryInfo(Long accountId, String categoryName);
}
