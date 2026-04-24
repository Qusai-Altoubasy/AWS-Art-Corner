package com.artcorner.erp.entities.users;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.UUID;

@Entity
@Table(name = "address")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Address {
    @Id
    private UUID customerId;

    @OneToOne
    @MapsId
    @JoinColumn(name = "customer_id")
    private User user;

    @Column(nullable = false)
    private String street;

    @Column(nullable = false)
    private String apartment;

    @Column(nullable = false)
    private String city;
}
