package com.mafuzhi.utils;

import org.springframework.security.core.context.SecurityContextHolder;

/**
 * Created by mafuz on 2017/3/14.
 */
public class CurrentLoginUser {

    public CurrentLoginUser() {
    }

    /*
     *  获取当前登录用户
     */
    public String getCurrentUsername() {
        return SecurityContextHolder.getContext().getAuthentication().getName();
    }
}
