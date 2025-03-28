package pl.put.brandshop.basket.entity;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDate;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class BasketItemDTO
{
    private String uuid;

    private String name;

    private long quantity;

    private String imageUrl;

    private double price;

    private double summaryPrice;
    private LocalDate createAt;
}

