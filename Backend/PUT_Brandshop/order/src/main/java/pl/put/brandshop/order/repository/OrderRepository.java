package pl.put.brandshop.order.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import pl.put.brandshop.order.entity.Order;

import java.util.List;
import java.util.Optional;

public interface OrderRepository extends JpaRepository<Order, Long>
{
    Optional<Order> findOrderByOrders(String orders);

    List<Order> findOrderByClient(String login);

    Optional<Order> findOrderByUuid(String uuid);
}
