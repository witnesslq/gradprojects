package com.mafuzhi.service;

import com.mafuzhi.domain.*;
import com.mafuzhi.utils.CurrentLoginUser;
import com.mysql.jdbc.jdbc2.optional.MysqlDataSource;
import org.apache.mahout.cf.taste.common.TasteException;
import org.apache.mahout.cf.taste.impl.model.jdbc.MySQLJDBCDataModel;
import org.apache.mahout.cf.taste.impl.neighborhood.NearestNUserNeighborhood;
import org.apache.mahout.cf.taste.impl.recommender.GenericUserBasedRecommender;
import org.apache.mahout.cf.taste.impl.similarity.PearsonCorrelationSimilarity;
import org.apache.mahout.cf.taste.model.DataModel;
import org.apache.mahout.cf.taste.model.JDBCDataModel;
import org.apache.mahout.cf.taste.neighborhood.UserNeighborhood;
import org.apache.mahout.cf.taste.recommender.RecommendedItem;
import org.apache.mahout.cf.taste.recommender.Recommender;
import org.apache.mahout.cf.taste.similarity.UserSimilarity;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

/**
 * Created by mafuz on 2017/5/12.
 */
@Service("recordService")
public class RecordService {

    @Autowired
    private UserSiteRepository userSiteRepository;

    @Autowired
    private SiteRepository siteRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private SitePreferencesRepository sitePreferencesRepository;

    public void calc(int id, int time) {
        UserSite userSite = userSiteRepository.findOne(id);
        userSite.setHits(userSite.getHits() + 1);
        userSiteRepository.save(userSite);
        Site site = siteRepository.findBySiteurl(userSite.getSiteurl());

        User user = userRepository.findByUsername(userSite.getUsername());
        float value = 0;
        SitePreferences sitePreferences1 = sitePreferencesRepository.findByUseridAndSiteid(user.getId(), site.getId());
        SitePreferences sitePreferences = new SitePreferences();
        if(sitePreferences1 != null) {
            sitePreferences.setId(sitePreferences1.getId());
            value = sitePreferences1.getPreference();
            if(time > 60) {
                value = (sitePreferences1.getPreference() + 5)/2;
            } else if (time > 30) {
                value = (sitePreferences1.getPreference() + 4)/2;
            } else if(time > 0) {
                value = (sitePreferences1.getPreference() + 5)/2;
            }
        } else {
            if(time > 60) {
                value = 5;
            } else if (time > 30) {
                value = 4;
            } else /*if(time > 10)*/ {

                //todo
                value = 3;
            }
        }
        if(value > 5) {
            value = 5;
        }
        sitePreferences.setUserid(user.getId());
        sitePreferences.setSiteid(site.getId());
        sitePreferences.setPreference(value);
        sitePreferencesRepository.save(sitePreferences);

    }

    public String getUsernameBySecurity() {
        String username = new CurrentLoginUser().getCurrentUsername();
        return username;
    }

    public List<UserSite> recordToUser() throws TasteException {
        List<UserSite> userSiteList = new ArrayList<>();
        User user = userRepository.findByUsername(getUsernameBySecurity());
        int userid = user.getId();

        MysqlDataSource dataSource = new MysqlDataSource();
        dataSource.setServerName("localhost");
        dataSource.setUser("root");
        dataSource.setPassword("709722929");
        dataSource.setDatabaseName("smart_nav");
        System.out.println(123);
        JDBCDataModel dataModel = new MySQLJDBCDataModel(dataSource, "site_preferences", "userid", "siteid", "preference", "timestamp");

        DataModel model = dataModel;
        UserSimilarity similarity = new PearsonCorrelationSimilarity(model);
        //相邻用户UserNeighborhood
        UserNeighborhood neighborhood = new NearestNUserNeighborhood(10, similarity, model);
        Recommender recommender = new GenericUserBasedRecommender(model, neighborhood, similarity);
        //向用户推荐%d个商品
        List<RecommendedItem> recommendations = recommender.recommend(userid, 4);
        if(recommendations.size() > 0) {
            for(RecommendedItem recommendation : recommendations){
                Site site = siteRepository.findOne((int)recommendation.getItemID());
                UserSite userSite = userSiteRepository.findTop1BySiteurlAndUsername(site.getSiteurl(), getUsernameBySecurity());
                if(userSite == null) {
                    userSite = userSiteRepository.findTop1BySiteurl(site.getSiteurl());
                }
                if(userSite != null) {
                    if(!userSite.getUsername().equals(getUsernameBySecurity())) {
                        userSite.setUsername("");
                    }
                }
                userSiteList.add(userSite);

            }
        }
        return userSiteList;
    }
}
