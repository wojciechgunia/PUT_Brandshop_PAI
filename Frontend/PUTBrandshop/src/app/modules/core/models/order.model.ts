import { Address } from './address.model';
import { BasketProduct } from './basket.model';
import { Customer } from './customer.model';
import { GetDelivery, PostDelivery } from './delivery.model';
import { GetPayment, PostPayment } from './payment.model';

export interface GetOrderResponse {
  uuid: string;
  orders: string;
  status: string;
  client: string;
  customerDetails: Customer;
  address: Address;
  deliver: GetDelivery;
  payment: GetPayment;
  items: BasketProduct[];
  summaryPrice: number;
}

export type GetOrdersResponse = Omit<
  GetOrderResponse,
  'items' | 'summaryPrice'
>;

export interface PostOrder {
  customerDetails: Customer;
  address: Address;
  deliver: PostDelivery;
  payment: PostPayment;
}

export interface PostOrderResponse {
  status: {
    statusCode: string;
  };
  redirectUri: string;
  orderId: string;
  extOrderId: string;
}

export interface GetOrderAdminResponse {
  orders: GetOrderResponse[];
  totalCount: number;
}

export interface OrderResponse {
  timestamp: string;
  message: string;
  code: string;
}
