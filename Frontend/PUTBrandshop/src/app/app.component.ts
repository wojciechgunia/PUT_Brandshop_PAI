import { Component } from '@angular/core';
import { BasketService } from './modules/core/services/basket.service';
import { AppState } from './store/app.reducer';
import { Store } from '@ngrx/store';
import { NotifierService } from 'angular-notifier';
import * as AuthActions from './modules/auth/store/auth.actions';
import { OverlayContainer } from '@angular/cdk/overlay';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  title = 'PUTBrandshop';

  constructor(
    private notifierService: NotifierService,
    private store: Store<AppState>,
    private basketService: BasketService,
    private overlay: OverlayContainer
  ) {}

  ngOnInit(): void {
    this.store.dispatch(AuthActions.autoLogin());
    this.basketService.getBasketProducts().subscribe({
      error: () => {
        //
      },
    });
  }
}
