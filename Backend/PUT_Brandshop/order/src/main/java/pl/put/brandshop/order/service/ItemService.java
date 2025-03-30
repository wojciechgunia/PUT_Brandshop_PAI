package pl.put.brandshop.order.service;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import pl.put.brandshop.order.entity.Order;
import pl.put.brandshop.order.entity.OrderItems;
import pl.put.brandshop.order.repository.ItemRepository;

import java.util.List;

@Service
@RequiredArgsConstructor
public class ItemService
{
    private final ItemRepository itemRepository;


    public OrderItems save(OrderItems orderItems)
    {
        return itemRepository.saveAndFlush(orderItems);
    }

    public List<OrderItems> getByOrder(Order order)
    {
        return itemRepository.findOrderItemsByOrder(order);
    }
}
