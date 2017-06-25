package com.mafuzhi.service;

import com.mafuzhi.domain.SysCate;
import com.mafuzhi.domain.SysCateRepository;
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
@Service("sysCateService")
public class SysCateService {

    @Autowired
    private SysCateRepository sysCateRepository;

    private Specification<SysCate> where(SysCate sysCate) {
        return new Specification<SysCate>() {
            @Override
            public Predicate toPredicate(Root<SysCate> root, CriteriaQuery<?> criteriaQuery, CriteriaBuilder cb) {
                List<Predicate> predicates = new ArrayList<>();
                if (sysCate.getCatename() !=null) {
                    predicates.add(cb.like(root.<String> get("catename"), "%" + sysCate.getCatename() + "%"));
                }
                if (sysCate.getDescription() != null) {
                    predicates.add(cb.like(root.<String> get("description"), "%" + sysCate.getDescription() + "%"));
                }
                Predicate[] pre = new Predicate[predicates.size()];
                return criteriaQuery.where(predicates.toArray(pre)).getRestriction();
            }
        };
    }

    public List<SysCate> findAll(SysCate sysCate) {
        return sysCateRepository.findAll(where(sysCate));
    }
}
