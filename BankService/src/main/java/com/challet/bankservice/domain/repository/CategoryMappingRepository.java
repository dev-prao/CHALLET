package com.challet.bankservice.domain.repository;

import com.challet.bankservice.domain.entity.CategoryMapping;
import org.springframework.data.jpa.repository.JpaRepository;

public interface CategoryMappingRepository extends JpaRepository<CategoryMapping, Long>,
    CategoryMappingRepositoryCustom {
}
