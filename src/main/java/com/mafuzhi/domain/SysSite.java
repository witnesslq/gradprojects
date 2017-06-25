package com.mafuzhi.domain;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.DynamicInsert;
import org.hibernate.annotations.DynamicUpdate;

import javax.persistence.*;
import java.util.Date;

/**
 * Created by mafuz on 2017/3/31.
 */
@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "sys_site")
@DynamicInsert(value = true)
@DynamicUpdate(value = true)
public class SysSite {

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private int id;

    private String catename;

    private String siteurl;

    private String title;

    private String comment;

    private int hits;

    private boolean enable;

    @Temporal(TemporalType.TIMESTAMP)
    private Date createtime;
}
