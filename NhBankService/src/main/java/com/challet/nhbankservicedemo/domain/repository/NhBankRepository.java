package com.challet.nhbankservicedemo.domain.repository;

import com.challet.nhbankservicedemo.domain.entity.NhBank;
import org.springframework.data.jpa.repository.JpaRepository;

public interface NhBankRepository extends JpaRepository<NhBank, Long>, NhBankRepositoryCustom {

}