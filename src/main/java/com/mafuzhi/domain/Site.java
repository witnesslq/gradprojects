package com.mafuzhi.domain;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import javax.persistence.Entity;
import javax.persistence.Id;

/**
 * Created by mafuz on 2017/4/9.
 */
@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Site {

    @Id
    private int id;

    private String siteurl;
}
