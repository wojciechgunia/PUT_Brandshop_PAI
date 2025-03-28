package pl.put.brandshop.basket.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import pl.put.brandshop.basket.entity.Basket;

import java.util.Optional;

public interface BasketRepository extends JpaRepository<Basket, Long>
{

    Optional<Basket> findByUuid(String uuid);
}
