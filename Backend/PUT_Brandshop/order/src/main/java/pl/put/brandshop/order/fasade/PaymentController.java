package pl.put.brandshop.order.fasade;

import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;
import pl.put.brandshop.order.entity.DeliverDTO;
import pl.put.brandshop.order.entity.PaymentDTO;
import pl.put.brandshop.order.service.DeliverService;
import pl.put.brandshop.order.service.PaymentService;

import java.util.List;


@RestController
@RequestMapping(value = "/api/v1/payment")
@RequiredArgsConstructor
public class PaymentController
{

    private final PaymentService paymentService;

    @RequestMapping(method = RequestMethod.GET)
    public List<PaymentDTO> getPayment()
    {
        return paymentService.getAllPayment();
    }
}
