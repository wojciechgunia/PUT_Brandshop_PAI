package pl.put.brandshop.order.translators;

import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.Mappings;
import pl.put.brandshop.order.entity.*;

@Mapper
public abstract class OrderToOrderDTO
{
    public OrderDTO toOrderDTO(Order order)
    {
        return toDTO(order);
    }

    @Mappings({
            @Mapping(expression = "java(translateToCustomer(order))",target = "customerDetails"),
            @Mapping(expression = "java(translateToAddress(order))",target = "address"),
            @Mapping(expression = "java(translateToDeliver(order.getDeliver()))",target = "deliver"),
            @Mapping(expression = "java(translateToDeliver(order.getPayment()))",target = "payment"),
            @Mapping(source = "client",target = "client"),
    })
    protected abstract OrderDTO toDTO(Order order);

    @Mappings({})
    protected abstract CustomerDetails translateToCustomer(Order order);

    @Mappings({})
    protected abstract Address translateToAddress(Order order);

    @Mappings({})
    protected abstract DeliverDTO translateToDeliver(Deliver deliver);

    @Mappings({})
    protected abstract PaymentDTO translateToDeliver(Payment payment);
}
