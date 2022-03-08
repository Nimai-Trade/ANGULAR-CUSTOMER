import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Router, ActivatedRoute,NavigationExtras} from '@angular/router';
import { FormBuilder, Validators, FormControl, FormGroup } from '@angular/forms';
import * as $ from '../../../assets/js/jquery.min';
import { manageSub ,custTrnsactionDetail} from 'src/assets/js/commons'
import { ForgetPasswordService } from 'src/app/services/forget-password/forget-password.service';
import { loads } from '../../../assets/js/commons';
import { ValidateRegex } from 'src/app/beans/Validations';
import { formatDate } from '@angular/common';
import { SignupService } from 'src/app/services/signup/signup.service';
import { ResetPasswordService } from 'src/app/services/reset-password/reset-password.service';
import { SubscriptionDetailsService } from 'src/app/services/subscription/subscription-details.service';
import { environment } from 'src/environments/environment';
import { uploadFileRefinance5 } from 'src/assets/js/commons'
import { call } from '../../../assets/js/bootstrap-filestyle.min'
import { KycuploadService } from 'src/app/services/kyc-upload/kycupload.service';


@Component({
  selector: 'app-manage-subsidiary',
  templateUrl: './manage-subsidiary.component.html',
  styleUrls: ['./manage-subsidiary.component.css']
})
export class ManageSubsidiaryComponent implements OnInit {
  @ViewChild('myInput',{ static: true })
  myInputVariable: ElementRef;
  public parent: string;
  public isValidEmail=true;
  submitted: boolean = false;
  public parentURL: string = "";
  public subURL: string = "";
  respMessage: any;
  status:any;
  resp: any;
  subsidiaryData:any;
  noData:any;
  subsidiries:any;
  subuticount:any;
  available:any;
  nimaiCount:any;
  countryName: any;
  countryCode: any;
  hasCountrycode: boolean=false;
  hideCancelBtn: boolean=false;
  tradeName: string;
  tradeSupport: string;
  trnxPendingMsg: string;
  filename: any;
  invalidFileMsg: string;
  imageSrc: string;
  constructor(public router: Router, public activatedRoute: ActivatedRoute, public kycService: KycuploadService, private formBuilder: FormBuilder, public fps: ForgetPasswordService, public signUpService: SignupService,public getCount: SubscriptionDetailsService) {
    call();
    this.activatedRoute.parent.url.subscribe((urlPath) => {
      this.parentURL = urlPath[urlPath.length - 1].path;
    });
    this.activatedRoute.parent.parent.url.subscribe((urlPath) => {
      this.subURL = urlPath[urlPath.length - 1].path;
    })
    this.resp = JSON.parse(sessionStorage.getItem('countryData'));
  }
  manageSubForm = this.formBuilder.group({
    firstName: new FormControl('',[Validators.required]),
    lastName: new FormControl('',[Validators.required]),
    mobileNo: new FormControl('',[Validators.required,Validators.minLength(7)]),
    country: new FormControl('',[Validators.required]),
    landlineNo: new FormControl('',[Validators.minLength(7)]),
    emailId: new FormControl('', [Validators.required, Validators.pattern("^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,7}$")]),
    isAssociated:new FormControl(0),
  });

  associateForm = this.formBuilder.group({
    userId: sessionStorage.getItem('userID'),
    selector: ['', Validators.required],
    companyName: ['', Validators.required],
    country: ['', Validators.required],
    provinceName: ['',[Validators.required, Validators.pattern(/^(\s+\S+\s*)*(?!\s).*$/)]],
    city: ['', [Validators.required,Validators.minLength(2)]],
    addressLine: ['', [Validators.required,Validators.minLength(2)]],
    pincode: ['', [Validators.required,Validators.minLength(5),Validators.maxLength(6)]],
    telephone: ['',[Validators.required,Validators.minLength(7)]],
    busiCountry: ['', Validators.required], 
    busiDocument: ['', Validators.required], 
    busiUpload: ['', Validators.required], 
    isAssociated:[1]
    // businessDocumentList: this.formBuilder.array([]),  
    // businessDocumentList_html: this.formBuilder.array([this.getBusiList()]),
   // owners: this.formBuilder.array([this.getOwners()])
  });



  get manageSubDetails() {
    return this.manageSubForm.controls;
  }
  getBusiList(){
    return this.formBuilder.group({
    documentName: [''],
    title: ['Business'],
    country: [''],
    busiEncodedFileContent: ['', Validators.required],
    documentType: ['jpg']
  });
}

  ngOnInit() {
    this.tradeName= environment.name;
    this.tradeSupport= environment.support;
  loads();
  manageSub();
  // this.subsidiries=sessionStorage.getItem('subsidiries');  
  // this.subuticount=sessionStorage.getItem('subuticount');
  // this.available=this.subsidiries-this.subuticount
  this.listOfSubsidiary();
  this.getNimaiCount();
  }
  getNimaiCount() {
    let data = {
      "userid": sessionStorage.getItem('userID'),
      "emailAddress": ""
    }

    this.getCount.getTotalCount(data,sessionStorage.getItem('token')).subscribe(
      response => {
        this.nimaiCount = JSON.parse(JSON.stringify(response)).data;
        this.subsidiries=this.nimaiCount.subsidiries
        this.subuticount=this.nimaiCount.subuticount
        this.available=this.subsidiries-this.subuticount
        },  
      error => { }
    )
  }

