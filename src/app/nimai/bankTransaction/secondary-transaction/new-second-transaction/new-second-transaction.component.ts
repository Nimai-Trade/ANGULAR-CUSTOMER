import { Component, OnInit, EventEmitter, Output,ElementRef, ViewChild, Input } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { DataServiceService } from 'src/app/services/upload-lc/data-service.service';
import * as $ from '../../../../../assets/js/jquery.min';
import { LcDetail } from 'src/app/beans/LCDetails';
import { UploadLcService } from 'src/app/services/upload-lc/upload-lc.service';
import { formatDate } from '@angular/common';
import { NavigationExtras, Router, ActivatedRoute } from '@angular/router';
import { TitleService } from 'src/app/services/titleservice/title.service';
import  { ValidateRegex } from '../../../../beans/Validations';
import { call } from 'src/assets/js/bootstrap-filestyle.min'
import { loads } from 'src/assets/js/commons'
import { LoginService } from 'src/app/services/login/login.service';
import { ApplicantBenficiarySecondaryComponent } from './applicant-benficiary-secondary/applicant-benficiary-secondary.component';
import * as FileSaver from 'file-saver';
import { PricingGuidanceComponent } from './pricing-guidance/pricing-guidance.component';
import { ProductDetailsComponent } from './product-details/product-details.component';
import { SubscriptionDetailsService } from 'src/app/services/subscription/subscription-details.service';
import { environment } from 'src/environments/environment';
import { PersonalDetailsService } from 'src/app/services/personal-details/personal-details.service';
import { MatSelect } from '@angular/material';

@Component({
  selector: 'app-new-second-transaction',
  templateUrl: './new-second-transaction.component.html',
  styleUrls: ['./new-second-transaction.component.css']
})
export class NewSecondTransactionComponent implements OnInit {
  @ViewChild(ApplicantBenficiarySecondaryComponent, { static: true }) ApplicantBeneficiary: ApplicantBenficiarySecondaryComponent;
  @ViewChild(PricingGuidanceComponent, { static: true }) Others: PricingGuidanceComponent;
  @ViewChild(ProductDetailsComponent, { static: true }) tenor: ProductDetailsComponent;
  @ViewChild('sample', { static: true }) sample: MatSelect;
  @Input() public LcDetail:FormGroup;

  // maps the appropriate column to fields property
  public fields: Object = { text: 'Game', value: 'Id' };
  // set the height of the popup element
  public height: string = '220px';
  // set the placeholder to DropDownList input element
  public waterMark: string = 'Select a game';
  // set the value to select an item based on mapped value at initial rendering
  public value: string = 'Game3';
 countryName: any;
 public hasValue=false;
 public isValidAppEmail=false;
 public isValidBeneEmail=false;
 submitted: boolean;
 disableRadiobtn: boolean=true;
 nimaiCount: any;
 errorMsg: string;
 public subsidiaries: any;
 parentID: string;
 userid: string;
 youAre: any;
 subID: any;
 parentID1: string;
 countryData: any = [];
 dataSource :any=[];
 selectedDay: any;
 applicantName: any;
 beneName: any;
 selectedcountry: any=[];
 
  public lcDetailForm: FormGroup
  public selector: string = "Confirmation";
  public title: string = "New Transaction";
  public refinancing: boolean = false;
  public bankGuarantee:boolean=false;
  public counter = 1;
  public saveCount = 0;
  public isPrev: boolean = false;
  public isNext: boolean = true;
  public isSave: boolean = false;
  public isPreview: boolean = false;
  public previewShow: boolean = false;
  public isEdit: boolean = false;
  public isConfirm: boolean = false;
  public loading: boolean = false;
  public date: string = formatDate(new Date(), "yyyy-MM-dd'T'HH:mm:ss.SSSZ", 'en-US');

  public lcDetail: LcDetail = null;
  public lc: any = [];
  public transactionID: string = null;
  public subURL: string = "";
  public parentURL: string = "";
  showUpdateButton: boolean = false;
  isUpdate: boolean = false;
  draftData: any;
  cloneData: any;
  document: any;
  selectInfo: any;
  notImgDownload: boolean=false;
  imgDownload: boolean=false;
  fileData: any;
  currencies: any;
  portOfDischarge: any;
  goodsArray: any;
  isBankOther: boolean=false;
  othersStr: any="";
  currentDateTime: string;
  goodsList: any="";
  trnxFailedMsg: any="";
  accountType: string;
  otherType: boolean;
  goodsType: boolean;
  negotiationDate: boolean;
  lastShipmentDate: boolean;
   lCIssuingDate: boolean;
  lCCurrency: boolean;
  lCValue: boolean;
  lCIssuanceCountry: boolean;
  swiftCode: boolean;
  lCIssuanceBranch: boolean;
  lCIssuanceBank: boolean;
  count: number=0;
  trnxMsg: string;
  validityDate: any;
  tradeSupport: string;
  isRejected: boolean=false;
  invalidDate: any;
  invalidMsg: string;
  isDownloadORview: string;
  isExpired: boolean=false;
  isBgOther: boolean=false;
  status: string="";
  creditCounts: number;
  subUserID: string="";
  countSub: number=0;
  subdata: any;
  portOfLoading: any;


