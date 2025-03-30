package pl.put.brandshop.order.entity;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
public class DeliverDTO
{
    private String uuid;
    private String name;
    private double price;
    private String image_url;
}
