package com.mafuzhi.service;

import com.mafuzhi.domain.*;
import com.mafuzhi.utils.BCryptEncoder;
import com.mafuzhi.utils.CurrentLoginUser;
import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import javax.persistence.criteria.CriteriaBuilder;
import javax.persistence.criteria.CriteriaQuery;
import javax.persistence.criteria.Predicate;
import javax.persistence.criteria.Root;
import java.util.ArrayList;
import java.util.List;


/**
 * Created by mafuz on 2017/3/31.
 */
@Service("userService")
public class UserService {

    private static final Log log = LogFactory.getLog(UserService.class);

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private UserCateRepository userCateRepository;

    @Autowired
    private UserSiteRepository userSiteRepository;

    @Autowired
    private SysCateRepository sysCateRepository;

    @Autowired
    private SysSiteRepository sysSiteRepository;

    @Autowired
    private UserRoleRepository userRoleRepository;

    public void userSign(User user) {
        User user1 = new User();
        user1.setUsername(user.getUsername());
        user1.setPassword(new BCryptEncoder(user.getPassword()).encoder());
        user1.setEnable(true);
        user1.setNolock(true);
        user1.setFirstlogin(true);
        log.info(user1.toString());
        userRepository.save(user1);
        UserRole userRole = new UserRole();
        userRole.setUsername(user.getUsername());
        userRoleRepository.save(userRole);
        log.warn(user.getPassword());
    }

//    /*
//     * 将系统分类复制到用户分类
//     */
//    public void copySysToUserCate(String username) {
//        List<SysCate> sysCateList = sysCateRepository.findAll();
//        List<UserCate> userCates = new ArrayList<>();
//        for (SysCate sysCate : sysCateList) {
//            UserCate userCate = new UserCate();
//            userCate.setUsername(username);
//            userCate.setCatename(sysCate.getCatename());
//            userCate.setDescription(sysCate.getDescription());
//            userCate.setEnable(sysCate.isEnable());
//            userCate.setHits(0);
//            log.info(userCate.toString());
//            userCates.add(userCate);
//        }
//        userCateRepository.save(userCates);
//
//    }
//    public void copySysToUserCateNoUsername() {
//        String username = new CurrentLoginUser().getCurrentUsername();
//        List<SysCate> sysCateList = sysCateRepository.findAll();
//        List<UserCate> userCates = null;
//        for (SysCate sysCate : sysCateList) {
//            UserCate userCate = new UserCate();
//            userCate.setUsername(username);
//            userCate.setCatename(sysCate.getCatename());
//            userCate.setDescription(sysCate.getDescription());
//            userCate.setEnable(sysCate.isEnable());
//            userCate.setHits(0);
//            userCates.add(userCate);
//        }
//        log.info(userCates.toString());
//        userCateRepository.save(userCates);
//
//    }

    /*
     * 将系统分类下网址复制到用户分类下网址
     */
//    public void copySysSiteToUserSite(String username) {
//        List<SysSite> sysSiteList = sysSiteRepository.findAll();
//        List<UserSite> userSiteList = new ArrayList<>();
//
//        for (SysSite sysSite : sysSiteList) {
//            UserSite userSite = new UserSite();
//            userSite.setUsername(username);
//            userSite.setEnable(sysSite.isEnable());
//            userSite.setCatename(sysSite.getCatename());
//            userSite.setHits(0);
//            userSite.setComment(sysSite.getComment());
//            userSite.setSiteurl(sysSite.getSiteurl());
//            userSite.setTitle(sysSite.getTitle());
//            userSiteList.add(userSite);
//        }
//        log.info(userSiteList.toString());
//        userSiteRepository.save(userSiteList);
//    }
//    public void copySysSiteToUserSiteNoUsername() {
//        String username = new CurrentLoginUser().getCurrentUsername();
//        List<SysSite> sysSiteList = sysSiteRepository.findAll();
//        List<UserSite> userSiteList = null;
//        for (SysSite sysSite : sysSiteList) {
//            UserSite userSite = new UserSite();
//            userSite.setUsername(username);
//            userSite.setEnable(sysSite.isEnable());
//            userSite.setCatename(sysSite.getCatename());
//            userSite.setHits(0);
//            userSite.setComment(sysSite.getComment());
//            userSite.setSiteurl(sysSite.getSiteurl());
//            userSite.setTitle(sysSite.getTitle());
//            userSiteList.add(userSite);
//        }
//        log.info(userSiteList.toString());
//        userSiteRepository.save(userSiteList);
//    }

    public User checkUsername(String username) {
        return userRepository.findByUsername(username);
    }

    private Specification<User> adminwhere(String[] keywords) {
        return (root, criteriaQuery, cb) -> {
            List<Predicate> predicates = new ArrayList<>();
            for (String s : keywords) {
                if (s != null && !s.equals(" ")) {
                    predicates.add(cb.like(root.<String> get("username"), "%" + s + "%"));
                }
            }
            Predicate[] pre = new Predicate[predicates.size()];
            return criteriaQuery.where(predicates.toArray(pre)).getRestriction();
        };
    }

    public List<User> searchByKeyword(String keyword) {
        if (keyword != null) {
            String[] strArray = keyword.replace(" ", "").split("");
            return userRepository.findAll(adminwhere(strArray));
        } else {
            return null;
        }
    }
}