  // rds: refinance Data Service
  constructor(public psd: PersonalDetailsService,public getCount: SubscriptionDetailsService,public activatedRoute: ActivatedRoute, public fb: FormBuilder,public loginService: LoginService, public router: Router, public rds: DataServiceService, public titleService: TitleService, public upls: UploadLcService,private el: ElementRef) {

    this.lcDetailForm = this.fb.group({
      selector: ['Confirmation'],
       userId: sessionStorage.getItem('userID'),
     // userId: [''],
      secTransactionType: [''],
      applicantCountry:[''],
      applicantName:[''],
      beneCountry:[''],
      beneName:[''],
      lCIssuanceBank: [''],
      lCIssuanceBranch: [''],
      swiftCode: [''],
      lCIssuanceCountry: [''],
      lCValue: [''],
      lCCurrency: [''],
      goodsType:[''],
      otherType:[''],
      validity:[''],
      minParticipationAmt:[''],
      isESGComplaint:[''],
      retentionAmt:[''],
      loadingCountry:[''],
      loadingPort:[''],
      dischargeCountry:[''],
      dischargePort:[''],
      applicableLaw:[''],
      requirementType: [''],
      commissionScheme:[''],     
      lcMaturityDate:[''],
      lCIssuingDate: [''], 
      benchmark:[''],
      otherCondition:[''],
      
      
      

      usanceDays:[''],
      branchUserEmail: [''],
      
      
      
      lastShipmentDate: [''],
      
      bgExpiryDate:[''],
      claimExpiryDate:[''],
      negotiationDate: [''],
     
      bgType:[],
      otherBGType:[],
      // For Confirmation 
      confirmationPeriod: [''],
      paymentTerms: [''],
      startDate:[''],
      // tenorEndDate: [''],
      tenorFile: [''],
      // For Discounting 
      discountingPeriod:[''],
      remarks:[''],
    
      //For Refinancing
      originalTenorDays:[''],
      refinancingPeriod:[''],
      
      lcNumber:[''],
      lastBeneBank:[''],
      lastBeneSwiftCode:[''],
      lastBankCountry:[''],  
      
      //applicantName:sessionStorage.getItem('companyName'),
      //applicantCountry:sessionStorage.getItem('registeredCountry'),
       // beneName:sessionStorage.getItem('companyName'),
      beneBankCountry:[''],
      beneBankName:[''],
      beneSwiftCode:[''],
    //  beneCountry:sessionStorage.getItem('registeredCountry'),     
     
      chargesType: [''],
     
      lcProForma:[''],
      ended:[''],
      lCExpiryDate:[''],    
      
      insertedDate:this.date,
      insertedBy:sessionStorage.getItem('userID'),
      modifiedDate:this.date,
      modifiedBy:sessionStorage.getItem('userID'),
      transactionflag:[''],
      transactionStatus:[''],
      userType:[''],
      applicantContactPerson:[''],
      applicantContactPersonEmail:[''],
      beneContactPerson:[''],
      beneContactPersonEmail:['',[Validators.required,Validators.email]]    })

  //  this.goodsService();

    this.titleService.changeTitle(this.title);

    this.activatedRoute.parent.url.subscribe((urlPath) => {
      this.parentURL = urlPath[urlPath.length - 1].path;
    });
    this.activatedRoute.parent.parent.url.subscribe((urlPath) => {
      this.subURL = urlPath[urlPath.length - 1].path;
    })

    let navigation = this.router.getCurrentNavigation();
    if(navigation.extras.state){
      if(navigation.extras.state.redirectedFrom == "draftTransaction"){
        var trnsactionID = navigation.extras.state.trnsactionID;
        // this.callDraftTransaction(trnsactionID);
      }
      else if(navigation.extras.state.redirectedFrom == "cloneTransaction"){
        var trnsactionID = navigation.extras.state.trnsactionID;
        // this.callCloneTransaction(trnsactionID);
      }
    }

  
   // this.lc = this.lcDetailForm.value;    
  }

