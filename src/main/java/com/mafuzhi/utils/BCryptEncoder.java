package com.mafuzhi.utils;

import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;

/**
 * Created by mafuz on 2017/3/13.
 */
public class BCryptEncoder {
    public static void main(String[] args) {
        String password = "abc";
        BCryptPasswordEncoder passwordEncoder = new BCryptPasswordEncoder();
        System.out.println(passwordEncoder.encode(password));
    }
    String password = "";
    public  BCryptEncoder(String password) {
        this.password = password;
    }

    public String encoder() {
        BCryptPasswordEncoder passwordEncoder = new BCryptPasswordEncoder();
        return passwordEncoder.encode(password);
    }
}
