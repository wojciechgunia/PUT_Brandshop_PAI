package pl.put.brandshop.order.translators;

import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.Mappings;
import pl.put.brandshop.order.entity.OrderItems;
import pl.put.brandshop.order.entity.PayUProduct;

@Mapper
public abstract class OrderItemsToPayUProduct
{
    public PayUProduct toPayUProduct(OrderItems orderItems)
    {
        return toPayU(orderItems);
    }

    @Mappings({
            @Mapping(target = "unitPrice", source = "priceUnit")
    })
    protected abstract PayUProduct toPayU(OrderItems orderItems);
}
