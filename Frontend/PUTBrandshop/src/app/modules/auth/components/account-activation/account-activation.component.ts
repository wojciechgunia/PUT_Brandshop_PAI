import { NotifierService } from 'angular-notifier';
import { AuthService } from './../../../core/services/auth.service';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';
import { switchMap } from 'rxjs';
import { AuthResponse } from 'src/app/modules/core/models/auth.model';

@Component({
  selector: 'app-account-activation',
  templateUrl: './account-activation.component.html',
  styleUrls: ['./account-activation.component.scss'],
})
export class AccountActivationComponent implements OnInit {
  constructor(
    private route: ActivatedRoute,
    private authService: AuthService,
    private notifierService: NotifierService,
    private router: Router,
  ) {}

  errorMsg: string | null = null;
  ngOnInit(): void {
    // this.route.paramMap.subscribe({
    //   next: (param: ParamMap) => {
    //     console.log(param.get('uid'));
    //   },
    // });

    this.route.paramMap
      .pipe(
        switchMap((params) =>
          this.authService.activateAccount(params.get('uid') as string),
        ),
      )
      .subscribe({
        next: (response: AuthResponse) => {
          this.router.navigate(['/logowanie']);
          this.notifierService.notify(
            'success',
            'Konto zostało pomyślnie aktywowane!',
          );
        },
        error: (err) => {
          this.errorMsg = err;
        },
      });
  }
}
