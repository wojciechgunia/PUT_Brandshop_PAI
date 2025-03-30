package pl.put.brandshop.order.entity;


import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
@Entity
@Table
public class Payment
{
    @Id
    @GeneratedValue(generator = "payment_id_seq",strategy = GenerationType.SEQUENCE)
    @SequenceGenerator(name = "payment_id_seq",sequenceName = "payment_id_seq",allocationSize = 1)
    private long id;
    private String uuid;
    private String name;
    private String image_url;
}
