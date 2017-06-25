package com.mafuzhi.service;

import com.mafuzhi.domain.SysSite;
import com.mafuzhi.domain.SysSiteRepository;
import com.mafuzhi.domain.UserSite;
import com.mafuzhi.utils.CurrentLoginUser;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;

import javax.persistence.criteria.CriteriaBuilder;
import javax.persistence.criteria.CriteriaQuery;
import javax.persistence.criteria.Predicate;
import javax.persistence.criteria.Root;
import java.util.ArrayList;
import java.util.List;

/**
 * Created by mafuz on 2017/4/2.
 */
@Service("sysSiteService")
public class SysSiteService {

    @Autowired
    private SysSiteRepository sysSiteRepository;

    private Specification<SysSite> adminwhere(SysSite sysSite) {
        return (root, criteriaQuery, cb) -> {
            List<Predicate> predicates = new ArrayList<>();
            if (sysSite.getCatename() != null) {
                predicates.add(cb.like(root.<String> get("catename"), "%" + sysSite.getCatename() + "%"));
            }
            if (sysSite.getComment() != null) {
                predicates.add(cb.like(root.<String> get("comment"), "%" + sysSite.getComment() + "%"));
            }
            if (sysSite.getSiteurl() != null) {
                predicates.add(cb.like(root.<String> get("siteurl"), "%" + sysSite.getSiteurl() + "%"));
            }
            if (sysSite.getTitle() != null) {
                predicates.add(cb.like(root.<String> get("title"), "%" + sysSite.getTitle() + "%"));
            }
            Predicate[] pre = new Predicate[predicates.size()];
            return criteriaQuery.where(predicates.toArray(pre)).getRestriction();
        };
    }

    public List<SysSite> findAll(SysSite sysSite) {
        return sysSiteRepository.findAll(adminwhere(sysSite));
    }

    private Specification<SysSite> where(String[] keywords) {
        return new Specification<SysSite>() {
            @Override
            public Predicate toPredicate(Root<SysSite> root, CriteriaQuery<?> criteriaQuery, CriteriaBuilder cb) {
                List<Predicate> predicates = new ArrayList<>();
                for (String s : keywords) {
                    if (s != null && !s.equals(" ")) {
                        predicates.add(cb.like(root.<String> get("title"), "%" + s + "%"));
                    }
                }
                Predicate[] pre = new Predicate[predicates.size()];
                return criteriaQuery.where(predicates.toArray(pre)).getRestriction();
            }
        };
    }

    public List<SysSite> userSearch(String keyword) {
        if (keyword != null) {
            String[] strArray = keyword.replace(" ", "").split("");
            return sysSiteRepository.findAll(where(strArray));
        } else {
            return null;
        }
    }
}
