package com.mafuzhi.security;

import com.mafuzhi.domain.User;
import com.mafuzhi.domain.UserRepository;
import com.mafuzhi.domain.UserRoleRepository;
import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

/**
 * Created by mafuz on 2017/3/13.
 */
@Service("customUserDetailsService")
public class CustomUserDetailsService implements UserDetailsService {
    private static Log log = LogFactory.getLog(CustomUserDetailsService.class);
    private final UserRepository userRepository;
    private final UserRoleRepository userRolesRepository;

    @Autowired
    public CustomUserDetailsService(UserRepository userRepository,UserRoleRepository userRolesRepository) {
        this.userRepository = userRepository;
        this.userRolesRepository=userRolesRepository;
    }


    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        User user=userRepository.findByUsername(username);
        if(null == user){
            throw new UsernameNotFoundException("No user present with username: "+username);
        }else{
            List<String> userRoles=userRolesRepository.findRoleByUsername(username);
            log.info(userRoles.toString());

            return new org.springframework.security.core.userdetails.User(user.getUsername(), user.getPassword(),
                    true, true, true, true, getGrantedAuthorities(userRoles));
        }
    }

    private List<GrantedAuthority> getGrantedAuthorities(List<String> userRoles){
        List<GrantedAuthority> authorities = new ArrayList<GrantedAuthority>();

        for(String userRole : userRoles){
            System.out.println("UserProfile : "+userRole);
            authorities.add(new SimpleGrantedAuthority(userRole));
        }
        log.info(authorities.toString()+ "========================================================");
        return authorities;
    }

}
