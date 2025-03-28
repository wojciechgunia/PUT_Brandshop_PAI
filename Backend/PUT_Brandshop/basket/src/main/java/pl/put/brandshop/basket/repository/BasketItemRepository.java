package pl.put.brandshop.basket.repository;


import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import pl.put.brandshop.basket.entity.Basket;
import pl.put.brandshop.basket.entity.BasketItems;

import java.util.List;
import java.util.Optional;


public interface BasketItemRepository extends JpaRepository<BasketItems, Long>
{

    @Query(nativeQuery = true,value = "SELECT SUM(quantity) from basket_items where basket = ?1")
    Long sumBasketItems(long basket);

    Optional<BasketItems> findBasketItemsByProduct(String uuid);

    List<BasketItems> findBasketItemsByBasket(Basket basket);

    Optional<BasketItems> findByBasketAndProduct(Basket basket, String uid);
}
