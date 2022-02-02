import { Component, OnInit, EventEmitter, Output,ElementRef, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { DataServiceService } from 'src/app/services/upload-lc/data-service.service';
import * as $ from '../../../../assets/js/jquery.min';
import { LcDetail } from 'src/app/beans/LCDetails';
import { UploadLcService } from 'src/app/services/upload-lc/upload-lc.service';
import { formatDate } from '@angular/common';
import { NavigationExtras, Router, ActivatedRoute } from '@angular/router';
import { TitleService } from 'src/app/services/titleservice/title.service';
import  { ValidateRegex } from '../../../beans/Validations';
import { call } from 'src/assets/js/bootstrap-filestyle.min'
import { loads } from 'src/assets/js/commons'
import { LoginService } from 'src/app/services/login/login.service';
import { ApplicantBeneficiaryComponent } from './applicant-beneficiary/applicant-beneficiary.component';
import * as FileSaver from 'file-saver';
import { OthersComponent } from './others/others.component';
import { TenorPaymentComponent } from './tenor-payment/tenor-payment.component';
import { SubscriptionDetailsService } from 'src/app/services/subscription/subscription-details.service';
import { environment } from 'src/environments/environment';



@Component({
  selector: 'app-upload-lc',
  templateUrl: './upload-lc.component.html',
  styleUrls: ['./upload-lc.component.css']
})
export class UploadLCComponent implements OnInit {
  @ViewChild(ApplicantBeneficiaryComponent, { static: true }) ApplicantBeneficiary: ApplicantBeneficiaryComponent;
  @ViewChild(OthersComponent, { static: true }) Others: OthersComponent;
  @ViewChild(TenorPaymentComponent, { static: true }) tenor: TenorPaymentComponent;

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
  public lc: any = null;
  public transactionID: string = null;
  public subURL: string = "";
  public parentURL: string = "";
  showUpdateButton: boolean = false;
  isUpdate: boolean = false;
  draftData: any;
  cloneData: any;
  document: any;
  countryName: any[];
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
  submitted: boolean=false;
  goodsList: any="";
  trnxFailedMsg: any="";
  accountType: string;
  nimaiCount: any;
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


  // rds: refinance Data Service
  constructor(public getCount: SubscriptionDetailsService,public activatedRoute: ActivatedRoute, public fb: FormBuilder,public loginService: LoginService, public router: Router, public rds: DataServiceService, public titleService: TitleService, public upls: UploadLcService,private el: ElementRef) {


    this.goodsService();

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
        this.callDraftTransaction(trnsactionID);
      }
      else if(navigation.extras.state.redirectedFrom == "cloneTransaction"){
        var trnsactionID = navigation.extras.state.trnsactionID;
        this.callCloneTransaction(trnsactionID);
      }
    }

    this.setForm();
    this.lc = this.lcDetailForm.value;    
  }

  ngOnInit() {
    this.Others.onSelectBG('Confirmation');
    this.tenor.selectors('Confirmation');
    this.tradeSupport=environment.name
    sessionStorage.setItem('page','second')
    let data = {
      "userid": sessionStorage.getItem('userID'),
      "emailAddress": ""
    }
    this.accountType=sessionStorage.getItem('accountType');

    this.getCount.getTotalCount(data,sessionStorage.getItem('token')).subscribe(
      response => {
        this.nimaiCount = JSON.parse(JSON.stringify(response)).data;
        this.creditCounts=this.nimaiCount.lc_count-this.nimaiCount.lcutilizedcount;

        // 50-(50-10)=10>10
        // 50-(50-11)=11>10 error

         if(this.nimaiCount.status.toLowerCase() =='inactive' ){
           if(this.creditCounts>0){
          if(this.nimaiCount.lc_count-this.creditCounts> 5 )
          {
          this.trnxMsg="  Please subscribe to a Plan, as your current plan has expired or your credit limit has been exhausted.";
          // this.isExpired=true;
          $('#trnxInactive').show();
          }
        }
        }
           
        if( this.nimaiCount.accountstatus=='INACTIVE'){
          this.trnxMsg="Your account is temporarily locked. Please contact your account admin or customer support at support@360tf.trade."
          $('#trnxInactive').show();
        }
        // else if(this.nimaiCount.status.toLowerCase() =='inactive' ||  this.nimaiCount.status== 'INACTIVE' ){
          else if(-5>= this.creditCounts ){
          this.trnxMsg="  Your subcription plan has been expired , Please renew your subcription plan.";
          this.isExpired=true;
          $('#trnxInactive').show();
        }
        //mPending
        else if(this.nimaiCount.paymentstatus=='Pending' || this.nimaiCount.paymentstatus=='Maker Approved'){
          this.trnxMsg="Your renewal payment approval is pending. It usually takes up to 48 hours to approve the payment. For more clarification contact us at "+this.tradeSupport
          $('#trnxInactive').show();
        }else if(this.nimaiCount.paymentstatus=='Rejected'){
          this.trnxMsg="Your subscription payment is rejected. Contact support for more clarification "+this.tradeSupport
          this.isRejected=true;
          $('#trnxInactive').show();
        }
        else{
          this.checkLcCount();
        }
        // if(this.nimaiCount.lc_count<=this.nimaiCount.lcutilizedcount){
          this.creditCounts=this.nimaiCount.lc_count-this.nimaiCount.lcutilizedcount;

          if(-5>=this.creditCounts){
          if(this.accountType=='SUBSIDIARY' || this.accountType=='Passcode'){
            const navigationExtras: NavigationExtras = {
              state: {
                title: 'Transaction Not Allowed!',
                message: 'You had reached maximum LC credits! Please ask your parent user to renew the subscription plan',
                parent: this.subURL+"/"+this.parentURL + '/dashboard-details',
                redirectedFrom: "New-Transaction"
              }
            };
            this.router.navigate([`/${this.subURL}/${this.parentURL}/subscription/error`], navigationExtras)
              .then(success => console.log('navigation success?', success))
              .catch(console.error);
        }
      }

          
         
        },  
     
    )   
    

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
    this.rds.refinanting.subscribe(flag => this.refinancing = flag);
    //this.rds.bankGuarantee.subscribe(flag=>this.bankGuarantee= flag);

    const lcd = this;
    $(document).ready(function () {
      const anchor: any[] = $('.nav-tabs').find('a');
      lcd.saveCount = anchor.length;

    })
    call();
    setTimeout(() => {
      loads();
    }, 500);
    this.countryName = JSON.parse(sessionStorage.getItem('countryData'));
    this.currencies = JSON.parse(sessionStorage.getItem('currencyData'));
      
   // this.currencies = [...new Set(this.countryName.map(item => item.currency))];
  
   
  }
  warnOk(){
    $('#trnxWarn').hide();
    this.confirm() 

  }
  inactiveOk(){
    if(this.isRejected){
      this.router.navigateByUrl('/', {skipLocationChange: true}).then(() => {
        this.router.navigate([`/${this.subURL+"/"+this.parentURL }/subscription`]);
         
    });
    }
    else if(this.isExpired){
      this.router.navigateByUrl('/', {skipLocationChange: true}).then(() => {
        this.router.navigate([`/${this.subURL+"/"+this.parentURL }/subscription`]);
         
    });
    }
    else{
    this.router.navigateByUrl('/', {skipLocationChange: true}).then(() => {
          this.router.navigate([`/${this.subURL+"/"+this.parentURL }/dashboard-details`]);
           
      });
    }
  }
  ngAfterViewInit() {
    // document.getElementsByTagName('input') : to gell all Docuement imputs
    const inputList = [].slice.call((<HTMLElement>this.el.nativeElement).getElementsByTagName('input'));
     inputList.forEach((input: HTMLElement) => {
         input.addEventListener('focus', () => {
          if((<HTMLInputElement>event.target).id===null || (<HTMLInputElement>event.target).id===""){
             if((<HTMLInputElement>event.target).value===null || (<HTMLInputElement>event.target).value==="")
              input.className="ng-valid ng-dirty ng-touched"   
             else 
              input.className="ng-valid ng-dirty ng-touched has-value"
          }   
         });
            input.addEventListener('blur', () => {
              if((<HTMLInputElement>event.target).id===null || (<HTMLInputElement>event.target).id==="")
              {
              if((<HTMLInputElement>event.target).value===null || (<HTMLInputElement>event.target).value==="")
                input.className="ng-valid ng-dirty ng-touched"   
              else
              input.className="ng-valid ng-dirty ng-touched has-value"
              }
         });
     });
     const selectList = [].slice.call((<HTMLElement>this.el.nativeElement).getElementsByTagName('select'));
     selectList.forEach((select: HTMLElement) => {
      select.addEventListener('focus', () => {
        if((<HTMLInputElement>event.target).value===null || (<HTMLInputElement>event.target).value==="")
          select.className="ng-valid ng-dirty ng-touched"   
        else 
          select.className="ng-valid ng-dirty ng-touched has-value"
      });
      select.addEventListener('blur', () => {
        if((<HTMLInputElement>event.target).value===null || (<HTMLInputElement>event.target).value==="")
          select.className="ng-valid ng-dirty ng-touched"   
        else 
          select.className="ng-valid ng-dirty ng-touched has-value"
      });
  });
    const textareaList = [].slice.call((<HTMLElement>this.el.nativeElement).getElementsByTagName('textarea'));
    textareaList.forEach((textarea: HTMLElement) => {
      textarea.addEventListener('focus', () => {
      if((<HTMLInputElement>event.target).value===null || (<HTMLInputElement>event.target).value==="")
      textarea.className="ng-valid ng-dirty ng-touched"   
      else 
      textarea.className="ng-valid ng-dirty ng-touched has-value"
    });
    textarea.addEventListener('blur', () => {
      if((<HTMLInputElement>event.target).value===null || (<HTMLInputElement>event.target).value==="")
      textarea.className="ng-valid ng-dirty ng-touched"   
      else 
      textarea.className="ng-valid ng-dirty ng-touched has-value"
    });
  });
 
 }

 
  public next() {  
     
    // let applicantVal =  this.ApplicantBeneficiary.isValid();
    //   if(applicantVal){
     
    //   }else{
    //     return
    //   }

      // this.validate()
      // if (this.lCIssuanceBank &&  this.lCIssuanceBranch && this.swiftCode && this.lCIssuanceCountry &&
      //   this.lCValue && this.lCIssuingDate && this.lCCurrency&& this.lastShipmentDate && this.lCIssuingDate&&
      //   this.negotiationDate && this.otherType && this.goodsType) {  
      //     return ;
      //    }  
    
 
        

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


  public save() {
    this.loading = true;
    this.titleService.loading.next(true);
    console.log()
    if(this.lcDetailForm.get('isESGComplaint').value){
      this.lcDetailForm.get('isESGComplaint').setValue("Yes");
    }     else{
      
     this.lcDetailForm.get('isESGComplaint').setValue("");
     }  
    if(this.isBgOther){
      this.lcDetailForm.get('bgType').setValue("Others - "+this.lcDetailForm.get('otherBGType').value)
    }
    if(this.othersStr=='Others'){
     this.lcDetailForm.get('goodsType').setValue("Others - "+this.lcDetailForm.get('otherType').value)
    }
    // if( this.lcDetailForm.invalid){
    //   this.invalidDate="Fail";
    //   this.invalidMsg="Please fill all the fields";
    //   $("#invalidDate").show(); 
    //   return
    // }
    let data = this.lcDetailForm.value;
    console.log(data.claimExpiryDate)

    data.lCIssuingDate = (data.lCIssuingDate) ? this.dateFormat(data.lCIssuingDate) : '';
    data.lCExpiryDate = (data.lCExpiryDate) ? this.dateFormat(data.lCExpiryDate) : '';
    data.lastShipmentDate = (data.lastShipmentDate) ? this.dateFormat(data.lastShipmentDate) : '';
   // data.bgExpiryDate=(data.bgExpiryDate) ? this.dateFormat(data.bgExpiryDate) : '' ;
    data.claimExpiryDate=(data.claimExpiryDate) ? this.dateFormat(data.claimExpiryDate) : '' ;
    data.negotiationDate = (data.negotiationDate) ? this.dateFormat(data.negotiationDate) : '';
   data.validity = (data.validity) ? this.dateFormat(data.validity) : this.dateFormat(this.validityDate);
 
    data.requirementType = data.selector;
    data.lcMaturityDate = (data.lcMaturityDate) ? this.dateFormat(data.lcMaturityDate) : '';
    data.startDate = (data.lCIssuingDate) ? this.dateFormat(data.lCIssuingDate) : '';
    data.tenorFile=this.lcDetailForm.get('tenorFile').value
    data.lcProForma=this.lcDetailForm.get('lcProForma').value

data.branchUserEmail=sessionStorage.getItem('branchUserEmailId');
  var strs=data.validity;
  var strsplit=strs.split('T',2)
     this.currentDateTime =formatDate(new Date(), "yyyy-MM-dd", 'en-US')    
     if(strsplit[0]<this.currentDateTime ){
       this.invalidDate="Invalid Validity Date";
       this.invalidMsg="Please select correct transaction validity date";
      $("#invalidDate").show();         
    }  else{
    this.upls.saveLc(data)
      .subscribe(
        (response) => {
          this.transactionID = JSON.parse(JSON.stringify(response)).data;
          // sessionStorage.setItem("transactionID",this.transactionID);
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
          this.titleService.loading.next(false);
        },
        (error) => {
          this.loading = false;
          this.titleService.loading.next(false);
          const navigationExtras: NavigationExtras = {
            state: {
              title: 'Transaction Failed',
              message: '',
              parent: this.subURL+"/"+this.parentURL +'/new-transaction'
            }
          };
          this.router.navigate([`/${this.subURL}/${this.parentURL}/new-transaction/error`], navigationExtras)
            .then(success => console.log('navigation error?', success))
            .catch(console.error);
        }
      )
  }
    //  else {
    //   $("#invalidDate").show();         

    //   }
  }

  public preview() {
    this.titleService.loading.next(true);

    this.save();
    // this.lc = this.lcDetailForm.value;
    // this.previewShow = true;
    // this.isPrev = false;
    // this.isNext = false;
    // this.isSave = false;
    // this.isPreview = false;
    // this.showUpdateButton = false;
    // this.isEdit = true;
    // this.isConfirm = true;
    this.titleService.loading.next(false);
    
  }

  public update(){
    this.loading = true;
    if(this.lcDetailForm.get('isESGComplaint').value){
      this.lcDetailForm.get('isESGComplaint').setValue("Yes");
    }     else{
    this.lcDetailForm.get('isESGComplaint').setValue("");
     }  
    this.titleService.loading.next(true);
    if(this.isBgOther){
      this.lcDetailForm.get('bgType').setValue("Others - "+this.lcDetailForm.get('otherBGType').value)
    }
    if(this.othersStr=='Others'){
      this.lcDetailForm.get('goodsType').setValue("Others - "+this.lcDetailForm.get('otherType').value)
     }
    
    let data = this.lcDetailForm.value;
console.log(data.claimExpiryDate)

    data.lCIssuingDate = (data.lCIssuingDate) ? this.dateFormat(data.lCIssuingDate) : '';
    data.lCExpiryDate = (data.lCExpiryDate) ? this.dateFormat(data.lCExpiryDate) : '';
    data.lastShipmentDate = (data.lastShipmentDate) ? this.dateFormat(data.lastShipmentDate) : '';
   // data.bgExpiryDate=(data.bgExpiryDate) ? this.dateFormat(data.bgExpiryDate) : '' ;
    data.claimExpiryDate=(data.claimExpiryDate) ? this.dateFormat(data.claimExpiryDate) : '' ;
    data.negotiationDate = (data.negotiationDate) ? this.dateFormat(data.negotiationDate) : '';
    data.validity = (data.validity) ? this.dateFormat(data.validity) : this.dateFormat(this.validityDate);
    data.lcMaturityDate = (data.lcMaturityDate) ? this.dateFormat(data.lcMaturityDate) : '';
    data.requirementType = data.selector;
    data.startDate = (data.lCIssuingDate) ? this.dateFormat(data.lCIssuingDate) : '';
    data.transactionId = this.transactionID;
    data.tenorFile=this.lcDetailForm.get('tenorFile').value
    data.lcProForma=this.lcDetailForm.get('lcProForma').value
   
    data.branchUserEmail=sessionStorage.getItem('branchUserEmailId');

    var strs=data.validity;
    var strsplit=strs.split('T',2)
       this.currentDateTime =formatDate(new Date(), "yyyy-MM-dd", 'en-US')    
 console.log(strsplit[0])
       if(strsplit[0]<this.currentDateTime ){
        this.invalidDate="Invalid Validity Date";
        this.invalidMsg="Please select correct transaction validity date";
        $("#invalidDate").show();         
      }  else{
        this.upls.updateLc(data).subscribe(
          (response) => {
             this.transactionID = JSON.parse(JSON.stringify(response)).data;
            this.loading = false;
            this.titleService.loading.next(false);
            this.lc = this.lcDetailForm.value;
            this.previewShow = true;
            this.isPrev = false;
            this.isNext = false;
            this.isSave = false;
            this.isPreview = false;
            this.showUpdateButton = false;
            this.isEdit = true;
            this.isConfirm = true;
          },
          (error) => {
            this.loading = false;
            this.titleService.loading.next(false);
            const navigationExtras: NavigationExtras = {
              state: {
                title: 'Transaction Failed',
                message: '',
                parent: this.subURL+"/"+this.parentURL +'/new-transaction'
              }
            };
            this.router.navigate([`/${this.subURL}/${this.parentURL}/new-transaction/error`], navigationExtras)
              .then(success => console.log('navigation error?', success))
              .catch(console.error);
          }
        )
      }
  }

checkCount(){
  if(0>= this.creditCounts || this.nimaiCount.status.toLowerCase()=='inactive' ){
    this.trnxMsg="  Please subscribe to a Plan, as your current plan has expired or your credit limit has been exhausted.";
    this.isExpired=true;
    $('#trnxWarn').show();
    
  }
 else{
    this.confirm() 
  }
}

  public confirm() {
   this.titleService.loading.next(true);
  

    this.loading = true;
    let body = {
      transactionId: this.transactionID,
      userId: sessionStorage.getItem('userID')
    }

    // this.upls.confirmLc(body).subscribe(
    this.upls.checkDuplicateLC(body).subscribe(

        (response) => {
          var resp = JSON.parse(JSON.stringify(response)).status;
          var errmsg = JSON.parse(JSON.stringify(response)).errMessage;
          if(resp == "Failure"){
            const navigationExtras: NavigationExtras = {
              state: {
                title: 'Transaction Failed',
                message: JSON.parse(JSON.stringify(response)).errMessage,
                parent: this.subURL+"/"+this.parentURL +'/new-transaction'
              }
            };
            this.router.navigate([`/${this.subURL}/${this.parentURL}/new-transaction/error`], navigationExtras)
              .then(success => console.log('navigation error?', success))
              .catch(console.error);
          }
        
         

        if(errmsg=="No Duplicate LC"){
         
          this.upls.confirmLc(body).subscribe(
        
                (response) => {
                  this.status="active-transaction";
                  // if(JSON.parse(JSON.stringify(response)).errCode=="Active"){
                  //   this.status="active-transaction";
                  // }        
                  // if(JSON.parse(JSON.stringify(response)).errCode=="Pending"){
                  //   this.status="pending-transaction";
                  // }

                  var errmsg = JSON.parse(JSON.stringify(response)).errMessage;
                  if(errmsg){
                    this.loading = false;
                    this.titleService.loading.next(false);
                    this.trnxFailedMsg=errmsg;
                    $('#trnxFailed').show();
                  
                  }
                  else{
                    this.setForm();
                    this.edit();

 const navigationExtras: NavigationExtras = {
            state: {
              title: 'Transaction Successful',
              message: 'Your LC Transaction has been successfully placed. Keep checking the Active Transaction section for the quotes received.',
              parent: this.subURL+"/"+this.parentURL + "/"+this.status
            }
          };
          this.router.navigate([`/${this.subURL}/${this.parentURL}/new-transaction/success`], navigationExtras)
            .then(success => console.log('navigation success?', success))
            .catch(console.error);
          this.isUpdate = false;
        }
                });
          // this.upls.confirmLcMailSent(emailBody).subscribe((resp) => {console.log("customer mail sent successfully");},(err) => {},);
          
          // this.upls.confirmLcMailSentToBank(emailBankBody).subscribe((resp) => {
          //   console.log("bank mail sent successfully");},(err) => {},);
        
              
        }  

        if(errmsg=="Duplicate LC") {
          $("#duplicatePopup").show();         
          }

        },
        (error) => {
          this.titleService.loading.next(false);
          this.loading = false;
          const navigationExtras: NavigationExtras = {
            state: {
              title: 'Transaction Failed',
              message: '',
              parent: this.subURL+"/"+this.parentURL +'/new-transaction'
            }
          };
          this.router.navigate([`/${this.subURL}/${this.parentURL}/new-transaction/error`], navigationExtras)
            .then(success => console.log('navigation error?', success))
            .catch(console.error);
        }
      )
  }

  invalidDateOk(){
    
    $("#invalidDate").hide();
    $("#trnxFailed").hide();
  }

  dupPopYes(){
    $("#duplicatePopup").hide();
   
    let body = {
      transactionId: this.transactionID,
      userId: sessionStorage.getItem('userID')
    }
    
    this.upls.confirmLc(body).subscribe(
        
      (response) => {        
        var errmsg = JSON.parse(JSON.stringify(response)).errMessage;
        this.status="active-transaction";
        // if(JSON.parse(JSON.stringify(response)).errCode=="Active"){
        //   this.status="active-transaction";
        // }

        // if(JSON.parse(JSON.stringify(response)).errCode=="Pending"){
        //   this.status="pending-transaction";
        // }

        if(errmsg){
          this.trnxFailedMsg=errmsg;
          $('#trnxFailed').show();
       
        }else{
          this.setForm();
          this.edit();
const navigationExtras: NavigationExtras = {
      state: {
        title: 'Transaction Successful',
        message: 'Your LC Transaction has been successfully placed. Keep checking the Active Transaction section for the quotes received.',
        parent: this.subURL+"/"+this.parentURL + "/"+this.status
      }
    };
    this.router.navigate([`/${this.subURL}/${this.parentURL}/new-transaction/success`], navigationExtras)
      .then(success => console.log('navigation success?', success))
      .catch(console.error);
    this.isUpdate = false;
  }
      });

    // this.upls.confirmLcMailSent(emailBody).subscribe((resp) => {console.log("customer mail sent successfully");},(err) => {},);
    
    // this.upls.confirmLcMailSentToBank(emailBankBody).subscribe((resp) => {
    //   console.log("bank mail sent successfully");},(err) => {},);
  
    
  }
  dupPopNo(){
    $("#duplicatePopup").hide();
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
  
this.Others.isESGComplaint(this.lcDetailForm.get('isESGComplaint').value)

  }

  public setForm() {
    var userIdDetail = sessionStorage.getItem('userID');
    var emailId = "";
    if(userIdDetail.startsWith('BC')){
      emailId = sessionStorage.getItem('branchUserEmailId');
    }
    // else{
    //   emailId = sessionStorage.getItem('custUserEmailId');
    // }
    this.lcDetailForm = this.fb.group({
      selector: ['Confirmation'],
      userId: sessionStorage.getItem('userID'),
      requirementType: [''],
      lCIssuanceBank: [''],
      lCIssuanceBranch: [''],
      swiftCode: [''],
      lCIssuanceCountry: [''],
      branchUserEmail: emailId,
      lCValue: [''],
      lCCurrency: [''],
      lCIssuingDate: [''], 
      lastShipmentDate: [''],
      
      bgExpiryDate:[''],
      claimExpiryDate:[''],
      negotiationDate: [''],
      goodsType:[''],
      otherType:[''],
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
      lcMaturityDate:[''],
      lcNumber:[''],
      lastBeneBank:[''],
      lastBeneSwiftCode:[''],
      lastBankCountry:[''],  
      
      applicantName:sessionStorage.getItem('companyName'),
      applicantCountry:sessionStorage.getItem('registeredCountry'),
  
      beneName:sessionStorage.getItem('companyName'),
      beneBankCountry:[''],
      beneBankName:[''],
      beneSwiftCode:[''],
      beneCountry:sessionStorage.getItem('registeredCountry'),
      
     
      loadingCountry:[''],
      loadingPort:[''],
      dischargeCountry:[''],
      dischargePort:[''],
  
      chargesType: [''],
      validity:[''],
      isESGComplaint:[''],
      lcProForma:[''],
  
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
  }


  public dateFormat(date: string): string {
    if(date==undefined){
      this.invalidDate="Invalid Date";
      this.invalidMsg="Please select the date";
     $("#invalidDate").show(); 
    }else{
      let formatedDate = formatDate(new Date(date), "yyyy-MM-dd", 'en-US');
      return formatedDate;
    }
   
  }

  validateRegexFields(event, type){
    var key = event.keyCode;
    if(type == "number"){
      ValidateRegex.validateNumber(event);
    }
    else if(type == "alpha"){
      ValidateRegex.alphaOnly(event);
    }
    else if(type == "alphaNum"){
      ValidateRegex.alphaNumeric(event);
    }
    else if(type == "alphaNumericNoSpace"){
      ValidateRegex.alphaNumericNoSpace(event);
    }
    else if(type == "date_validation"){     
      if (key!=191 && key!=189 && key > 31 && (key < 48 || key > 57)) {
        event.preventDefault();
      }
    }

  }
  onBGSelect(item) {
    // this.othersStr=splittedStr[1];
    if(item=="Others"){
      this.isBgOther=true;      
    }else{
      this.isBgOther=false;
    }
  }
  onItemSelect(item) {
    var str = item; 
    var splittedStr =str.split(": ",2)
      this.othersStr=splittedStr[1];
    if(splittedStr[1]=="Others"){
      this.isBankOther=true;      
     // loads();
    }else{
      this.isBankOther=false;
    }
  }
  selectCountryInfo(e){
//   let country= this.lcDetailForm.get('lCIssuanceCountry').value;
    const param={
      "lCIssuanceCountry":e
      }
    this.upls.getBankCountForCountry(param).subscribe((response)=>{
this.selectInfo=   JSON.parse(JSON.stringify(response)).data;

    })

    }

  callDraftTransaction(trnsactionID){
    this.transactionID = trnsactionID;
    const param = {
      transactionId: trnsactionID
    }
    let emailBodyUpdate = {
      "transactionid": trnsactionID,
      "userId": sessionStorage.getItem('userID'),
      "event": "LC_UPDATE"
      }
    this.isUpdate = true;
    
    this.upls.getCustspecificDraftTransaction(param).subscribe(
      (response) => {
    
        this.draftData = JSON.parse(JSON.stringify(response)).data;
    
        if(this.draftData.goodsType.startsWith('Others')){
          this.isBankOther=true;      
          var str = this.draftData.goodsType; 
          var splittedStr =str.split(" - ",2)
            this.othersStr=splittedStr[0];
            this.draftData.goodsType=this.othersStr;
            this.draftData.otherType=splittedStr[1];

         }else{
           this.isBankOther=false;
           this.isBgOther=false;
         }
if(this.draftData.bgType!=null)
         if (this.draftData.bgType.startsWith('Others')){
          this.isBgOther=true;      
          console.log(this.draftData.bgType)
          var str = this.draftData.bgType; 
          var splittedStr =str.split(" - ",2)
            this.othersStr=splittedStr[0];
         //otherBGType
          this.draftData.bgType=this.othersStr
          this.draftData.otherBGType=splittedStr[1];
         }else{
           this.isBankOther=false;
           this.isBgOther=false;
         }

         this.ngOnInit();
     
        this.selectCountryInfo(this.draftData.lCIssuanceCountry)
        this.ApplicantBeneficiary.onItemChange(this.draftData.userType,this.draftData.beneContactPerson,this.draftData.beneContactPersonEmail,this.draftData.applicantContactPerson,this.draftData.applicantContactPersonEmail)
        this.Others.portDischargeOnchange(this.draftData.dischargeCountry)
        this.Others.portLoadingOnchange(this.draftData.loadingCountry)
        this.Others.onItemChange(this.draftData.chargesType)
        this.Others.isESGComplaint(this.draftData.isESGComplaint)
        this.tenor.selectors(this.draftData.requirementType) 
        this.tenor.upload(this.draftData.tenorFile);
        this.Others.onSelectBG(this.draftData.requirementType);

        this.validityDate=this.setDateFromApi(this.draftData.validity);

        this.lcDetailForm.patchValue({
          userId: this.draftData.userId,
          selector: this.draftData.requirementType,
          lCIssuanceBank: this.draftData.lCIssuanceBank,
          lCIssuanceBranch: this.draftData.lCIssuanceBranch,
          swiftCode: this.draftData.swiftCode,
          lCIssuanceCountry: this.draftData.lCIssuanceCountry,
         // isESGComplaint:this.draftData.isESGComplaint,
          lCValue: this.draftData.lCValue,
          lCCurrency: this.draftData.lCCurrency,
          lCIssuingDate: this.setDateFromApi(this.draftData.lCIssuingDate),
          lastShipmentDate: this.setDateFromApi(this.draftData.lastShipmentDate),
         // bgExpiryDate:this.setDateFromApi(this.draftData.bgExpiryDate),
          lCExpiryDate:this.setDateFromApi(this.draftData.lCExpiryDate),   
          claimExpiryDate:this.setDateFromApi(this.draftData.claimExpiryDate),
          negotiationDate: this.setDateFromApi(this.draftData.negotiationDate),
          goodsType:this.draftData.goodsType,
          otherType:this.draftData.otherType,
          bgType:this.draftData.bgType,
         otherBGType:this.draftData.otherBGType,
          // For Confirmation 
          confirmationPeriod: this.draftData.confirmationPeriod,
          paymentTerms: this.draftData.paymentTerms,
          startDate:this.draftData.startDate,
          // tenorEndDate: this.draftData.tenorEndDate,
      
          // For Discounting 
          discountingPeriod:this.draftData.discountingPeriod,
          remarks:this.draftData.remarks,
      
          //For Refinancing
          originalTenorDays:this.draftData.originalTenorDays,
          refinancingPeriod:this.draftData.refinancingPeriod,
       //  lcMaturityDate:this.draftData.lcMaturityDate,
          lcMaturityDate:this.setDateFromApi(this.draftData.lcMaturityDate),
       //   tenorFile:this.draftData.tenorFile,
          lcNumber:this.draftData.lcNumber,
          lastBeneBank:this.draftData.lastBeneBank,
          lastBeneSwiftCode:this.draftData.lastBeneSwiftCode,
          lastBankCountry:this.draftData.lastBankCountry,    
          applicantName:this.draftData.applicantName,
          applicantCountry:this.draftData.applicantCountry,
      
          beneName:this.draftData.beneName,
          beneBankCountry:this.draftData.beneBankCountry,
          beneBankName:this.draftData.beneBankName,
          beneSwiftCode:this.draftData.beneSwiftCode,
          beneCountry:this.draftData.beneCountry,
          
         
          loadingCountry:this.draftData.loadingCountry,
          loadingPort:this.draftData.loadingPort,
          dischargeCountry:this.draftData.dischargeCountry,
          dischargePort:this.draftData.dischargePort,
      
         // chargesType: this.draftData.chargesType,
          validity:this.setDateFromApi(this.draftData.validity),
          lcProForma:this.draftData.lcProForma,          
          insertedDate: this.draftData.insertedDate,
          insertedBy: this.draftData.insertedBy,
          modifiedDate: this.draftData.modifiedDate,
          modifiedBy: this.draftData.modifiedBy,
          transactionflag: this.draftData.transactionflag,
          transactionStatus: this.draftData.transactionStatus,
          userType:this.draftData.userType,
          applicantContactPerson:this.draftData.applicantContactPerson,
          applicantContactPersonEmail:this.draftData.applicantContactPersonEmail,
          beneContactPerson:this.draftData.beneContactPerson,
          beneContactPersonEmail:this.draftData.beneContactPersonEmail,
        });
   //  this.lcDetail = this.lcDetailForm.value;

  }     
      ,(error) =>{
      }
      )
  }

  callCloneTransaction(trnsactionID){
    this.transactionID = trnsactionID;
    var data = {
      "transactionId":trnsactionID
      }
  
      this.upls.custCloneTransaction(data).subscribe(
        (response) => {
          this.cloneData = JSON.parse(JSON.stringify(response)).data;
console.log(this.cloneData.goodsType)
          if(this.cloneData.goodsType.startsWith('Others')){
            this.isBankOther=true;      
            var str = this.cloneData.goodsType; 
            var splittedStr =str.split(" - ",2)
              this.othersStr=splittedStr[0];
         this.cloneData.goodsType=this.othersStr;
         this.cloneData.otherType=splittedStr[1];
  
           }else{
             this.isBankOther=false;
           }
           if(this.cloneData.bgType!=null)
           if (this.cloneData.bgType.startsWith('Others')){
            this.isBgOther=true;      
            var str = this.cloneData.bgType; 
            var splittedStr =str.split(" - ",2)
              this.othersStr=splittedStr[0];
           //otherBGType
            this.cloneData.bgType=this.othersStr
            this.cloneData.otherBGType=splittedStr[1];
           }else{
             this.isBankOther=false;
           }

          this.ngOnInit();    

          this.selectCountryInfo(this.cloneData.lCIssuanceCountry)
          this.ApplicantBeneficiary.onItemChange(this.cloneData.userType,this.cloneData.beneContactPerson ,
            this.cloneData.beneContactPersonEmail,
            this.cloneData.applicantContactPerson,this.cloneData.applicantContactPersonEmail);     
            this.Others.isESGComplaint(this.cloneData.isESGComplaint)
      
          this.Others.portDischargeOnchange(this.cloneData.dischargeCountry)
          this.Others.portLoadingOnchange(this.cloneData.loadingCountry)
          this.Others.onItemChange(this.cloneData.chargesType)
         // this.Others.upload(this.cloneData.lcProForma)
          this.tenor.selectors(this.cloneData.requirementType) 
          this.tenor.upload(this.cloneData.tenorFile);
          this.Others.onSelectBG(this.cloneData.requirementType);
        this.validityDate=this.setDateFromApi(this.cloneData.validity);


        this.lcDetailForm.patchValue({
          otherType:this.cloneData.otherType,
          bgType:this.cloneData.bgType,
          otherBGType:this.cloneData.otherBGType,
          userId: this.cloneData.userId,
          selector: this.cloneData.requirementType,
          lCIssuanceBank: this.cloneData.lCIssuanceBank,
          lCIssuanceBranch: this.cloneData.lCIssuanceBranch,
          swiftCode: this.cloneData.swiftCode,
          lCIssuanceCountry: this.cloneData.lCIssuanceCountry,
      
          lCValue: this.cloneData.lCValue,
          lCCurrency: this.cloneData.lCCurrency,
          lCIssuingDate: this.setDateFromApi(this.cloneData.lCIssuingDate),
          lastShipmentDate: this.setDateFromApi(this.cloneData.lastShipmentDate),
         // bgExpiryDate:this.setDateFromApi(this.draftData.bgExpiryDate),
          lCExpiryDate:this.setDateFromApi(this.cloneData.lCExpiryDate),    

          claimExpiryDate:this.setDateFromApi(this.cloneData.claimExpiryDate),
          negotiationDate: this.setDateFromApi(this.cloneData.negotiationDate),
          goodsType:this.cloneData.goodsType,
      
      
          // For Confirmation 
          confirmationPeriod: this.cloneData.confirmationPeriod,
          paymentTerms: this.cloneData.paymentTerms,
          startDate:this.cloneData.startDate,
          // tenorEndDate: this.cloneData.tenorEndDate,
      
          // For Discounting 
          discountingPeriod:this.cloneData.discountingPeriod,
          remarks:this.cloneData.remarks,
      
          //For Refinancing
          originalTenorDays:this.cloneData.originalTenorDays,
          refinancingPeriod:this.cloneData.refinancingPeriod,
          lcMaturityDate:this.setDateFromApi(this.cloneData.lcMaturityDate),
          lcNumber:this.cloneData.lcNumber,
                    lastBeneBank:this.cloneData.lastBeneBank,
          lastBeneSwiftCode:this.cloneData.lastBeneSwiftCode,
          lastBankCountry:this.cloneData.lastBankCountry,
      
         // tenorFile:this.cloneData.tenorFile,

          applicantName:this.cloneData.applicantName,
          applicantCountry:this.cloneData.applicantCountry,
      
          beneName:this.cloneData.beneName,
          beneBankCountry:this.cloneData.beneBankCountry,
          beneBankName:this.cloneData.beneBankName,
          beneSwiftCode:this.cloneData.beneSwiftCode,
          beneCountry:this.cloneData.beneCountry,
          
         
          loadingCountry:this.cloneData.loadingCountry,
          loadingPort:this.cloneData.loadingPort,
          dischargeCountry:this.cloneData.dischargeCountry,
          dischargePort:this.cloneData.dischargePort,
      
         // chargesType: this.cloneData.chargesType,
          validity:this.setDateFromApi(this.cloneData.validity),
         // isESGComplaint:this.cloneData.isESGComplaint,
         // lcProForma:this.cloneData.lcProForma,          
          insertedDate: this.cloneData.insertedDate,
          insertedBy: this.cloneData.insertedBy,
          modifiedDate: this.cloneData.modifiedDate,
          modifiedBy: this.cloneData.modifiedBy,
          transactionflag: this.cloneData.transactionflag,
          transactionStatus: this.cloneData.transactionStatus,
          userType:this.cloneData.userType,
          applicantContactPerson:this.cloneData.applicantContactPerson,
          applicantContactPersonEmail:this.cloneData.applicantContactPersonEmail,
          beneContactPerson:this.cloneData.beneContactPerson,
          beneContactPersonEmail:this.cloneData.beneContactPersonEmail,
        });
        },
        (err) => {}
    ) 
  }

  setDateFromApi(inDate){
    if(inDate == undefined){
      inDate = '';
    }
    else{
      inDate = new Date(inDate);
    }
    return inDate;
  }

  openDocument(file){
    $('#myModal7').show();
    var str = file; 
    var splittedStr = str.split(" |", 2); 
    var filename=str.split(" |", 1); 
    var filename=splittedStr[0].toLowerCase();
    var ext = filename.split("."); 
    //  if(ext[1]=='jpeg' || ext[1]=='jpg' || ext[1]=='png' || ext[1]=='svg' || 
    //     ext[1]=='JPEG' || ext[1]=='JPG' || ext[1]=='PNG' || ext[1]=='SVG'){
    //   this.imgDownload=true;
    //  }else{
    //   this.imgDownload=false;
    //  }

     if(ext[ext.length-1]=='jpeg' || ext[ext.length-1]=='jpg' || ext[ext.length-1]=='png' || ext[ext.length-1]=='svg'){
      this.imgDownload=true;
      this.isDownloadORview="Download"
     }else{
      this.imgDownload=false;
      if( ext[ext.length-1]=='pdf'){
        this.isDownloadORview="View"
           }else{
              this.isDownloadORview="Download"
       }     
     }

    var data=splittedStr[1];
    this.document = data;
    this.fileData=file;
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

  close(){
    $('.modal3').hide();
    $('#invalidDate').hide();
  }

  checkLcCount(){
    var data = {
      "userId": sessionStorage.getItem("userID")
      }
  
      this.upls.checkLcCount(data).subscribe(
        (response) => {
          var resp = JSON.parse(JSON.stringify(response)).status;

          if(resp == "Failure"){
            const navigationExtras: NavigationExtras = {
              state: {
                title: 'Transaction Not Allowed!',
             //   message: 'You had reached maximum LC Count! Please Renew Your Subscribe Plan',
                message:JSON.parse(JSON.stringify(response)).errMessage,
                parent: this.subURL+"/"+this.parentURL + '/subscription',
                redirectedFrom: "New-Transaction"
              }
            };
            this.router.navigate([`/${this.subURL}/${this.parentURL}/subscription/error`], navigationExtras)
              .then(success => console.log('navigation success?', success))
              .catch(console.error);
          }
        },
        (err) => {}
      )
  }
  convertbase64toArrayBuffer(base64) {
    var binary_string = window.atob(base64);
    var len = binary_string.length;
    var bytes = new Uint8Array(len);
    for (var i = 0; i < len; i++) {
      bytes[i] = binary_string.charCodeAt(i);
    }
    return bytes.buffer;
  }
  download(){
    var str = this.fileData;
    var splittedStr = str.split(" |", 2); 
    var data=splittedStr[1];
    var base64string = data;
    
    var filename=splittedStr[0].toLowerCase();
    var ext = filename.split("."); 
   // var extension ='.'+ext[1];
   var extension='.'+ext[ext.length-1];
    if(extension=='.xlsx'){

      base64string= base64string.replace('data:application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;base64,', '')
      const byteArr = this.convertbase64toArrayBuffer(base64string);
      var blob = new Blob([byteArr], { type:'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'});
      FileSaver.saveAs(blob, filename);
    } 
    else if(extension=='.xls'){
      var  base64string= base64string.replace('data:application/vnd.ms-excel;base64,', '')
        const byteArr = this.convertbase64toArrayBuffer(base64string);
        var blob = new Blob([byteArr], { type:'application/vnd.ms-excel'});
        FileSaver.saveAs(blob, filename);
        this.imgDownload=false;
      } 
      else if(extension=='.doc'){
        base64string= base64string.replace('data:application/msword;base64,', '')
        const byteArr = this.convertbase64toArrayBuffer(base64string);
        var blob = new Blob([byteArr], { type: 'application/msword' });
        FileSaver.saveAs(blob,filename);
        this.imgDownload=false;

    }
    else if(extension=='.pdf'){
      base64string= base64string.replace('data:application/pdf;base64,', '')
      const byteArr = this.convertbase64toArrayBuffer(base64string);
      var blob = new Blob([byteArr], { type: 'application/pdf' });
      var fileURL = URL.createObjectURL(blob);
      window.open(fileURL);
      this.imgDownload=false;
    }  
     else if(extension=='.docx'){
        base64string= base64string.replace('data:application/vnd.openxmlformats-officedocument.wordprocessingml.document;base64,', '')
        const byteArr = this.convertbase64toArrayBuffer(base64string);
        var blob = new Blob([byteArr], { type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' });
        FileSaver.saveAs(blob,filename );
    }
     else if(extension=='.csv'){
            base64string= base64string.replace('data:application/vnd.ms-excel;base64,', '')
            const byteArr = this.convertbase64toArrayBuffer(base64string);
            var blob = new Blob([byteArr], { type: 'application/vnd.ms-excel' });
            FileSaver.saveAs(blob, filename);
          }
          else if(extension=='.jpeg' || extension=='.jpg' || extension=='.png' || extension=='.svg' || 
          extension=='.JPEG' || extension=='.JPG' || extension=='.PNG' || extension=='.SVG'){
            base64string= base64string.replace('data:image/jpeg;base64,', '')
            const byteArr = this.convertbase64toArrayBuffer(base64string);
            var blob = new Blob([byteArr], { type: 'image/jpeg' });
            FileSaver.saveAs(blob, filename );
          }    

          else if(extension=='.tiff'){
            base64string= base64string.replace('data:image/tiff;base64,', '')
            const byteArr = this.convertbase64toArrayBuffer(base64string);
            var blob = new Blob([byteArr], { type: 'image/tiff' });
            FileSaver.saveAs(blob, filename );
            this.imgDownload=true;

          }  
      }

      
validate(){
  
  if(!this.lcDetailForm.get('lCIssuanceBank').value)
    this.lCIssuanceBank=true;  
  if(!this.lcDetailForm.get('lCIssuanceBranch').value)
  this.lCIssuanceBranch=true;
  if(!this.lcDetailForm.get('swiftCode').value)
  this.swiftCode=true;
  if(!this.lcDetailForm.get('lCIssuanceCountry').value)
  this.lCIssuanceCountry=true;
  if(!this.lcDetailForm.get('lCValue').value)
  this.lCValue=true;
  if(!this.lcDetailForm.get('lCIssuingDate').value)
  this.lCIssuingDate=true;
   if(!this.lcDetailForm.get('lCCurrency').value)
  this.lCCurrency=true;
  if(!this.lcDetailForm.get('lCIssuingDate').value)
  this.lCIssuingDate=true;
  if(!this.lcDetailForm.get('lastShipmentDate').value)
  this.lastShipmentDate=true;
  if(!this.lcDetailForm.get('negotiationDate').value)
  this.negotiationDate=true;
  if(!this.lcDetailForm.get('goodsType').value)
  this.goodsType=true;
  if(!this.lcDetailForm.get('otherType').value)
  this.otherType=true;
 
}

  onKeyUpBene(event,formControlName){    

    var inputf= /^$/;
if(formControlName=='lCIssuanceBank'){
  if(inputf.test(event.target.value)){
    this.lCIssuanceBank=true;     
  }​else{
    this.lCIssuanceBank=false;     
  }
}else if(formControlName=='lCIssuanceBranch'){
  if(inputf.test(event.target.value)){
    this.lCIssuanceBranch=true;     
  }​else{
    this.lCIssuanceBranch=false;     
  }
}
else if(formControlName=='swiftCode'){
  if(inputf.test(event.target.value)){
    this.swiftCode=true;     
  }​else{
    this.swiftCode=false;     
  }
}else if(formControlName=='lCIssuanceCountry'){
  if(inputf.test(event.target.value)){
    this.lCIssuanceCountry=true;     
  }​else{
    this.lCIssuanceCountry=false;     
  }
}else if(formControlName=='lCValue'){
  if(inputf.test(event.target.value)){
    this.lCValue=true;     
  }​else{
    this.lCValue=false;     
  }
}else if(formControlName=='lCCurrency'){
  if(inputf.test(event.target.value)){
    this.lCCurrency=true;     
  }​else{
    this.lCCurrency=false;     
  }
}
else if(formControlName=='lCIssuingDate'){
  if(inputf.test(event.target.value)){
    this.lCIssuingDate=true;     
  }​else{
    this.lCIssuingDate=false;     
  }
}
else if(formControlName=='lastShipmentDate'){
  if(inputf.test(event.target.value)){
    this.lastShipmentDate=true;     
  }​else{
    this.lastShipmentDate=false;     
  }
}
else if(formControlName=='negotiationDate'){
  if(inputf.test(event.target.value)){
    this.negotiationDate=true;     
  }​else{
    this.negotiationDate=false;     
  }
}
else if(formControlName=='goodsType'){
  if(inputf.test(event.target.value)){
    this.goodsType=true;     
  }​else{
    this.goodsType=false;     
  }
}
else if(formControlName=='otherType'){
  if(inputf.test(event.target.value)){
    this.otherType=true;     
  }​else{
    this.otherType=false;     
  }
}
}


}