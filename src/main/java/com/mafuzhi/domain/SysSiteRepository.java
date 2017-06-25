package com.mafuzhi.domain;

import org.springframework.data.jpa.domain.Specification;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;

import java.util.List;

/**
 * Created by mafuz on 2017/3/31.
 */
public interface SysSiteRepository extends JpaRepository<SysSite, Integer>, JpaSpecificationExecutor<SysSite> {
    List<SysSite> findByCatename(String catename);

//    List<SysCate> findByEnableTrue();

    List<SysSite> findByEnableTrue(Specification<SysSite> spec);
}
