package pl.put.brandshop.order.translators;

import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.Mappings;
import pl.put.brandshop.order.entity.Items;
import pl.put.brandshop.order.entity.OrderItems;

@Mapper
public abstract class OrderItemsToItems
{
    public Items toItems(OrderItems orderItems)
    {
        return toItems2(orderItems);
    }

    @Mappings({
            @Mapping(target = "imageUrl", ignore = true),
    })
    protected abstract Items toItems2(OrderItems orderItems);
}
