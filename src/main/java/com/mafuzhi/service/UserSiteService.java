package com.mafuzhi.service;

import com.mafuzhi.domain.*;
import com.mafuzhi.utils.CurrentLoginUser;
import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;

import javax.persistence.criteria.CriteriaBuilder;
import javax.persistence.criteria.CriteriaQuery;
import javax.persistence.criteria.Predicate;
import javax.persistence.criteria.Root;
import java.util.ArrayList;
import java.util.List;

/**
 * Created by mafuz on 2017/4/1.
 */
@Service("userSiteService")
public class UserSiteService {

    private static final Log log = LogFactory.getLog(UserSiteService.class);

    @Autowired
    private UserSiteRepository userSiteRepository;

    @Autowired
    private UserCateRepository userCateRepository;

    @Autowired
    private SysCateRepository sysCateRepository;


    public List<UserSite> findByCatenameAndUsername(String catename) {
        if (catename.equals("commonnav")) {
            Sort sort = new Sort(Sort.Direction.ASC,"hits");
            List<UserSite> userSiteList = userSiteRepository.findTop8ByUsername(getUsernameBySecurity(),sort);
            log.info(userSiteList.toString());
            return userSiteList;
        }
        return userSiteRepository.findByCatenameAndUsernameAndEnableTrue(catename,getUsernameBySecurity());
    }

    public String getUsernameBySecurity() {
        String username = new CurrentLoginUser().getCurrentUsername();
        return username;
    }

    public UserSite findOne(int id) {
        return userSiteRepository.findOne(id);
    }

    public void save(UserSite userSite) {
        userSite.setUsername(getUsernameBySecurity());
        userSiteRepository.save(userSite);
    }

    public void delete(int id) {
        userSiteRepository.delete(id);
    }

    public void updateCatename(int id, String catename) {
        String username = getUsernameBySecurity();
        userSiteRepository.updateByCatename(catename,id);
    }

    private Specification<UserSite> adminwhere(UserSite userSite) {
        return (root, criteriaQuery, cb) -> {
            List<Predicate> predicates = new ArrayList<>();
            if (userSite.getCatename() != null) {
                predicates.add(cb.like(root.<String> get("catename"), "%" + userSite.getCatename() + "%"));
            }
            if (userSite.getComment() != null) {
                predicates.add(cb.like(root.<String> get("comment"), "%" + userSite.getComment() + "%"));
            }
            if (userSite.getSiteurl() != null) {
                predicates.add(cb.like(root.<String> get("siteurl"), "%" + userSite.getSiteurl() + "%"));
            }
            if (userSite.getTitle() != null) {
                predicates.add(cb.like(root.<String> get("title"), "%" + userSite.getTitle() + "%"));
            }
            if (userSite.getUsername() != null) {
                predicates.add(cb.like(root.<String> get("username"), "%" + userSite.getUsername() + "%"));
            }
            Predicate[] pre = new Predicate[predicates.size()];
            return criteriaQuery.where(predicates.toArray(pre)).getRestriction();
        };
    }

    private Specification<UserSite> where(String[] keywords) {
        return new Specification<UserSite>() {
            @Override
            public Predicate toPredicate(Root<UserSite> root, CriteriaQuery<?> criteriaQuery, CriteriaBuilder cb) {
                List<Predicate> predicates = new ArrayList<>();
                for (String s : keywords) {
                    if (s != null && !s.equals(" ")) {
                        predicates.add(cb.like(root.<String> get("title"), "%" + s + "%"));
                    }
                }
                predicates.add(cb.equal(root.<String> get("username"), getUsernameBySecurity()));
                Predicate[] pre = new Predicate[predicates.size()];
                return criteriaQuery.where(predicates.toArray(pre)).getRestriction();
            }
        };
    }

    public Page<UserSite> searchAdmin(Pageable pageable, UserSite userSite) {
        return userSiteRepository.findAll(adminwhere(userSite),pageable);
    }

    public List<UserSite> searchByKeyword(String keyword) {
        if (keyword != null) {
            String[] strArray = keyword.replace(" ", "").split("");
            return userSiteRepository.findAll(where(strArray));
        } else {
            return userSiteRepository.findByUsername(getUsernameBySecurity());
        }
    }

    public List<SysSite> removeRepeat(List<UserSite> userSiteList, List<SysSite> sysSiteList) {
        for(int i = 0; i < sysSiteList.size(); i++) {
            for(int j = 0; j < userSiteList.size(); j++) {
                if(sysSiteList.get(i).getTitle().equals(userSiteList.get(j).getTitle())) {
                    sysSiteList.remove(i);
                    i--;
                    if(i < 0) {
                        break;
                    }
                }
            }
        }
//        List<String> usertitle = new ArrayList<>();
//        List<String> systitle = new ArrayList<>();
//        if (!userSiteList.isEmpty()) {
//            for (int i = 0; i < userSiteList.size(); i++) {
//                usertitle.add(userSiteList.get(i).getTitle());
//            }
//        }
//        if (!sysSiteList.isEmpty()) {
//            for (int j = 0; j < sysSiteList.size(); j++) {
//                systitle.add(sysSiteList.get(j).getTitle());
//            }
//        }
//        List<String> temp = new ArrayList<>(usertitle);
//        temp.retainAll(systitle);
//        System.out.println("=====================================" + temp.toString());
//        if (!systitle.isEmpty()) {
//            for(String s : temp) {
//                for(int k = 0; k < sysSiteList.size(); k++) {
//                    if (temp.equals(sysSiteList.get(k).getTitle())) {
//                        sysSiteList.remove(k);
//                    }
//                }
//            }
//        }

        return sysSiteList;
    }

    public boolean addToUser(SysSite sysSite) {
        UserCate userCate1 = userCateRepository.findByCatenameAndUsername(sysSite.getCatename(), getUsernameBySecurity());
        if(userCate1 != null) {
            copyUserSite(sysSite);
            return true;
        } else {
            UserCate userCate = new UserCate();
            SysCate sysCate = sysCateRepository.findByCatename(sysSite.getCatename());
            System.out.println("=================================" + getUsernameBySecurity());
            userCate.setUsername(getUsernameBySecurity());
            userCate.setCatename(sysCate.getCatename());
            userCate.setDescription(sysCate.getDescription());
            userCate.setEnable(sysCate.isEnable());
            userCate.setHits(0);
            userCateRepository.save(userCate);

            copyUserSite(sysSite);
            return true;
        }
    }

    public void copyUserSite(SysSite sysSite) {
        UserSite userSite = new UserSite();
        userSite.setUsername(getUsernameBySecurity());
        userSite.setEnable(sysSite.isEnable());
        userSite.setCatename(sysSite.getCatename());
        userSite.setHits(0);
        userSite.setComment(sysSite.getComment());
        userSite.setSiteurl(sysSite.getSiteurl());
        userSite.setTitle(sysSite.getTitle());
        userSiteRepository.save(userSite);
    }

    public boolean addRecordToUser(UserSite userSite) {
        UserSite userSite1 = new UserSite();
        userSite1.setCatename(userSite.getCatename());
        userSite1.setSiteurl(userSite.getSiteurl());
        userSite1.setUsername(getUsernameBySecurity());
        userSite1.setHits(0);
        userSite1.setComment(userSite.getComment());
        userSite1.setEnable(true);
        userSite1.setTitle(userSite.getTitle());
        try {
            userSiteRepository.save(userSite1);
            return true;
        } catch (Exception e) {
            return false;
        }
    }
}
