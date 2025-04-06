import { Component, Input, Output } from '@angular/core';
import { BasketProduct } from 'src/app/modules/core/models/basket.model';

@Component({
  selector: 'app-order-product',
  templateUrl: './order-product.component.html',
  styleUrls: ['./order-product.component.scss'],
})
export class OrderProductComponent {
  @Input() basketProduct!: BasketProduct;
}
