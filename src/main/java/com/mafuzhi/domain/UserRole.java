package com.mafuzhi.domain;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.DynamicInsert;
import org.hibernate.annotations.DynamicUpdate;

import javax.persistence.*;

/**
 * Created by mafuz on 2017/3/31.
 */
@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "user_role")
@DynamicInsert(value = true)
@DynamicUpdate(value = true)
public class UserRole {

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private int id;

    private String username;

    private String role;
}
