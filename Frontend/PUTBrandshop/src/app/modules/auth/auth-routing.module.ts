import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './components/login/login.component';
import { RegisterComponent } from './components/register/register.component';
import { AccountActivationComponent } from './components/account-activation/account-activation.component';
import { PasswordRecoveryComponent } from './components/password-recovery/password-recovery.component';
import { PasswordResetComponent } from './components/password-reset/password-reset.component';
import { UnauthGuard } from '../core/guards/unauth.guard';

const routes: Routes = [
  { path: 'logowanie', component: LoginComponent, canActivate: [UnauthGuard] },
  {
    path: 'rejestracja',
    component: RegisterComponent,
    canActivate: [UnauthGuard],
  },
  {
    path: 'aktywuj/:uid',
    component: AccountActivationComponent,
    canActivate: [UnauthGuard],
  },
  {
    path: 'odzyskaj-haslo',
    component: PasswordRecoveryComponent,
    canActivate: [UnauthGuard],
  },
  {
    path: 'odzyskaj-haslo/:uid',
    component: PasswordResetComponent,
    canActivate: [UnauthGuard],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AuthRoutingModule {}
