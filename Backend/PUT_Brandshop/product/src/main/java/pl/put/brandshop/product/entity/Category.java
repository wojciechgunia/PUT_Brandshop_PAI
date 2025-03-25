package pl.put.brandshop.product.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Table(name = "category_parameters")
@Entity
public class Category
{
    @Id
    @GeneratedValue(generator = "category_parameters_id_seq", strategy = GenerationType.SEQUENCE)
    @SequenceGenerator(name = "category_parameters_id_seq",sequenceName = "category_parameters_id_seq", allocationSize = 1)
    private long id;
    @Column(name = "category_name")
    private String name;
    @Column(name = "short_id")
    private String shortId;
    private Boolean activate;
}
