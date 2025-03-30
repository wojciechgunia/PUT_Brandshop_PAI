package pl.put.brandshop.order.service;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import pl.put.brandshop.order.entity.DeliverDTO;
import pl.put.brandshop.order.repository.DeliverRepository;
import pl.put.brandshop.order.translators.DeliverToDeliverDTO;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class DeliverService
{
    private final DeliverRepository deliverRepository;
    private final DeliverToDeliverDTO deliverToDeliverDTO;

    public List<DeliverDTO> getAllDeliver()
    {
        return deliverRepository.findAll().stream().map(deliverToDeliverDTO::toDeliverDTO).collect(Collectors.toList());
    }
}
