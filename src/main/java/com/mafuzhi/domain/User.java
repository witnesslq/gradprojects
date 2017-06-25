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
@Table(name = "user")
@DynamicInsert(value = true)
@DynamicUpdate(value = true)
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private int id;

    private String username;

    private String password;

    private boolean enable;

    private boolean nolock;

    private boolean firstlogin;

    @Temporal(TemporalType.TIMESTAMP)
    private Date createtime;

}