  ngOnInit() {

    this.countryName = JSON.parse(sessionStorage.getItem('countryData'));
    this.currencies = JSON.parse(sessionStorage.getItem('currencyData'));
    this.goodsService();
    const lcd = this;
    $(document).ready(function () {
      const anchor: any[] = $('.nav-tabs').find('a');
      lcd.saveCount = anchor.length;

    })
    call();
   
}
onItemChange(e,beneCP,beneCPEmail,appCP,appCPEmail,applicantName,beneName){
  this.applicantName=applicantName;
  this.beneName=beneName;
 this.youAre=e;
  this.LcDetail.get('beneContactPerson').setValue(beneCP); 
  this.LcDetail.get('beneContactPersonEmail').setValue(beneCPEmail);
  this.LcDetail.get('applicantContactPerson').setValue(appCP); 
  this.LcDetail.get('applicantContactPersonEmail').setValue(appCPEmail);
  var radioValue = $("input[name='userType']:checked").val();
  this.LcDetail.get('userType').setValue(e);

  if (e == "Beneficiary") {
     $('#divApplicant').hide();
     $('#divBene').show();
     this.LcDetail.get('applicantName').setValue('');
     this.LcDetail.get('applicantCountry').setValue('');
     this.LcDetail.get('beneName').setValue(sessionStorage.getItem('companyName'));
     this.LcDetail.get('beneCountry').setValue(sessionStorage.getItem('registeredCountry'));
     let elements = document.getElementsByTagName('input');
     for (var i = 0; i < elements.length; i++) {
       if(elements[i].value)
       elements[i].classList.add('has-value')
     }
    // this.selectSubsidiaries(null,e);

  }
  else if (e == "Applicant") {
     $('#divApplicant').show();
     $('#divBene').hide();
     this.LcDetail.get('applicantName').setValue(sessionStorage.getItem('companyName'));
     this.LcDetail.get('applicantCountry').setValue(sessionStorage.getItem('registeredCountry'));
     this.LcDetail.get('beneName').setValue('');
     this.LcDetail.get('beneCountry').setValue('');
     this.hasValue=true;
  }
  else{
    this.LcDetail.get('applicantName').setValue('');
    this.LcDetail.get('applicantCountry').setValue('');
    this.LcDetail.get('beneName').setValue('');
    this.LcDetail.get('beneCountry').setValue('');
  }

}
goodsService() {
  this.loginService.getGoodsData().
    subscribe(
      (response) => {
        this.goodsArray = JSON.parse(JSON.stringify(response));
        this.goodsList = this.goodsArray.filter(item => item.productCategory !== 'None');
      },
      (error) => {}
    )
}
selectSubsidiaries(clone){
  console.log(clone)
clone=this.youAre;

if(this.LcDetail.get('applicantName').value){
debugger
  this.subsidiaries.forEach(element => {
    if(element.subCompany==this.LcDetail.get('applicantName').value){
      this.LcDetail.get('applicantCountry').setValue(element.country);
       sessionStorage.setItem('subUserID',element.subUserId);
    }
    
  });
}
else{

this.subsidiaries.forEach(element => {
  if(element.subCompany==this.LcDetail.get('beneName').value){
    this.LcDetail.get('beneCountry').setValue(element.country);
     sessionStorage.setItem('subUserID',element.subUserId);
  }
  
});
}


}
onKeyUpBeneEmail(event){    
  var emailPattern = /[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{1,63}$/;
  if(!emailPattern.test(event.target.value))
  {
    this.isValidBeneEmail=true;
  }​else{
    this.isValidBeneEmail=false;
  }
}
onKeyUpAppEmail(event){    
  var emailPattern = /[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{1,63}$/;
  if(!emailPattern.test(event.target.value))
  {
    this.isValidAppEmail=true;
  }​else{
    this.isValidAppEmail=false;
  }
}

validateRegexFields(event, type){
  if(type == "number"){
    ValidateRegex.validateNumber(event);
  }
  else if(type == "alpha"){
    ValidateRegex.alphaOnly(event);
  }
  else if(type == "alphaNum"){
    ValidateRegex.alphaNumeric(event);
  }else if(type == "alphaNumericNoSpace"){
    ValidateRegex.alphaNumericNoSpace(event);
  }
  else if(type=="namewithspace"){
    var key = event.keyCode;
    if (!((key >= 65 && key <= 90) || key == 8/*backspce*/ || key==46/*DEL*/ || key==9/*TAB*/ || key==37/*LFT ARROW*/ || key==39/*RGT ARROW*/ || key==222/* ' key*/ || key==189/* - key*/ || key==32/* space key*/ || (event.shiftKey && key === 55) || key===190 /* . key*/)) {
        event.preventDefault();
    }    
  }
}

getSubsidiaryData(){
  const data = {
    "userId": sessionStorage.getItem('userID'),
  }
  this.psd.subUserListForNewTxn(data).
    subscribe(
      (response) => {
        this.subsidiaries = JSON.parse(JSON.stringify(response)).list;    
        this.selectedcountry=this.subsidiaries;
       
        this.countryData.push('All');
        for (let entry of this.subsidiaries) {
          this.countryData.push(entry.subCompany);
        }
        console.log(this.countryData)


if(this.youAre=='Applicant'){
this.subsidiaries.forEach(element => {

  if(element.subCompany==this.applicantName){
    this.LcDetail.get('applicantCountry').setValue(element.country);
     sessionStorage.setItem('subUserID',element.subUserId);
  } 
});
}
else if(this.youAre=='Beneficiary'){
this.subsidiaries.forEach(element => {   
 if (element.subCompany==this.beneName){
    this.LcDetail.get('beneCountry').setValue(element.country);
     sessionStorage.setItem('subUserID',element.subUserId);
  }
  
});
}
              },
      (error) => {}
    )
}
onKey(value) { 
  console.log(value)
  this.selectedcountry = this.search(value);
  this.selectSubsidiaries(value)
   }
   search(value: string) { 
     let filter = value.toLowerCase();
     return this.subsidiaries.filter(option => option.subCompany.toLowerCase().startsWith(filter));
   }
 

   public next() {  
    console.log(this.counter)

   if(this.lcDetailForm.get('beneContactPersonEmail').value){
     var emailPattern = /[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{1,63}$/;
   if(!emailPattern.test(this.lcDetailForm.get('beneContactPersonEmail').value))
   {
     this.errorMsg=" Email ID is Invalid. "
       $('#validateMsg').show();  
       return
   }
   }
   let elements = document.getElementsByTagName('input');
   for (var i = 0; i < elements.length; i++) {
     if(elements[i].value)
     elements[i].classList.add('has-value')
   }
   let elementTextarea = document.getElementsByTagName('textarea');
   for (var i = 0; i < elementTextarea.length; i++) {
     if(elementTextarea[i].value)
     elementTextarea[i].classList.add('has-value')
   }
   let elementSelect = document.getElementsByTagName('select');
   for (var i = 0; i < elementSelect.length; i++) {
     if(elementSelect[i].value)
     elementSelect[i].classList.add('has-value')
   }
  
   this.previewShow = false;
   this.titleService.loading.next(true);

   const anchor: any[] = $('.nav-tabs').find('a');

   for (let index = 0; index < anchor.length; index++) {


     if (index == this.counter && $(anchor[index]).attr('href') === '#tab_default_' + (this.counter + 1)) {
       $(anchor[index]).attr('aria-expanded', 'true');
       $(anchor[index]).parent().addClass('active')

       const tabpanes: any[] = $('.tab-content').find('.tab-pane')
       for (let i = 0; i < tabpanes.length; i++) {
         if ($(tabpanes[i]).attr('id') === 'tab_default_' + (this.counter + 1)) {
           $(tabpanes[i]).addClass('active');
         } else {
           $(tabpanes[i]).removeClass('active');
         }

       }
     } else {
       $(anchor[index]).attr('aria-expanded', 'false');
       $(anchor[index]).parent().removeClass('active')
     }


   }
   this.counter++;
   debugger
   if (this.saveCount == this.counter) {
     this.isPrev = true;
     this.isNext = false;
     this.isSave = false;
     if(this.isUpdate){
       this.showUpdateButton = true;
       this.isPreview = false;
     }
     else{
       this.showUpdateButton = false;
       this.isPreview = true;
     }
   } else {
     this.isPrev = true;
   }
   this.titleService.loading.next(false);


 }

 public prev() {
   this.previewShow = false;
   this.titleService.loading.next(true);
   const anchor: any[] = $('.nav-tabs').find('a');
   this.counter--;

   for (let index = 0; index < anchor.length; index++) {

     if (index == (this.counter - 1) && $(anchor[index]).attr('href') === '#tab_default_' + (this.counter)) {
       $(anchor[index]).attr('aria-expanded', 'true');
       $(anchor[index]).parent().addClass('active');

       const tabpanes: any[] = $('.tab-content').find('.tab-pane')
       for (let i = 0; i < tabpanes.length; i++) {
         if ($(tabpanes[i]).attr('id') === 'tab_default_' + (this.counter)) {
           $(tabpanes[i]).addClass('active');
         } else {
           $(tabpanes[i]).removeClass('active');
         }

       }
     } else {
       $(anchor[index]).attr('aria-expanded', 'false');
       $(anchor[index]).parent().removeClass('active')
     }

   }

   if (this.counter == 1) {
     this.isPrev = false;
     this.isNext = true;
     this.isSave = false;
     this.isPreview = false;
     this.showUpdateButton = false;

   } else {  
     this.isPrev = true;
     this.isNext = true;
     this.isSave = false;
     this.isPreview = false;
     this.showUpdateButton = false;
   }
   this.titleService.loading.next(false);
 }

 portDischargeOnchange(event:any){
  var data;
  if(this.lcDetailForm.get('dischargeCountry').value==""){
     data={
      "countryName":event
      
    } 
  }else{
     data={
      "countryName":this.lcDetailForm.get('dischargeCountry').value
    } 
  }
    
    this.upls.getPortByCountry(data).subscribe(
      (response) => {
        this.portOfDischarge = JSON.parse(JSON.stringify(response)).data;
      });
      
}
portLoadingOnchange(event:any){
var data;
if(this.lcDetailForm.get('loadingCountry').value==""){
 data={
  "countryName":event
} 
}else{
 data={
  "countryName":this.lcDetailForm.get('loadingCountry').value
} 
}     
    this.upls.getPortByCountry(data).subscribe(
      (response) => {
        this.portOfLoading = JSON.parse(JSON.stringify(response)).data;
      });
}

preview(){

  this.lcDetailForm.get('requirementType').setValue(this.lcDetailForm.get('selector').value)
  this.upls.saveLc(this.lcDetailForm.value)
  .subscribe(
    (response) => {
      this.transactionID = JSON.parse(JSON.stringify(response)).data;
      this.loading = false;
      this.lc = this.lcDetailForm.value;
      this.previewShow = true;
      this.isPrev = false;
      this.isNext = false;
      this.isSave = false;
      this.isPreview = false;
      this.showUpdateButton = false;
      this.isEdit = true;
      this.isConfirm = true;
      this.titleService.loading.next(false);    })
}


public checkCount() {
  this.titleService.loading.next(true);
   this.loading = true;
   let body = {
     transactionId: this.transactionID,
     userId:  sessionStorage.getItem('userID')
   }
this.upls.confirmLc(body).subscribe(
        
  (response) => {
    this.status="active-secondary-transaction";
                
                  var errmsg = JSON.parse(JSON.stringify(response)).errMessage;
                  if(errmsg){
                    this.loading = false;
                    this.titleService.loading.next(false);
                    this.trnxFailedMsg=errmsg;
                    $('#trnxFailed').show();
                  
                  }
                  else{
                    // this.setForm();
                    this.edit();

 const navigationExtras: NavigationExtras = {
            state: {
              title: 'Transaction Successful',
              message: 'Your LC Transaction has been successfully placed. Keep checking the Active Transaction section for the quotes received.',
              parent: this.subURL+"/"+this.parentURL + "/"+this.status
            }
          };
          this.router.navigate([`/${this.subURL}/${this.parentURL}/new-secondary-transaction/success`], navigationExtras)
            .then(success => console.log('navigation success?', success))
            .catch(console.error);
          this.isUpdate = false;
        }

  })
}
public edit() {
  this.isUpdate = true;
  this.isEdit = false;
  this.isConfirm = false;
  this.previewShow = false;
  this.counter = 0;

  const anchor: any[] = $('.nav-tabs').find('a');

  for (let index = 0; index < anchor.length; index++) {


    if (index == this.counter && $(anchor[index]).attr('href') === '#tab_default_' + (this.counter + 1)) {
      $(anchor[index]).attr('aria-expanded', 'true');
      $(anchor[index]).parent().addClass('active')

      const tabpanes: any[] = $('.tab-content').find('.tab-pane')
      for (let i = 0; i < tabpanes.length; i++) {
        if ($(tabpanes[i]).attr('id') === 'tab_default_' + (this.counter + 1)) {
          $(tabpanes[i]).addClass('active');
        } else {
          $(tabpanes[i]).removeClass('active');
        }

      }
    } else {
      $(anchor[index]).attr('aria-expanded', 'false');
      $(anchor[index]).parent().removeClass('active')
    }


  }
  this.counter++;


  this.isNext = true;
  this.isSave = false;
  this.isPreview = false;

  this.isPrev = false;

// this.Others.isESGComplaint(this.lcDetailForm.get('isESGComplaint').value)

}

}