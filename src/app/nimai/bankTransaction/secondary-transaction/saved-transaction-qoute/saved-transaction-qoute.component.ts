import { Component, OnInit, ViewChild } from '@angular/core';
import { UploadLcService } from 'src/app/services/upload-lc/upload-lc.service';
import { NavigationExtras, ActivatedRoute, Router } from '@angular/router';

import { TitleService } from 'src/app/services/titleservice/title.service';
import {bankActiveTransaction,bankNewTransaction} from 'src/assets/js/commons'
import { Tflag } from 'src/app/beans/Tflag';
import { NewTransactionService } from 'src/app/services/banktransactions/new-transaction.service';
import * as $ from '../../../../../assets/js/jquery.min';
import { ConfirmationQuotesComponent } from '../product-quote-type/confirmation-quotes/confirmation-quotes.component';
import { DiscountingQuotesComponent } from '../product-quote-type/discounting-quotes/discounting-quotes.component';
import { ConfirmDiscountQuotesComponent } from '../product-quote-type/confirm-discount-quotes/confirm-discount-quotes.component';
import { RefinancingQuotesComponent } from '../product-quote-type/refinancing-quotes/refinancing-quotes.component';
import { BankerQuotesComponent } from '../product-quote-type/banker-quotes/banker-quotes.component';
import { BankGuaranteeQuotesComponent } from '../product-quote-type/bank-guarantee-quotes/bank-guarantee-quotes.component';



@Component({
  selector: 'app-saved-transaction-qoute',
  templateUrl: './saved-transaction-qoute.component.html',
  styleUrls: ['./saved-transaction-qoute.component.css']
})
export class SavedTransactionQouteComponent implements OnInit {

  noData: boolean = false;
  draftData: any;
  public parentURL: string = "";
  public checkExpAcp:string = "";

  public subURL: string = "";
  @ViewChild(ConfirmationQuotesComponent, { static: true }) confirmation: ConfirmationQuotesComponent;
  @ViewChild(DiscountingQuotesComponent, { static: false }) discounting: DiscountingQuotesComponent;
  @ViewChild(ConfirmDiscountQuotesComponent, { static: false }) confirmAndDiscount: ConfirmDiscountQuotesComponent;
  @ViewChild(RefinancingQuotesComponent, { static: false }) refinancing: RefinancingQuotesComponent;
  @ViewChild(BankerQuotesComponent, { static: false }) banker: BankerQuotesComponent;
  @ViewChild(BankGuaranteeQuotesComponent, { static: false }) bankGuarantee: BankGuaranteeQuotesComponent;
  public whoIsActive: string = "";
  public hasNoRecord: boolean = false;
  quotation_id: any;
  constructor(public service: UploadLcService,public titleService: TitleService,public router: Router,
     public nts: NewTransactionService, public activatedRoute: ActivatedRoute) {
    this.activatedRoute.parent.url.subscribe((urlPath) => {
      this.parentURL = urlPath[urlPath.length - 1].path;
    });
    this.activatedRoute.parent.parent.url.subscribe((urlPath) => {
      this.subURL = urlPath[urlPath.length - 1].path;
    });
    this.titleService.quote.next(false);
 
  }
  
  ngOnInit() {
   console.log('test')
  }

  ngAfterViewInit() {
    this.callAllDraftTransaction();
    this.confirmation.isActiveQuote = false;
    // this.confirmAndDiscount.isActiveQuote = false;
    // this.discounting.isActiveQuote = false;
    // this.refinancing.isActiveQuote = false;
    // this.banker.isActiveQuote = false;
    
  }

  callAllDraftTransaction(){
    const param = {
    "bankUserId":sessionStorage.getItem('userID')
    }
    
   this.service.getSecondaryDraftQuotationByBankUserId(param).subscribe(
      (response) => {
        this.draftData = JSON.parse(JSON.stringify(response)).data;
        bankNewTransaction();
        if(!this.draftData){
          this.noData = true;
        }
     
      },(error) =>{
        this.noData = true;
      }
      )
  }



