package com.mafuzhi.domain;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.PagingAndSortingRepository;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Map;

/**
 * Created by mafuz on 2017/3/31.
 */
public interface UserSiteRepository extends JpaRepository<UserSite, Integer>, JpaSpecificationExecutor<UserSite>, PagingAndSortingRepository<UserSite, Integer> {
    List<UserSite> findByCatenameAndUsernameAndEnableTrue(String catename, String username);

    @Modifying
    @Transactional
    @Query("update UserSite u set u.catename= ?1 where u.id=?2")
    void updateByCatename(String catename, int id);

    List<UserSite> findTop8ByUsername(String username, Sort sort);

    //@Test
    @Query("select us.siteurl as siteurl, sum(us.hits) as hits from UserSite us group by us.siteurl")
    List<Map<String, Object>> findSiteurlAndhits();

    List<UserSite> findByUsername(String username);

    Page<UserSite> findAll(Specification<UserSite> spec, Pageable pageable);

    List<UserSite> findByTitle(String title);


    UserSite findTop1BySiteurlAndUsername(String siteurl, String username);

    UserSite findTop1BySiteurl(String siteurl);
}
