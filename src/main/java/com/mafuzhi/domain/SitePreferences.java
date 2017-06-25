package com.mafuzhi.domain;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.DynamicInsert;
import org.hibernate.annotations.DynamicUpdate;

import javax.persistence.Entity;
import javax.persistence.Id;
import javax.persistence.Table;
import java.util.Date;

/**
 * Created by mafuz on 2017/5/12.
 */
@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "site_preferences")
public class SitePreferences {

    @Id
    public int id;

    public int userid;

    private int siteid;

    private float preference;

    private Date timestamp;
}
