package com.mafuzhi.domain;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.PagingAndSortingRepository;

/**
 * Created by mafuz on 2017/4/9.
 */
public interface SiteRepository extends JpaRepository<Site, Integer>, JpaSpecificationExecutor<Site>, PagingAndSortingRepository<Site, Integer> {


    Site findBySiteurl(String siteurl);

}