  close() {
    // this.router.navigate([`/${this.subURL}/${this.parentURL}/manage-sub`]);
    $("#addsub").hide();
  }
  showCountryCode(data){
    this.countryName = data.country;
    this.countryCode = data.code;
    if(this.countryCode){
      this.hasCountrycode=true;
    }
  }
  
  listOfSubsidiary(){  
    let userID: string = sessionStorage.getItem('userID');
    this.signUpService.getSubsidiaryList(userID).subscribe(
      (response) => {
        custTrnsactionDetail();

        this.subsidiaryData = JSON.parse(JSON.stringify(response)).data;
        if(this.subsidiaryData.length === 0){
          this.noData = true;
        }
        
      },(error) =>{
        this.noData = true;
      }
      )
  }

  selectRegTypeSub(value: string) {

  }


  onOkClick(){    
    this.router.navigateByUrl('/', {skipLocationChange: true}).then(() => {
          this.router.navigate([`/${this.subURL}/${this.parentURL}/manage-sub`]);
      });
     // window.location.reload()
     // $("#addsub").hide();
  }
  pendingOkBtn(){
    $('#txnPendingSub').hide();
  }
  addSubsidiary() {

    $('.new').hide();
    $('.selection').hide();
    $('.same').hide();
    $('.new').slideUp();
    $('.same').slideUp();
    $('#planUnlimited').show();
    $("#newid"). prop("checked", true);
    // this.titleService.loading.next(true);
    $(document).ready(function () {
      // if(planType == "unlimited"){
      //   $('.same').show();
      //   $('.selection').hide();
      //   $('#planUnlimited').hide();
      // }else{
        $('.new').show();
        $('.selection').show();
        // $('#planUnlimited').show();
      // }
      $('input[type="radio"]').click(function () {
        // sd.loading = true;
        var inputValue = $(this).attr("value");
        if (inputValue == 'new') {
          $('.new').slideDown();
          $('.same').slideUp();
        }
        else {
          $('.new').slideUp();
          $('.same').slideDown();
        }
      })
    })


    if(sessionStorage.getItem('paymentstatus').toLowerCase()=="pending")
{
  this.trnxPendingMsg="Your payment is sent for approval. It usually takes up to 48 hours to approve the payment. For more clarification contact us at "+this.tradeSupport
  $("#txnPendingSub").show() ; 
}else{
   $("#addsub").show();
    this.manageSubForm.reset();
    this.respMessage = "";
  }
  }
  onSubmitAssociate(){

const data={
  addressLine: this.associateForm.get('addressLine').value,
  city: this.associateForm.get('city').value,
  companyName:this.countryName,
country: this.countryName,
isAssociated: 1,
pincode: this.associateForm.get('pincode').value,
provinceName: this.associateForm.get('provinceName').value,
selector: this.associateForm.get('selector').value,
telephone: this.associateForm.get('telephone').value,
userId: sessionStorage.getItem('userID'),
subscriberType: 'customer',
emailAddress:"",
firstName: "",
lastName:  "",
mobileNum:  "",
landLinenumber:  "",
designation: '',
businessType: '',
bankType: 'customer',
minLCValue: '0',
interestedCountry: [],
blacklistedGoods: [],
beneInterestedCountry:[],
account_source: sessionStorage.getItem('userID'),
account_type: "SUBSIDIARY",
account_status: "ACTIVE",
account_created_date: formatDate(new Date(), "yyyy-MM-dd'T'HH:mm:ss.SSSZ", 'en-US'),
regCurrency: "",
emailAddress1: "",
emailAddress2: "",
emailAddress3: "",
otherType:'',
otherTypeBank:'',


}



this.signUpService.signUpAssociate(data).subscribe((response) => {
    
  let res= JSON.parse(JSON.stringify(response))
  this.respMessage =res.errMessage


  
this.kycService.upload(this.associateForm.value)
.subscribe(
  resp => {    
  $('#accountReview').show();

  }
  
   
  ,
  err => {
   // this.failedError();
  });
  const fg = {
    "emailId": this.manageSubForm.get('emailId').value,
    "event": 'ADD_SUBSIDIARY',
    "userId": sessionStorage.getItem('userID')
    //"referenceId":res.data.reId
  }
  if(res.status!=="Failure"){
  this.fps.sendEmailReferSubsidiary(fg)
  .subscribe(
    (response) => {
      this.resetPopup();
      this.hideCancelBtn=true;
      this.respMessage = " You've successfully invited a subsidiary to join "+this.tradeName+". You will be notified once invitee complete the sign up process"
    },
    (error) => {
      this.resetPopup();
      this.respMessage = "Service not working! Please try again later."
    }
  )
 }else{
  this.resetPopup();
  this.respMessage = res.errMessage;
 }

 },
 (error) => {
  let err= JSON.parse(JSON.stringify(error.error))
 //  this.resetPopup();

   if(err.errMessage==="Email Id already exists. Please try another email Address."){
//      this.isValidEmail=false;
this.resetPopup();

   }
   this.respMessage = err.errMessage
 }
)


  }

