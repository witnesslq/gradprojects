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
@Table(name = "sys_cate")
@DynamicInsert(value = true)
@DynamicUpdate(value = true)
public class SysCate {

    @Id
    private int id;

    private String catename;

    private String description;

    private int hits;

    @Temporal(TemporalType.TIMESTAMP)
    private Date createtime;

    private boolean enable;
}
