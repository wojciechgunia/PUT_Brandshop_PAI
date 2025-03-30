package pl.put.brandshop.order.translators;

import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.Mappings;
import pl.put.brandshop.order.entity.*;

@Mapper
public abstract class OrderDTOToOrder
{
    public Order toOrder(OrderDTO orderDTO)
    {
        return toOrder2(orderDTO);
    }

    @Mappings({
            @Mapping(expression = "java(orderDTO.getCustomerDetails().getFirstName())",target = "firstName"),
            @Mapping(expression = "java(orderDTO.getCustomerDetails().getLastName())",target = "lastName"),
            @Mapping(expression = "java(orderDTO.getCustomerDetails().getEmail())",target = "email"),
            @Mapping(expression = "java(orderDTO.getCustomerDetails().getPhone())",target = "phone"),
            @Mapping(expression = "java(orderDTO.getAddress().getCity())",target = "city"),
            @Mapping(expression = "java(orderDTO.getAddress().getNumber())",target = "number"),
            @Mapping(expression = "java(orderDTO.getAddress().getStreet())",target = "street"),
            @Mapping(expression = "java(orderDTO.getAddress().getPostCode())",target = "postCode"),
            @Mapping(expression = "java(translate(orderDTO.getDeliver()))",target = "deliver"),
            @Mapping(expression = "java(translate(orderDTO.getPayment()))",target = "payment"),
    })
    protected abstract Order toOrder2(OrderDTO orderDTO);

    @Mappings({})
    protected abstract Deliver translate(DeliverDTO deliverDTO);

    @Mappings({})
    protected abstract Payment translate(PaymentDTO paymentDTO);
}