  onSubmit() {
    this.submitted = true;
    if (this.manageSubForm.invalid) {
      return;
    }
    this.submitted = false;

    let data = {
      firstName: this.manageSubForm.get('firstName').value,
      lastName: this.manageSubForm.get('lastName').value,
      emailAddress: this.manageSubForm.get('emailId').value,
      mobileNum: this.manageSubForm.get('mobileNo').value,
      countryName: this.countryName,
      landLinenumber: this.manageSubForm.get('landlineNo').value,
      companyName: '',
      designation: '',
      businessType: '',
      userId: "",
      bankType: 'customer',
      subscriberType: 'customer',
      minLCValue: '0',
      interestedCountry: [],
      blacklistedGoods: [],
      beneInterestedCountry:[],
      account_source: sessionStorage.getItem('userID'),
      account_type: "SUBSIDIARY",
      account_status: "ACTIVE",
      account_created_date: formatDate(new Date(), "yyyy-MM-dd'T'HH:mm:ss.SSSZ", 'en-US'),
      regCurrency: "",
      emailAddress1: "",
      emailAddress2: "",
      emailAddress3: "",
      otherType:'',
      otherTypeBank:'',
    }


    this.signUpService.signUp(data).subscribe((response) => {
    
    let res= JSON.parse(JSON.stringify(response))
    this.respMessage =res.errMessage
    const fg = {
      "emailId": this.manageSubForm.get('emailId').value,
      "event": 'ADD_SUBSIDIARY',
      "userId": sessionStorage.getItem('userID')
      //"referenceId":res.data.reId
    }
    if(res.status!=="Failure"){
    this.fps.sendEmailReferSubsidiary(fg)
    .subscribe(
      (response) => {
        this.resetPopup();
        this.hideCancelBtn=true;
        this.respMessage = " You've successfully invited a subsidiary to join "+this.tradeName+". You will be notified once invitee complete the sign up process"
      },
      (error) => {
        this.resetPopup();
        this.respMessage = "Service not working! Please try again later."
      }
    )
   }else{
    this.resetPopup();
    this.respMessage = res.errMessage;
   }

   },
   (error) => {
    let err= JSON.parse(JSON.stringify(error.error))
   //  this.resetPopup();
  
     if(err.errMessage==="Email Id already exists. Please try another email Address."){
//      this.isValidEmail=false;
this.resetPopup();

     }
     this.respMessage = err.errMessage
   }
  )
 }
 resetPopup(){
  $('#authemaildiv').slideUp();
  $('#paradiv').slideDown();
  $('#okbtn').show();
  $('#btninvite').hide();
  this.manageSubForm.reset();
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
  }else if(type=="name_validation"){
    var key = event.keyCode;
    if (!((key >= 65 && key <= 90) || key == 8/*backspce*/ || key==46/*DEL*/ || key==9/*TAB*/ || key==37/*LFT ARROW*/ || key==39/*RGT ARROW*/ || key==222/* ' key*/ || key==189/* - key*/ || key==32/* space key*/)) {
        event.preventDefault();
    }    
  }
}





 
handleFileInputSA(e) {    
  var file = e.dataTransfer ? e.dataTransfer.files[0] : e.target.files[0];
  var sizeInMb = file.size/1024;
  var sizeLimit= 1024*20;
  
this.filename=file.name;
this.associateForm.get('busiUpload').setValue(this.filename);
  if (sizeInMb > sizeLimit) {
  //alert('File size should be less than 20MB')
  this.invalidFileMsg="File size should be less than 20MB";
  $('#invalidFileOthers').show();
  $('#busiUpload').val("");
  this.associateForm.get('busiUpload').setValue('');
  return
  }
  if(this.filename.toLowerCase().indexOf(".jpg") !== -1 || this.filename.toLowerCase().indexOf(".jpeg") !== -1 || this.filename.toLowerCase().indexOf(".png") !== -1 ||
  this.filename.toLowerCase().indexOf(".pdf") !== -1 || this.filename.toLowerCase().indexOf(".tiff") !== -1 ){
    var reader = new FileReader();
        reader.onload = this._handleReaderLoaded.bind(this);
        reader.readAsDataURL(file);
  }else{
    this.associateForm.get('busiUpload').setValue('')
          this.invalidFileMsg="Kindly select jpg, jpeg, png, pdf, tiff File";      
         // $('#busiUpload').val("");              
          $('#invalidFileOthers').show();    
          return
        } 
}
_handleReaderLoaded(e) {
  let reader = e.target;
  this.imageSrc =this.filename +" |" + reader.result;
  
  console.log(this.imageSrc)
  this.associateForm.get('busiUpload').setValue(this.imageSrc);
}



deleteFileContent(){    
  console.log('de') 
  this.myInputVariable.nativeElement.value = "";  
  $('#busiUpload').val("");    
  this.associateForm.get('busiUpload').setValue('');
  uploadFileRefinance5();    

}

}
