import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { ActivatedRoute } from '@angular/router';
import { NotifierService } from 'angular-notifier';
import { switchMap } from 'rxjs';
import { PostBasketBody } from 'src/app/modules/core/models/basket.model';
import { Product } from 'src/app/modules/core/models/product.model';
import { BasketService } from 'src/app/modules/core/services/basket.service';
import { ProductsService } from 'src/app/modules/core/services/products.service';

@Component({
  selector: 'app-product-details',
  templateUrl: './product-details.component.html',
  styleUrls: ['./product-details.component.scss'],
})
export class ProductDetailsComponent implements OnInit {
  constructor(
    private route: ActivatedRoute,
    private productsService: ProductsService,
    private sanitizer: DomSanitizer,
    private basketService: BasketService,
    private notifierService: NotifierService,
  ) {}

  quantityControl = new FormControl(1);
  product: Product | null = null;
  parameters: { [key: string]: string } | null = null;
  htmlContent: null | SafeHtml = null;

  ngOnInit(): void {
    this.route.paramMap
      .pipe(
        switchMap((paramMap) => {
          const [name, date] = (paramMap.get('id') as string).split('-');
          return this.productsService.getProduct(name, date);
        }),
      )
      .subscribe({
        next: (product) => {
          this.product = { ...product };
          this.htmlContent = this.sanitizer.bypassSecurityTrustHtml(
            product.descHtml,
          );
          try {
            this.parameters = JSON.parse(product.parameters);
          } catch (e) {
            this.parameters = null;
          }
        },
      });
  }

  addToBasket() {
    const body: PostBasketBody = {
      product: this.product!.uid,
      quantity: Number(this.quantityControl.value),
    };
    this.basketService.addProductToBasket(body).subscribe({
      next: () => {
        this.notifierService.notify(
          'success',
          'Poprawnie dodano produkt do koszyka',
        );
      },
      error: () => {
        this.notifierService.notify(
          'warning',
          'Dodanie produktu nie powiodło się',
        );
      },
    });
  }
}
