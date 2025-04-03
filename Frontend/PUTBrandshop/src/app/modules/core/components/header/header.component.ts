import { BasketService } from './../../services/basket.service';
import { Category } from './../../models/categories.model';
import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { AppState } from 'src/app/store/app.reducer';
import * as AuthActions from '../../../auth/store/auth.actions';
import { BehaviorSubject, Observable } from 'rxjs';
import { User } from '../../models/auth.model';
import { selectAuthUser } from 'src/app/modules/auth/store/auth.selectors';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent {
  constructor(
    private store: Store<AppState>,
    private basketService: BasketService
  ) {}

  user$: Observable<User | null> = this.store.select(selectAuthUser);

  basketTotalCount$: BehaviorSubject<number> = this.basketService.totalCount$;

  logout() {
    this.store.dispatch(AuthActions.logout());
  }

  isAdmin(user: User) {
    if (user.role === 'ADMIN') {
      return true;
    }
    return false;
  }
}
