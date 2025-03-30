package pl.put.brandshop.order.translators;

import org.mapstruct.Mapper;
import org.mapstruct.Mappings;
import pl.put.brandshop.order.entity.Deliver;
import pl.put.brandshop.order.entity.DeliverDTO;
import pl.put.brandshop.order.entity.Payment;
import pl.put.brandshop.order.entity.PaymentDTO;

@Mapper
public abstract class PaymentToPaymentDTO
{
    public PaymentDTO toPaymentDTO(Payment payment)
    {
        return toDTO(payment);
    }

    @Mappings({})
    protected abstract PaymentDTO toDTO(Payment payment);
}
