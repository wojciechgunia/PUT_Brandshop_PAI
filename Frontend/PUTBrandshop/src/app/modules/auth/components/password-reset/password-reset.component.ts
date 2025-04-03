import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';
import { NotifierService } from 'angular-notifier';
import { ResetForm } from 'src/app/modules/core/models/forms.model';
import { AuthService } from 'src/app/modules/core/services/auth.service';
import { FormService } from 'src/app/modules/core/services/form.service';

@Component({
  selector: 'app-password-reset',
  templateUrl: './password-reset.component.html',
  styleUrls: ['./password-reset.component.scss'],
})
export class PasswordResetComponent implements OnInit {
  hide = true;

  resetForm: FormGroup<ResetForm> = this.formService.initResetForm();

  uid = '';
  error = '';
  loading = false;

  constructor(
    private formService: FormService,
    private route: ActivatedRoute,
    private authService: AuthService,
    private notifierService: NotifierService,
    private router: Router,
  ) {}

  ngOnInit(): void {
    this.route.paramMap.subscribe({
      next: (param: ParamMap) => {
        this.uid = param.get('uid') as string;
      },
    });
  }

  get controls() {
    return this.resetForm.controls;
  }

  getErrorMessage(control: FormControl): string {
    return this.formService.getErrorMessage('password', control);
  }

  onPasswdReset() {
    this.loading = true;
    const { password } = this.resetForm.getRawValue();
    this.authService.changePassword({ password, uid: this.uid }).subscribe({
      next: () => {
        this.router.navigate(['/logowanie']);
        this.notifierService.notify('success', 'Pomyślnie zmieniono hasło!');
      },
      error: () => {
        this.loading = false;
        this.error = 'Podany token jest już nieaktywny. Spróbuj ponownie';
      },
    });
  }
}
