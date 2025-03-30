package pl.put.brandshop.order.translators;

import org.mapstruct.Mapper;
import org.mapstruct.Mappings;
import pl.put.brandshop.order.entity.Deliver;
import pl.put.brandshop.order.entity.DeliverDTO;

@Mapper
public abstract class DeliverToDeliverDTO
{
    public DeliverDTO toDeliverDTO(Deliver deliver)
    {
        return toDTO(deliver);
    }

    @Mappings({})
    protected abstract DeliverDTO toDTO(Deliver deliver);
}
