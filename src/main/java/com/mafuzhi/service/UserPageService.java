package com.mafuzhi.service;

import com.mafuzhi.domain.User;
import com.mafuzhi.domain.UserRepository;
import com.mafuzhi.utils.CurrentLoginUser;
import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

/**
 * Created by mafuz on 2017/3/31.
 */
@Service("userPageService")
public class UserPageService {

    private static final Log log = LogFactory.getLog(UserPageService.class);

    @Autowired
    private UserRepository userRepository;

    public String indexOrLogin() {
        String usernmae = new CurrentLoginUser().getCurrentUsername();
        log.info(usernmae);
        if (usernmae != null && usernmae != "anonymousUser") {
            User user = userRepository.findByUsername(usernmae);
            if (user.isFirstlogin() == true) {
                return "firstlogin";
            } else {
                return "index";
            }
        } else {
            return "login";
        }
    }
}
