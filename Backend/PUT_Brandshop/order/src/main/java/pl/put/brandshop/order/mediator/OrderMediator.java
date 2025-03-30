package pl.put.brandshop.order.mediator;

import pl.put.brandshop.order.entity.*;
import pl.put.brandshop.order.entity.notify.Notify;
import pl.put.brandshop.order.exceptions.BadSignatureException;
import pl.put.brandshop.order.exceptions.OrderDontExistException;
import pl.put.brandshop.order.exceptions.UserDontLoginException;
import pl.put.brandshop.order.service.*;
import pl.put.brandshop.order.translators.OrderDTOToOrder;
import pl.put.brandshop.order.translators.OrderItemsToItems;
import pl.put.brandshop.order.translators.OrderToOrderDTO;
import com.fasterxml.jackson.core.JsonProcessingException;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.coffeecode.entity.Response;
import org.springframework.http.HttpHeaders;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Component;

import java.security.NoSuchAlgorithmException;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;
import java.util.concurrent.atomic.AtomicReference;

@Component
@RequiredArgsConstructor
public class OrderMediator
{
    private final OrderDTOToOrder orderDTOToOrder;
    private final OrderToOrderDTO orderToOrderDTO;
    private final OrderItemsToItems orderItemsToItems;
    private final OrderService orderService;
    private final SignatureValidator signatureValidator;
    private final AuthService authService;
    private final ItemService itemService;
    private final ProductService productService;


    public ResponseEntity<?> createOrder(OrderDTO orderDTO, HttpServletRequest request, HttpServletResponse response)
    {
        Order order = orderDTOToOrder.toOrder(orderDTO);
        HttpHeaders headers = new HttpHeaders();
        headers.add(HttpHeaders.CONTENT_TYPE,"application/json");
        return ResponseEntity.status(200).headers(headers).body(orderService.createOrder(order,request,response));
    }

    public ResponseEntity<Response> handleNotify(Notify notify, HttpServletRequest request)
    {
        String header = request.getHeader("OpenPayu-Signature");
        try
        {
            signatureValidator.validate(header,notify);
            orderService.completeOrder(notify);
        }
        catch (NoSuchAlgorithmException | JsonProcessingException | BadSignatureException e)
        {
            return ResponseEntity.badRequest().body(new Response("Bad signature"));
        }
        catch (OrderDontExistException e)
        {
            return ResponseEntity.badRequest().body(new Response("Order don't exist"));
        }
        return ResponseEntity.ok(new Response("Notification handle success"));
    }

    public ResponseEntity<?> getOrder(String uuid, HttpServletRequest request)
    {
        if (uuid == null || uuid.isEmpty())
        {
            try
            {
                List<Cookie> cookies = Arrays.stream(request.getCookies()).filter(value ->
                        value.getName().equals("Authorization") || value.getName().equals("Refresh")).toList();
                UserRegisterDTO user = authService.getUserDetails(cookies);
                if (user != null)
                {
                    List<OrderDTO> orderDTOList = new ArrayList<>();
                    orderService.getOrdersByClient(user.getLogin()).forEach(value ->
                    {
                        orderDTOList.add(orderToOrderDTO.toOrderDTO(value));
                    });
                    return ResponseEntity.ok(orderDTOList);
                }
                throw new OrderDontExistException();
            }
            catch (NullPointerException e)
            {
                throw new UserDontLoginException();
            }
        }
        Order order = orderService.getOrdersByUuid(uuid);
        List<OrderItems> itemsList = itemService.getByOrder(order);
        if(itemsList.isEmpty()) throw new OrderDontExistException();
        List<Items> itemsDTO = new ArrayList<>();
        AtomicReference<Double> summary = new AtomicReference<>(0d);
        itemsList.forEach(value -> {
            Items items = orderItemsToItems.toItems(value);
            items.setImageUrl(productService.getProduct(value.getProduct()).getImageUrls()[0]);
            itemsDTO.add(items);
            summary.set(summary.get()+value.getPriceSummary());
        });
        OrderDTO orderDTO = orderToOrderDTO.toOrderDTO(order);
        summary.set(summary.get() + orderDTO.getDeliver().getPrice());
        orderDTO.setSummaryPrice(summary.get());
        orderDTO.setItems(itemsDTO);
        return ResponseEntity.ok(orderDTO);
    }

