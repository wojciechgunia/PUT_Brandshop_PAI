package pl.put.brandshop.order.service;

import pl.put.brandshop.order.entity.*;
import pl.put.brandshop.order.entity.notify.Notify;
import pl.put.brandshop.order.exceptions.EmptyBasketException;
import pl.put.brandshop.order.exceptions.OrderDontExistException;
import pl.put.brandshop.order.exceptions.UknowDeliveryTypException;
import pl.put.brandshop.order.exceptions.UknowPaymentTypException;
import pl.put.brandshop.order.repository.DeliverRepository;
import pl.put.brandshop.order.repository.OrderRepository;
import pl.put.brandshop.order.repository.PaymentRepository;
import pl.put.brandshop.order.translators.BasketItemDTOToOrderItems;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;
import java.util.UUID;
import java.util.concurrent.atomic.AtomicReference;

@Service
@RequiredArgsConstructor
public class OrderService
{
    private final DeliverRepository deliverRepository;
    private final PaymentRepository paymentRepository;
    private final OrderRepository orderRepository;
    private final BasketService basketService;
    private final ItemService itemService;
    private final PayuService payuService;
    private final BasketItemDTOToOrderItems basketItemDTOToOrderItems;
    private final EmailService emailService;
    private final AuthService authService;

    @Value("${payu.use}")
    private boolean payu_use;

    @Transactional
    public String createOrder(Order order, HttpServletRequest request, HttpServletResponse response)
    {
        List<Cookie> cookies = Arrays.stream(request.getCookies()).filter(value->
                value.getName().equals("Authorization") || value.getName().equals("Refresh"))
                .toList();
        UserRegisterDTO userRegisterDTO = authService.getUserDetails(cookies);
        if(userRegisterDTO != null)
        {
            order.setClient(userRegisterDTO.getLogin());
        }

        Order finalOrder = save(order);
        AtomicReference<String> result = new AtomicReference<>();
        Arrays.stream(request.getCookies()).filter(cookie -> cookie.getName().equals("Basket")).findFirst().ifPresentOrElse(value -> {
            ListBasketItemDTO basket = basketService.getBasket(value);
            if (basket.getBasketProducts().isEmpty()) throw new EmptyBasketException();
            List<OrderItems> items = new ArrayList<>();
            basket.getBasketProducts().forEach(item -> {
                OrderItems orderItems = basketItemDTOToOrderItems.toOrderItems(item);
                orderItems.setOrder(finalOrder);
                orderItems.setUuid(UUID.randomUUID().toString());
                items.add(itemService.save(orderItems));
                basketService.removeBasket(value,item.getUuid());
            });
            if(payu_use && finalOrder.getPayment().getUuid().equals("PAYU"))
            {
                result.set(payuService.createOrder(finalOrder, items));
            }
            else if (finalOrder.getPayment().getUuid().equals("ODBIOR"))
            {
                result.set("{\"status\": {\n" +
                        "    \"statusCode\": \"SUCCESS\"\n" +
                        "  },\n" +
                        "  \"redirectUri\": \"http://localhost:4200\",\n" +
                        "  \"orderId\": \"null\",\n" +
                        "  \"extOrderId\": \"null\"}");
            }
            value.setMaxAge(0);
            response.addCookie(value);
            emailService.sendOrder(order.getEmail(),order.getUuid());
        }, () -> {
            throw new RuntimeException();
        });

        return result.get();
    }

    private Order save(Order order)
    {
        Deliver deliver = deliverRepository.findByUuid(order.getDeliver().getUuid()).orElseThrow(UknowDeliveryTypException::new);
        Payment payment = paymentRepository.findByUuid(order.getPayment().getUuid()).orElseThrow(UknowPaymentTypException::new);
        StringBuilder stringBuilder = new StringBuilder("ORDER/")
                .append(orderRepository.count())
                .append("/")
                .append(LocalDate.now().getMonthValue())
                .append("/")
                .append(LocalDate.now().getYear());

        order.setUuid(UUID.randomUUID().toString());
        order.setStatus(Status.PENDING);
        order.setOrders(stringBuilder.toString());
        order.setDeliver(deliver);
        order.setPayment(payment);
        return orderRepository.saveAndFlush(order);
    }

    public void completeOrder(Notify notify) throws OrderDontExistException
    {
        orderRepository.findOrderByOrders(notify.getOrder().getExtOrderId()).ifPresentOrElse(value->{
            value.setStatus(Status.PAID);
            orderRepository.save(value);
        },()-> {
            throw new OrderDontExistException();
        });
    }

    public List<Order> getOrdersByClient(String login)
    {
        return orderRepository.findOrderByClient(login);
    }

    public Order getOrdersByUuid(String uuid)
    {
        return orderRepository.findOrderByUuid(uuid).orElseThrow(OrderDontExistException::new);
    }

    public List<Order> getOrders()
    {
        return orderRepository.findAll();
    }

    public void setStatus(Status statuscode, String uuid)
    {
        Order order = this.getOrdersByUuid(uuid);
        order.setStatus(statuscode);
        orderRepository.save(order);
    }
}
