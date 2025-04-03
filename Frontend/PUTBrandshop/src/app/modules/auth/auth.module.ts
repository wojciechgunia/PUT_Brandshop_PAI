import { NgModule } from '@angular/core';
import { AuthRoutingModule } from './auth-routing.module';
import { LoginComponent } from './components/login/login.component';
import { RegisterComponent } from './components/register/register.component';
import { SharedModule } from '../shared/shared.module';
import { RouterLink } from '@angular/router';
import { AccountActivationComponent } from './components/account-activation/account-activation.component';
import { PasswordRecoveryComponent } from './components/password-recovery/password-recovery.component';
import { PasswordResetComponent } from './components/password-reset/password-reset.component';

@NgModule({
  declarations: [
    LoginComponent,
    RegisterComponent,
    AccountActivationComponent,
    PasswordRecoveryComponent,
    PasswordResetComponent,
  ],
  imports: [SharedModule, AuthRoutingModule, RouterLink],
  exports: [LoginComponent, RegisterComponent],
})
export class AuthModule {}