    public ResponseEntity<?> getOrders(String uuid)
    {
        if (uuid == null || uuid.isEmpty())
        {
            List<OrderDTO> orderDTOList = new ArrayList<>();
            orderService.getOrders().forEach(value ->
            {
                orderDTOList.add(orderToOrderDTO.toOrderDTO(value));
            });
            return ResponseEntity.ok(orderDTOList);
        }
        Order order = orderService.getOrdersByUuid(uuid);
        List<OrderItems> itemsList = itemService.getByOrder(order);
        if(itemsList.isEmpty()) throw new OrderDontExistException();
        List<Items> itemsDTO = new ArrayList<>();
        AtomicReference<Double> summary = new AtomicReference<>(0d);
        itemsList.forEach(value -> {
            Items items = orderItemsToItems.toItems(value);
            items.setImageUrl(productService.getProduct(value.getProduct()).getImageUrls()[0]);
            itemsDTO.add(items);
            summary.set(summary.get()+value.getPriceSummary());
        });
        OrderDTO orderDTO = orderToOrderDTO.toOrderDTO(order);
        summary.set(summary.get() + orderDTO.getDeliver().getPrice());
        orderDTO.setSummaryPrice(summary.get());
        orderDTO.setItems(itemsDTO);
        return ResponseEntity.ok(orderDTO);
    }

    public ResponseEntity<?> setStatus(String uuid, String status)
    {
        if (uuid!=null && !uuid.isEmpty() && status!=null && !status.isEmpty())
        {
            try {
                Status statuscode = Status.valueOf(status);
                this.orderService.setStatus(statuscode,uuid);
                return ResponseEntity.ok().body(new Response("Successful status set"));
            } catch (IllegalArgumentException e) {
                return ResponseEntity.badRequest().body(new Response("Bad status code"));
            }
        }
        return ResponseEntity.badRequest().body(new Response("Bad request"));
    }

    public ResponseEntity<?> getAdminOrders(String uuid, int page, int limit)
    {
        if (uuid == null || uuid.isEmpty())
        {
            List<OrderDTO> orderDTOList = new ArrayList<>();
            orderService.getOrders().forEach(value ->
            {
                List<OrderItems> itemsList = itemService.getByOrder(value);
                if(itemsList.isEmpty()) throw new OrderDontExistException();
                List<Items> itemsDTO = new ArrayList<>();
                AtomicReference<Double> summary = new AtomicReference<>(0d);
                itemsList.forEach(value2 -> {
                    Items items = orderItemsToItems.toItems(value2);
                    items.setImageUrl(productService.getProduct(value2.getProduct()).getImageUrls()[0]);
                    itemsDTO.add(items);
                    summary.set(summary.get()+value2.getPriceSummary());
                });
                OrderDTO orderDTO = orderToOrderDTO.toOrderDTO(value);
                summary.set(summary.get() + orderDTO.getDeliver().getPrice());
                orderDTO.setSummaryPrice(summary.get());
                orderDTO.setItems(itemsDTO);
                orderDTOList.add(orderDTO);
            });
            return ResponseEntity.ok(orderDTOList);
        }
        Order order = orderService.getOrdersByUuid(uuid);
        List<OrderItems> itemsList = itemService.getByOrder(order);
        if(itemsList.isEmpty()) throw new OrderDontExistException();
        List<Items> itemsDTO = new ArrayList<>();
        AtomicReference<Double> summary = new AtomicReference<>(0d);
        itemsList.forEach(value -> {
            Items items = orderItemsToItems.toItems(value);
            items.setImageUrl(productService.getProduct(value.getProduct()).getImageUrls()[0]);
            itemsDTO.add(items);
            summary.set(summary.get()+value.getPriceSummary());
        });
        OrderDTO orderDTO = orderToOrderDTO.toOrderDTO(order);
        summary.set(summary.get() + orderDTO.getDeliver().getPrice());
        orderDTO.setSummaryPrice(summary.get());
        orderDTO.setItems(itemsDTO);
        return ResponseEntity.ok(orderDTO);
    }
}
