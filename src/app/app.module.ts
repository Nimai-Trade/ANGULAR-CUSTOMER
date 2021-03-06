import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { MatDatepickerModule } from '@angular/material/datepicker';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LoginComponent } from './default/login/login.component';
import { ForgotPasswordComponent } from './default/forgot-password/forgot-password.component';
import { PagenotfoundComponent } from './default/pagenotfound/pagenotfound.component';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { NgMultiSelectDropDownModule } from 'ng-multiselect-dropdown-angular7';
//import { ResetPasswordComponent } from './default/reset-password/reset-password/reset-password.component';
import { LoaderServiceService } from './services/loader/loader-service.service';
import { LoaderInterceptorService } from './services/interceptors/loader/loader-interceptor.service';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatNativeDateModule } from '@angular/material/core';
  import { MatInputModule } from '@angular/material'
import { SharedModule } from './modules/shared/shared.module';
import { CustomerCanActiveService } from './services/guards/CustomerCanActive.service';
import { BankCanActiveService } from './services/guards/BankCanActive.service';
import { UploadLcDetailsCanDeactivate } from './services/guards/UploadDetailsCanDeactivate';
import { CustomerLoginComponent } from './default/popups/customer-login/customer-login.component';
import { TermAndConditionsComponent } from './default/term-and-conditions/term-and-conditions.component';
import { ActiveTransactionComponent } from './nimai/active-transaction/active-transaction.component';
import { ResetPasswordComponent } from './default/reset-password/reset-password/reset-password.component';
import { RecaptchaModule, RecaptchaFormsModule } from 'ng-recaptcha';
import { NgxPayPalModule } from 'ngx-paypal';
import { OnlinePaymentComponent } from './nimai/online-payment/online-payment.component';
import { SortPipe } from './pipe/sort-pipe.pipe';
import { DropDownListModule, MultiSelectModule } from '@syncfusion/ej2-angular-dropdowns';

//import { SubscriptionListComponent } from './default/subscription-list/subscription-list.component';
// import { VasPlanComponent } from './nimai/vas-plan/vas-plan.component';
@NgModule({
  declarations: [
    
    AppComponent,
    LoginComponent,
    ForgotPasswordComponent,
    PagenotfoundComponent,
  //  ResetPasswordComponent,
    CustomerLoginComponent,
    //TermAndConditionsComponent,
    ActiveTransactionComponent,
    SortPipe,
  
  ],
  imports: [
    // DropDownListModule,
    // MultiSelectModule,
    BrowserModule,
    AppRoutingModule,
    ReactiveFormsModule,
    HttpClientModule,
    NgMultiSelectDropDownModule.forRoot(),
    BrowserAnimationsModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatFormFieldModule,
    MatInputModule,
    FormsModule,
    SharedModule,
    RecaptchaModule,  //this is the recaptcha main module
    RecaptchaFormsModule, //this is the module for form incase form validation
    //NgxPayPalModule,
  ],
  providers: [MatDatepickerModule,SortPipe,
    LoaderServiceService,CustomerCanActiveService,BankCanActiveService,UploadLcDetailsCanDeactivate,
    { provide: HTTP_INTERCEPTORS, useClass: LoaderInterceptorService, multi: true }
  ],
  entryComponents: [
   // TermAndConditionsComponent,
   
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
