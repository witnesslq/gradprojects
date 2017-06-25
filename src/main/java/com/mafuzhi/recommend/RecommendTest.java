package com.mafuzhi.recommend;

import com.mysql.jdbc.jdbc2.optional.MysqlDataSource;
import org.apache.mahout.cf.taste.common.TasteException;
import org.apache.mahout.cf.taste.impl.common.FastByIDMap;
import org.apache.mahout.cf.taste.impl.model.GenericDataModel;
import org.apache.mahout.cf.taste.impl.model.GenericUserPreferenceArray;
import org.apache.mahout.cf.taste.impl.model.jdbc.MySQLJDBCDataModel;
import org.apache.mahout.cf.taste.impl.neighborhood.NearestNUserNeighborhood;
import org.apache.mahout.cf.taste.impl.recommender.GenericUserBasedRecommender;
import org.apache.mahout.cf.taste.impl.similarity.PearsonCorrelationSimilarity;
import org.apache.mahout.cf.taste.model.DataModel;
import org.apache.mahout.cf.taste.model.JDBCDataModel;
import org.apache.mahout.cf.taste.model.Preference;
import org.apache.mahout.cf.taste.model.PreferenceArray;
import org.apache.mahout.cf.taste.neighborhood.UserNeighborhood;
import org.apache.mahout.cf.taste.recommender.RecommendedItem;
import org.apache.mahout.cf.taste.recommender.Recommender;
import org.apache.mahout.cf.taste.similarity.UserSimilarity;

import java.util.ArrayList;
import java.util.List;

/**
 * Created by mafuz on 2017/4/6.
 */
public class RecommendTest {


    public static void main(String[] args) throws TasteException {
//        int i = 5;
//        FastByIDMap<PreferenceArray> preferences =new FastByIDMap<PreferenceArray>();

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
        //向用户1推荐2个商品
        List<RecommendedItem> recommendations = recommender.recommend(4, 2);
        for(RecommendedItem recommendation : recommendations){
            //输出推荐结果
            System.out.println("==========================="+ recommendation);
        }
    }
}
