package pl.put.brandshop.order.entity.notify;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import pl.put.brandshop.order.entity.Status;

import java.util.List;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class Order
{
    private String orderId;
    private String extOrderId;
    private String orderCreateDate;
    private String notifyUrl;
    private String customerIp;
    private String merchantPostId;
    private String description;
    private String totalAmount;
    private Buyer buyer;
    private PayMethod payMethod;
    private List<Product> products;
    private Status status;

}
