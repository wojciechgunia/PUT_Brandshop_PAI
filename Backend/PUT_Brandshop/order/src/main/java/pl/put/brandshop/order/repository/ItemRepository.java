package pl.put.brandshop.order.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import pl.put.brandshop.order.entity.Order;
import pl.put.brandshop.order.entity.OrderItems;

import java.util.List;

public interface ItemRepository extends JpaRepository<OrderItems, Long>
{
    List<OrderItems> findOrderItemsByOrder(Order order);
}
