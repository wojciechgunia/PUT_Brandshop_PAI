import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { StoreModule } from '@ngrx/store';
import { CoreModule } from './modules/core/core.module';
import { EffectsModule } from '@ngrx/effects';
import { AuthModule } from './modules/auth/auth.module';
import { authReducer } from './modules/auth/store/auth.reducer';
import { NotifierModule, NotifierOptions } from 'angular-notifier';
import { AuthEffects } from './modules/auth/store/auth.effects';
import localePL from '@angular/common/locales/pl';
import { registerLocaleData } from '@angular/common';
import { LOCALE_ID, NgModule } from '@angular/core';

const customNotifier: NotifierOptions = {
  position: {
    horizontal: {
      position: 'right',
      distance: 12,
    },
    vertical: {
      position: 'top',
      distance: 130,
      gap: 10,
    },
  },
  theme: 'material',
};

registerLocaleData(localePL);
@NgModule({
  declarations: [AppComponent],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    StoreModule.forRoot({ auth: authReducer }),
    CoreModule,
    AuthModule,
    EffectsModule.forRoot([AuthEffects]),
    NotifierModule.withConfig(customNotifier),
  ],
  providers: [{ provide: LOCALE_ID, useValue: 'pl' }],
  bootstrap: [AppComponent],
})
export class AppModule {}
