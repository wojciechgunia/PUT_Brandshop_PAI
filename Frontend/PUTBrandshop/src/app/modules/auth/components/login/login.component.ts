import { FormGroup } from '@angular/forms';
import { LoginForm } from './../../../core/models/forms.model';
import { FormService } from './../../../core/services/form.service';
import { Component, OnDestroy } from '@angular/core';
import * as AuthActions from '../../store/auth.actions';
import { Store } from '@ngrx/store';
import { AppState } from 'src/app/store/app.reducer';
import { Observable } from 'rxjs';
import { selectAuthError, selectAuthLoading } from '../../store/auth.selectors';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnDestroy {
  hide = true;

  loading$: Observable<boolean> = this.store.select(selectAuthLoading);

  errorMsg$: Observable<string | null> = this.store.select(selectAuthError);

  loginForm: FormGroup<LoginForm> = this.formService.initLoginForm();

  constructor(
    private formService: FormService,
    private store: Store<AppState>,
  ) {}

  ngOnDestroy(): void {
    this.store.dispatch(AuthActions.clearError());
  }

  get controls() {
    return this.loginForm.controls;
  }

  getErrorMessage(typ: string): string {
    if (typ == 'login') {
      return 'Niepoprawny login';
    } else {
      return 'Niepoprawne hasło';
    }
  }

  onLogin() {
    this.store.dispatch(
      AuthActions.login({ loginData: this.loginForm.getRawValue() }),
    );
  }
}
