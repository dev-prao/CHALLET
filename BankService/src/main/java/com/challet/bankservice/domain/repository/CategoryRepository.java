package com.challet.bankservice.domain.repository;

import com.challet.bankservice.domain.entity.CategoryT;
import org.springframework.data.jpa.repository.JpaRepository;

public interface CategoryRepository extends JpaRepository<CategoryT, Long>,
    CategoryRepositoryCustom {

}
