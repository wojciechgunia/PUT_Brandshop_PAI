import { NgModule } from '@angular/core';
import { BasketRoutingModule } from './basket-routing.module';
import { BasketComponent } from './components/basket/basket.component';
import { BasketProductComponent } from './components/basket-product/basket-product.component';
import { SharedModule } from '../shared/shared.module';

@NgModule({
  declarations: [BasketComponent, BasketProductComponent],
  imports: [SharedModule, BasketRoutingModule],
})
export class BasketModule {}
