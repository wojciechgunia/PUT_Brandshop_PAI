import { Component, OnDestroy } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { RegisterForm } from 'src/app/modules/core/models/forms.model';
import { FormService } from 'src/app/modules/core/services/form.service';
import * as AuthActions from '../../store/auth.actions';
import { AppState } from 'src/app/store/app.reducer';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { selectAuthError, selectAuthLoading } from '../../store/auth.selectors';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss'],
})
export class RegisterComponent implements OnDestroy {
  hide = true;
  error = '';

  loading$: Observable<boolean> = this.store.select(selectAuthLoading);

  errorMsg$: Observable<string | null> = this.store.select(selectAuthError);

  registerForm: FormGroup<RegisterForm> = this.formService.initRegisterForm();

  constructor(
    private formService: FormService,
    private store: Store<AppState>,
  ) {}

  ngOnDestroy(): void {
    this.store.dispatch(AuthActions.clearError());
  }

  get controls() {
    return this.registerForm.controls;
  }

  getErrorMessage(typ: string, control: FormControl): string {
    return this.formService.getErrorMessage(typ, control);
  }

  onRegister() {
    const { email, login, password, repassword } =
      this.registerForm.getRawValue();

    if (password !== repassword) {
      this.error = 'Hasła nie mogą być różne.';
      return;
    }

    this.store.dispatch(
      AuthActions.register({ registerData: { email, login, password } }),
    );
  }
}
