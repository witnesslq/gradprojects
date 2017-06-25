package com.mafuzhi.domain;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.DynamicInsert;
import org.hibernate.annotations.DynamicUpdate;
import org.hibernate.annotations.SelectBeforeUpdate;

import javax.persistence.*;
import java.util.Date;

/**
 * Created by mafuz on 2017/3/31.
 */
@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "user_site")
@DynamicInsert(value = true)
@SelectBeforeUpdate
@DynamicUpdate(value = true)
public class UserSite {

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private int id;

    private String catename;

    private String siteurl;

    private String title;

    private String comment;

    private String username;

    private int hits;

    private boolean enable;

    @Temporal(TemporalType.TIMESTAMP)
    private Date createtime;
}
