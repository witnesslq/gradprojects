package com.mafuzhi.service;

import com.mafuzhi.domain.*;
import com.mafuzhi.utils.CurrentLoginUser;
import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
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
 * Created by mafuz on 2017/4/1.
 */
@Service("userCateService")
public class UserCateService {

    private static final Log log = LogFactory.getLog(UserCateService.class);

    @Autowired
    private UserCateRepository userCateRepository;

    @Autowired
    private SysCateRepository sysCateRepository;

    @Autowired
    private SysSiteRepository sysSiteRepository;

    @Autowired
    private UserSiteRepository userSiteRepository;

    @Autowired
    private UserRepository userRepository;

    public List<UserCate> findAllCatesWithEnable() {
        String username = getUsernameBySecurity();
        List<UserCate> cateList = userCateRepository.findByUsernameAndEnableTrue(username);
        log.debug(cateList.toString());
        return cateList;
    }

    public List<UserCate> findByUsername() {
        String username = getUsernameBySecurity();
        List<UserCate> cateList = userCateRepository.findByUsername(username);
        log.debug(cateList.toString());
        return cateList;
    }

    public String getUsernameBySecurity() {
        String username = new CurrentLoginUser().getCurrentUsername();
        return username;
    }

    public UserCate findByCatename(String catename) {
        UserCate userCate = userCateRepository.findByCatenameAndUsername(catename,getUsernameBySecurity());
        return userCate;
    }

    public String checkCatename(String catename){
        UserCate userCate = userCateRepository.findByCatenameAndUsername(catename,getUsernameBySecurity());
        if (userCate!= null) {
            return "yes";
        }
        return "no";
    }

    public void saveCate(UserCate userCate) {
        userCate.setUsername(getUsernameBySecurity());
        userCateRepository.save(userCate);
    }

    public void save(UserCate userCate) {
        userCate.setUsername(getUsernameBySecurity());
        userCateRepository.save(userCate);
    }

    public void deleteByCatename(String catenmae) {
        String username = getUsernameBySecurity();
        userCateRepository.deleteByCatenameAndUsername(catenmae, username);
    }

    public List<String> findCatename() {
        String username = getUsernameBySecurity();
        List<String> catename = userCateRepository.findCatename(username);
        return catename;
    }

    private Specification<UserCate> where(UserCate userCate) {
        return (root, criteriaQuery, cb) -> {
            List<Predicate> predicates = new ArrayList<>();
            predicates.add(cb.equal(root.<String> get("username"), getUsernameBySecurity()));
            if (userCate.getCatename() !=null) {
                predicates.add(cb.like(root.<String> get("catename"), "%" + userCate.getCatename() + "%"));
            }
            if (userCate.getDescription() != null) {
                predicates.add(cb.like(root.<String> get("description"), "%" + userCate.getDescription() + "%"));
            }
            Predicate[] pre = new Predicate[predicates.size()];
            return criteriaQuery.where(predicates.toArray(pre)).getRestriction();
        };
    }

    private Specification<UserCate> adminwhere(UserCate userCate) {
        return (root, criteriaQuery, cb) -> {
            List<Predicate> predicates = new ArrayList<>();
            if (userCate.getCatename() !=null) {
                predicates.add(cb.like(root.<String> get("catename"), "%" + userCate.getCatename() + "%"));
            }
            if (userCate.getDescription() != null) {
                predicates.add(cb.like(root.<String> get("description"), "%" + userCate.getDescription() + "%"));
            }
            if (userCate.getUsername() != null) {
                predicates.add(cb.like(root.<String> get("username"), "%" + userCate.getUsername() + "%"));
            }
            Predicate[] pre = new Predicate[predicates.size()];
            return criteriaQuery.where(predicates.toArray(pre)).getRestriction();
        };
    }

    public List<UserCate> adminSearchUserCate(UserCate userCate) {
        return userCateRepository.findAll(adminwhere(userCate));
    }

    public List<UserCate> searchUserCate(UserCate userCate) {
        String username = getUsernameBySecurity();
        return userCateRepository.findAll(where(userCate));
    }

    public void copyCate(String str) {
        String[] strarray = str.split(",");
        int array[] = new int[strarray.length];
        int i = 0;
        List<SysCate> sysCateList = new ArrayList<>();
        for(String s: strarray) {
            sysCateList.add(sysCateRepository.findOne(Integer.parseInt(s)));
        }
        List<UserCate> userCates = new ArrayList<>();
        List<SysSite> sysSiteList = new ArrayList<>();
        List<UserSite> userSiteList = new ArrayList<>();
        String username = getUsernameBySecurity();
        for (SysCate sysCate : sysCateList) {
            UserCate userCate = new UserCate();
            userCate.setUsername(username);
            userCate.setCatename(sysCate.getCatename());
            sysSiteList.addAll(sysSiteRepository.findByCatename(sysCate.getCatename()));
            userCate.setDescription(sysCate.getDescription());
            userCate.setEnable(sysCate.isEnable());
            userCate.setHits(0);
            log.info(userCate.toString());
            userCates.add(userCate);
        }
        for (SysSite sysSite : sysSiteList) {
            UserSite userSite = new UserSite();
            userSite.setUsername(username);
            userSite.setEnable(sysSite.isEnable());
            userSite.setCatename(sysSite.getCatename());
            userSite.setHits(0);
            userSite.setComment(sysSite.getComment());
            userSite.setSiteurl(sysSite.getSiteurl());
            userSite.setTitle(sysSite.getTitle());
            userSiteList.add(userSite);
        }
        userCateRepository.save(userCates);
        userSiteRepository.save(userSiteList);

        User user = userRepository.findByUsername(getUsernameBySecurity());
        user.setFirstlogin(false);
        userRepository.save(user);
    }

    public UserCate changeByCatename(String catename) {
        return userCateRepository.findByCatenameAndUsername(catename, getUsernameBySecurity());
    }
}
