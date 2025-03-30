package pl.put.brandshop.order.fasade;

import pl.put.brandshop.order.entity.OrderDTO;
import pl.put.brandshop.order.entity.notify.Notify;
import pl.put.brandshop.order.exceptions.*;
import pl.put.brandshop.order.mediator.OrderMediator;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.coffeecode.entity.Response;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping(value = "/api/v1/order")
@RequiredArgsConstructor
public class OrderController
{
    private final OrderMediator orderMediator;

    @RequestMapping(method = RequestMethod.POST)
    public ResponseEntity<?> createOrder(@RequestBody OrderDTO order, HttpServletResponse response, HttpServletRequest request)
    {
        return orderMediator.createOrder(order, request, response);
    }

    @RequestMapping(method = RequestMethod.POST, value = "/notification")
    public ResponseEntity<Response> notifyOrder(@RequestBody Notify notify, HttpServletRequest request)
    {
        return orderMediator.handleNotify(notify, request);
    }

    @RequestMapping(method = RequestMethod.GET)
    public ResponseEntity<?> get(@RequestParam(required = false) String uuid, HttpServletRequest request)
    {
        return orderMediator.getOrder(uuid, request);
    }

    @RequestMapping(method = RequestMethod.GET, value = "/order-list")
    public ResponseEntity<?> getAll(@RequestParam(required = false) String uuid,@RequestParam(required = false,defaultValue = "1") int _page,
    @RequestParam(required = false,defaultValue = "10") int _limit)
    {
        return orderMediator.getAdminOrders(uuid,_page,_limit);
    }

    @RequestMapping(method = RequestMethod.PATCH, value = "/status-set")
    public ResponseEntity<?> setStatus(@RequestParam String uuid,@RequestParam String status)
    {
        return orderMediator.setStatus(uuid, status);
    }

    @ResponseStatus(HttpStatus.BAD_REQUEST)
    @ExceptionHandler(BasketDontExistException.class)
    public Response handleValidationExceptions(BasketDontExistException ex)
    {
        return new Response("Basket don't exist");
    }

    @ResponseStatus(HttpStatus.BAD_REQUEST)
    @ExceptionHandler(EmptyBasketException.class)
    public Response handleValidationExceptions(EmptyBasketException ex)
    {
        return new Response("Basket is empty");
    }

    @ResponseStatus(HttpStatus.BAD_REQUEST)
    @ExceptionHandler(PayUException.class)
    public Response handleValidationExceptions(PayUException ex)
    {
        return new Response("PayU service error, please try later");
    }

    @ResponseStatus(HttpStatus.BAD_REQUEST)
    @ExceptionHandler(UknowDeliveryTypException.class)
    public Response handleValidationExceptions(UknowDeliveryTypException ex)
    {
        return new Response("Delivery type don't exist");
    }

    @ResponseStatus(HttpStatus.BAD_REQUEST)
    @ExceptionHandler(UserDontLoginException.class)
    public Response handleValidationExceptions(UserDontLoginException ex)
    {
        return new Response("User is not logged in");
    }
}
