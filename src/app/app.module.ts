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
import { SavedTransactionComponent } from './nimai/bankTransaction/secondary-transaction/saved-transaction/saved-transaction.component';
import { ActiveSecondTransactionComponent } from './nimai/bankTransaction/secondary-transaction/active-second-transaction/active-second-transaction.component';
import { NewSecondTransactionComponent } from './nimai/bankTransaction/secondary-transaction/new-second-transaction/new-second-transaction.component';
import { SecondTransactionDetailsComponent } from './nimai/bankTransaction/secondary-transaction/second-transaction-details/second-transaction-details.component';
import { ApplicantBenficiarySecondaryComponent } from './nimai/bankTransaction/secondary-transaction/new-second-transaction/applicant-benficiary-secondary/applicant-benficiary-secondary.component';
import { ProductDetailsComponent } from './nimai/bankTransaction/secondary-transaction/new-second-transaction/product-details/product-details.component';
import { PricingGuidanceComponent } from './nimai/bankTransaction/secondary-transaction/new-second-transaction/pricing-guidance/pricing-guidance.component';
import { RefinancingPlacementComponent } from './nimai/bankTransaction/secondary-transaction/product-type/refinancing-placement/refinancing-placement.component';
import { DiscountingPlacementComponent } from './nimai/bankTransaction/secondary-transaction/product-type/discounting-placement/discounting-placement.component';
import { BankGuaranteePlacementComponent } from './nimai/bankTransaction/secondary-transaction/product-type/bank-guarantee-placement/bank-guarantee-placement.component';
import { BankerPlacementComponent } from './nimai/bankTransaction/secondary-transaction/product-type/banker-placement/banker-placement.component';
import { ConfirmDiscountPlacementComponent } from './nimai/bankTransaction/secondary-transaction/product-type/confirm-discount-placement/confirm-discount-placement.component';
import { ConfirmationPlacementComponent } from './nimai/bankTransaction/secondary-transaction/product-type/confirmation-placement/confirmation-placement.component';
import { ConfirmDiscountQuotesComponent } from './nimai/bankTransaction/secondary-transaction/product-quote-type/confirm-discount-quotes/confirm-discount-quotes.component';
import { ConfirmationQuotesComponent } from './nimai/bankTransaction/secondary-transaction/product-quote-type/confirmation-quotes/confirmation-quotes.component';
import { BankerQuotesComponent } from './nimai/bankTransaction/secondary-transaction/product-quote-type/banker-quotes/banker-quotes.component';
import { BankGuaranteeQuotesComponent } from './nimai/bankTransaction/secondary-transaction/product-quote-type/bank-guarantee-quotes/bank-guarantee-quotes.component';
import { DiscountingQuotesComponent } from './nimai/bankTransaction/secondary-transaction/product-quote-type/discounting-quotes/discounting-quotes.component';
import { RefinancingQuotesComponent } from './nimai/bankTransaction/secondary-transaction/product-quote-type/refinancing-quotes/refinancing-quotes.component';
import { NewTransactionQouteComponent } from './nimai/bankTransaction/secondary-transaction/new-transaction-qoute/new-transaction-qoute.component';
import { ActiveTransactionQouteComponent } from './nimai/bankTransaction/secondary-transaction/active-transaction-qoute/active-transaction-qoute.component';
import { TransactionDetailQouteComponent } from './nimai/bankTransaction/secondary-transaction/transaction-detail-qoute/transaction-detail-qoute.component';
import { SavedTransactionQouteComponent } from './nimai/bankTransaction/secondary-transaction/saved-transaction-qoute/saved-transaction-qoute.component';

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
   // ApplicantBenficiarySecondaryComponent,
    ProductDetailsComponent,
    PricingGuidanceComponent,
    // ConfirmDiscountQuotesComponent,
    // ConfirmationQuotesComponent,
    // BankerQuotesComponent,
    // BankGuaranteeQuotesComponent,
    // DiscountingQuotesComponent,
    // RefinancingQuotesComponent,
   // NewTransactionQouteComponent,
    // ActiveTransactionQouteComponent,
    // TransactionDetailQouteComponent,
    // SavedTransactionQouteComponent,
    // RefinancingPlacementComponent,
    // DiscountingPlacementComponent,
    // BankGuaranteePlacementComponent,
    // BankerPlacementComponent,
    // ConfirmDiscountPlacementComponent,
    // ConfirmationPlacementComponent,
  
    // SavedTransactionComponent,
    // ActiveSecondTransactionComponent,
    // NewSecondTransactionComponent,
    // SecondTransactionDetailsComponent,
  
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
