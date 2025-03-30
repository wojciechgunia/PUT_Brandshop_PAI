package pl.put.brandshop.order.service;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import pl.put.brandshop.order.entity.DeliverDTO;
import pl.put.brandshop.order.entity.PaymentDTO;
import pl.put.brandshop.order.repository.DeliverRepository;
import pl.put.brandshop.order.repository.PaymentRepository;
import pl.put.brandshop.order.translators.DeliverToDeliverDTO;
import pl.put.brandshop.order.translators.PaymentToPaymentDTO;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class PaymentService
{
    private final PaymentRepository paymentRepository;
    private final PaymentToPaymentDTO paymentToPaymentDTO;

    public List<PaymentDTO> getAllPayment()
    {
        return paymentRepository.findAll().stream().map(paymentToPaymentDTO::toPaymentDTO).collect(Collectors.toList());
    }
}