  editDraft(pagename: string,action:Tflag,data:any) {
    this.titleService.quote.next(true);
    this.whoIsActive = pagename;
 this.quotation_id=data.quotationId;
   const param= {
      "userId":data.userId,
      "transactionId":data.transactionId,
      }
    
    this.service.checkAcceptedExpiredTransaction(param).subscribe(
      (response) => {
        this.checkExpAcp = JSON.parse(JSON.stringify(response)).status;

      
        if(this.checkExpAcp =="Success"){
          this.confirmation.action(true, action, data);
    // if (pagename == 'confirmation' || pagename === 'Confirmation') {
    //   this.confirmation.action(true, action, data);
    //   this.discounting.isActiveQuote = false;
    //   this.confirmAndDiscount.isActiveQuote = false;
    //   this.refinancing.isActiveQuote = false;
    //   this.banker.isActiveQuote = false;
    // } else if (pagename == 'BankGuarantee' ) {
    //   this.bankGuarantee.action(true, action, data);
    //   this.discounting.isActiveQuote = false;
    //   this.confirmAndDiscount.isActiveQuote = false;
    //   this.refinancing.isActiveQuote = false;
    //   this.banker.isActiveQuote = false;
    //   this.confirmation.isActiveQuote=false;
    // }else if (pagename === 'discounting' || pagename === 'Discounting') {
    //   this.confirmation.isActiveQuote = false;
    //   this.confirmAndDiscount.isActiveQuote = false;
    //   this.refinancing.isActiveQuote = false;
    //   this.banker.isActiveQuote = false;
    //   this.discounting.action(true, action, data);
    // } else if (pagename === 'confirmAndDiscount' || pagename === 'ConfirmAndDiscount' || pagename === 'Confirmation and Discounting') {
    //   this.confirmAndDiscount.action(true, action, data);
    //   this.confirmation.isActiveQuote = false;
    //   this.discounting.isActiveQuote = false;
    //   this.refinancing.isActiveQuote = false;
    //   this.banker.isActiveQuote = false;
    // } else if (pagename === 'Refinancing' || pagename === 'Refinance' || pagename === 'refinance') {
    //   this.refinancing.action(true, action, data);
    //   this.confirmation.isActiveQuote = false;
    //   this.discounting.isActiveQuote = false;
    //   this.confirmAndDiscount.isActiveQuote = false;
    //   this.banker.isActiveQuote = false;
    // } else if (pagename === 'banker' || pagename === "Banker" || pagename === 'Banker’s Acceptance') {
    //   this.confirmation.isActiveQuote = false;
    //   this.discounting.isActiveQuote = false;
    //   this.confirmAndDiscount.isActiveQuote = false;
    //   this.refinancing.isActiveQuote = false;
    //   this.banker.action(true, action, data);
    // }
  }
  
  if(this.checkExpAcp=="Failure"){
    $("#discardQuote").show(); 
    
    }
  });
}


cancelDiscard(){
  $("#discardQuote").hide(); 
}
  deleteDraft(quotation_id){
    // if(data){
    //   var req = {
    //     "quotationId": data.quotationId
    //     }
    // }else{
      
      var req = {
        "quotationId": quotation_id
        }
   // }
   
    this.service.deleteDraftQuotationByQuotationId(req).subscribe(
      (response) => {
        debugger
        const index = this.draftData.indexOf(this.quotation_id);
        this.draftData.splice(index, 1);
        $("#discardQuote").hide(); 
        this.refreshPage();

      },(error) =>{
      }
      )

  }

  refreshPage(){
    this.router.navigateByUrl('/', {skipLocationChange: true}).then(() => {
      this.router.navigate([`/${this.subURL}/${this.parentURL}/saved-transaction-qoute`]);
  });
  }

}
