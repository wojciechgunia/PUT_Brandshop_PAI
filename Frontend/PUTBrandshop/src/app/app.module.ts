import { BrowserModule } from '@angular/platform-browser';

import { CoreModule } from './modules/core/core.module';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { CommonModule } from '@angular/common';
import localePL from '@angular/common/locales/pl';
import { registerLocaleData } from '@angular/common';
import { NgModule } from '@angular/core';

registerLocaleData(localePL);
@NgModule({
  declarations: [AppComponent],
  imports: [
    CommonModule,
    BrowserModule,
    AppRoutingModule,
    CoreModule,
  ],
  providers: [{ provide: LOCALE_ID, useValue: 'pl' }],
  bootstrap: [AppComponent],
})
export class AppModule {}
