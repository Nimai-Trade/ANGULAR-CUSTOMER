import { Component, OnInit, ViewChild } from '@angular/core';
import { UploadLcService } from 'src/app/services/upload-lc/upload-lc.service';
import { NavigationExtras, ActivatedRoute, Router } from '@angular/router';
import { ConfirmationComponent } from '../newTransaction/quotes/confirmation/confirmation.component';
import { RefinancingComponent } from '../newTransaction/quotes/refinancing/refinancing.component';
import { ConfirmAndDiscountComponent } from '../newTransaction/quotes/confirm-and-discount/confirm-and-discount.component';
import { DiscountingComponent } from '../newTransaction/quotes/discounting/discounting.component';
import { BankerComponent } from '../newTransaction/quotes/banker/banker.component';
import { TitleService } from 'src/app/services/titleservice/title.service';
import {bankActiveTransaction,bankNewTransaction} from 'src/assets/js/commons'
import { Tflag } from 'src/app/beans/Tflag';
import { NewTransactionService } from 'src/app/services/banktransactions/new-transaction.service';
import * as $ from '../../../../assets/js/jquery.min';
import { BankGuaranteeComponent } from '../newTransaction/quotes/bank-guarantee/bank-guarantee.component';

@Component({
  selector: 'app-draft-transaction',
  templateUrl: './draft-transaction.component.html',
  styleUrls: ['./draft-transaction.component.css']
})
export class DraftTransactionComponent implements OnInit {
  
  noData: boolean = false;
  draftData: any;
  public parentURL: string = "";
  public checkExpAcp:string = "";

  public subURL: string = "";

  @ViewChild(ConfirmationComponent, { static: true }) confirmation: ConfirmationComponent;
  @ViewChild(DiscountingComponent, { static: false }) discounting: DiscountingComponent;
  @ViewChild(ConfirmAndDiscountComponent, { static: false }) confirmAndDiscount: ConfirmAndDiscountComponent;
  @ViewChild(RefinancingComponent, { static: false }) refinancing: RefinancingComponent;
  @ViewChild(BankerComponent, { static: false }) banker: BankerComponent;
  @ViewChild(BankGuaranteeComponent,{static:false}) bankGuarantee: BankGuaranteeComponent;
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
    this.confirmAndDiscount.isActiveQuote = false;
    this.discounting.isActiveQuote = false;
    this.refinancing.isActiveQuote = false;
    this.banker.isActiveQuote = false;
    
  }

  callAllDraftTransaction(){
    const param = {
    "bankUserId":sessionStorage.getItem('userID')
    }
    
   this.service.getBankDraftQuotation(param).subscribe(
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
     
    if (pagename == 'confirmation' || pagename === 'Confirmation') {
      this.confirmation.action(true, action, data);
      this.discounting.isActiveQuote = false;
      this.confirmAndDiscount.isActiveQuote = false;
      this.refinancing.isActiveQuote = false;
      this.banker.isActiveQuote = false;
    } else if (pagename == 'BankGuarantee' ) {
      this.bankGuarantee.action(true, action, data);
      this.discounting.isActiveQuote = false;
      this.confirmAndDiscount.isActiveQuote = false;
      this.refinancing.isActiveQuote = false;
      this.banker.isActiveQuote = false;
      this.confirmation.isActiveQuote=false;
    }else if (pagename === 'discounting' || pagename === 'Discounting') {
      this.confirmation.isActiveQuote = false;
      this.confirmAndDiscount.isActiveQuote = false;
      this.refinancing.isActiveQuote = false;
      this.banker.isActiveQuote = false;
      this.discounting.action(true, action, data);
    } else if (pagename === 'confirmAndDiscount' || pagename === 'ConfirmAndDiscount' || pagename === 'Confirmation and Discounting') {
      this.confirmAndDiscount.action(true, action, data);
      this.confirmation.isActiveQuote = false;
      this.discounting.isActiveQuote = false;
      this.refinancing.isActiveQuote = false;
      this.banker.isActiveQuote = false;
    } else if (pagename === 'Refinancing' || pagename === 'Refinance' || pagename === 'refinance') {
      this.refinancing.action(true, action, data);
      this.confirmation.isActiveQuote = false;
      this.discounting.isActiveQuote = false;
      this.confirmAndDiscount.isActiveQuote = false;
      this.banker.isActiveQuote = false;
    } else if (pagename === 'banker' || pagename === "Banker" || pagename === 'Banker’s Acceptance') {
      this.confirmation.isActiveQuote = false;
      this.discounting.isActiveQuote = false;
      this.confirmAndDiscount.isActiveQuote = false;
      this.refinancing.isActiveQuote = false;
      this.banker.action(true, action, data);
    }
  }
  
  if(this.checkExpAcp=="Failure"){
    $("#discardQuote").show(); 
    
    }
  });
}


cancelDiscard(){
  $("#discardQuote").hide(); 
}
  deleteDraft(){
    // if(data){
    //   var req = {
    //     "quotationId": data.quotationId
    //     }
    // }else{
      
      var req = {
        "quotationId": this.quotation_id
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
      this.router.navigate([`/${this.subURL}/${this.parentURL}/draft-transaction`]);
  });
  }

}
