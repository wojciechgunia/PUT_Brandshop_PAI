import { AuthService } from './../../../core/services/auth.service';
import { Component } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { NotifierService } from 'angular-notifier';
import { RecoveryForm } from 'src/app/modules/core/models/forms.model';
import { FormService } from 'src/app/modules/core/services/form.service';

@Component({
  selector: 'app-password-recovery',
  templateUrl: './password-recovery.component.html',
  styleUrls: ['./password-recovery.component.scss'],
})
export class PasswordRecoveryComponent {
  recoveryForm: FormGroup<RecoveryForm> = this.formService.initRecoveryForm();

  constructor(
    private formService: FormService,
    private authService: AuthService,
    private notifierService: NotifierService,
    private router: Router,
  ) {}

  errorMsg: string | null = null;

  loading = false;

  get controls() {
    return this.recoveryForm.controls;
  }

  getErrorMessage(control: FormControl): string {
    return this.formService.getErrorMessage('email', control);
  }

  onPasswdRecovery() {
    this.loading = true;
    this.authService.resetPassword(this.recoveryForm.getRawValue()).subscribe({
      next: () => {
        this.notifierService.notify(
          'success',
          'Wiadomość z linkiem do odzyskiwania hasła została wysłana na wskazany adres e-mail.',
        );
        this.router.navigate(['/logowanie']);
      },
      error: (err) => {
        this.loading = false;
        this.errorMsg = err;
      },
    });
  }
}
