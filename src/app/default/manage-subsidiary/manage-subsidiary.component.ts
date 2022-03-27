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
import { BusinessDetailsService } from 'src/app/services/business-details/business-details.service';
import { Business } from 'src/app/beans/business';


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
  noData:any=false;
  subsidiries:any;
  subuticount:any;
  available:any;
  nimaiCount:any;
  countryName: any="";
  countryCode: any;
  hasCountrycode: boolean=false;
  hideCancelBtn: boolean=false;
  tradeName: string;
  tradeSupport: string;
  trnxPendingMsg: string;
  filename: any;
  invalidFileMsg: string;
  imageSrc: string="";
  userid: any;
  businessDocumentList: any=[];
  count: number;
  hidecompanyName: boolean= false;
  hidebusiUpload: boolean= false;
  hidebusiDocument: boolean= false;
  hidebusiCountry: boolean= false;
  hidecity: boolean= false;
  hideaddressLine: boolean= false;
  hidepincode: boolean= false;
  hidetelephone: boolean= false;
  hideprovinceName: boolean= false;
  hidecountry: boolean= false;
  hideselector: boolean= false;
  submittedBusiDocument: boolean=false;
  submittedCountry: boolean=false;
  submittedBusiUpload: boolean=false;
  assError: any;
  companyNameLessThan: boolean;
  cancelMsg: string="Cancel";
  isHeader: boolean=true;
  constructor(public router: Router, public activatedRoute: ActivatedRoute,public bds: BusinessDetailsService, public kycService: KycuploadService, private formBuilder: FormBuilder, public fps: ForgetPasswordService, public signUpService: SignupService,public getCount: SubscriptionDetailsService) {
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
    selector: new FormControl('',[Validators.required]),
    companyName: new FormControl('',[Validators.required,Validators.minLength(3)]),
    country:new FormControl('',[Validators.required]),
    provinceName: new FormControl('',[Validators.required]),
    city:  new FormControl('',[Validators.required]),
    addressLine: new FormControl('',[Validators.required]),
    pincode: new FormControl('',[Validators.required,Validators.minLength(5),Validators.maxLength(6)]),
    telephone: new FormControl('',[Validators.required]),
    busiCountry: new FormControl('',[Validators.required]),
    busiDocument: new FormControl('',[Validators.required]),
    busiUpload: new FormControl('',[Validators.required]),
    isAssociated:[1]
    
  });

  reAssociateForm =this.formBuilder.group({
    reBusiCountry: new FormControl('',[Validators.required]),
    reBusiDocument: new FormControl('',[Validators.required]),
    reBusiUpload: new FormControl('',[Validators.required]),
    isAssociated:[1]

  })



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

  //$('#reuploadId').show();

    this.tradeName= environment.name;
    this.tradeSupport= environment.support;
   loads();
  // manageSub();
  // this.subsidiries=sessionStorage.getItem('subsidiries');  
  // this.subuticount=sessionStorage.getItem('subuticount');
  // this.available=this.subsidiries-this.subuticount
  this.listOfSubsidiary("All");
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

if(this.available==0){

}

        },  
      error => { }
    )
  }

  close() {
    this.associateForm.reset();
    this.reAssociateForm.reset();
    $("#addsub").hide();
    $('#associateSuccess').hide();
    this.router.navigateByUrl('/', {skipLocationChange: true}).then(() => {
      this.router.navigate([`/${this.subURL}/${this.parentURL}/manage-sub`]);
  });
  }
  showCountryCode(data){
    this.countryName = data.country;
    this.countryCode = data.code;
    if(this.countryCode){
      this.hasCountrycode=true;
    }
  }
  
  listOfSubsidiary(type){  
    let userID: string = sessionStorage.getItem('userID');
    this.signUpService.getSubsidiaryList(userID,type).subscribe(
      (response) => {
        custTrnsactionDetail();

        this.subsidiaryData = JSON.parse(JSON.stringify(response)).data;
        if(this.subsidiaryData.length === 0){
          this.noData = true;
        }else{
          this.noData = false;
        }
        
      },(error) =>{
        this.noData = true;
      }
      )
  }

  selectRegTypeSub(value: string) {
   this.listOfSubsidiary(value);
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
    this.associateForm.reset();
    this.reAssociateForm.reset();
    this.respMessage = "";
  }
  }

  closePopup(){
    
    $("#reuploadId").hide();
    $("#addsub").show();
  }
  reclosePopup(){
    
    $("#reuploadId").hide();
    $("#addsub").hide();

    this.router.navigateByUrl('/', {skipLocationChange: true}).then(() => {
      this.router.navigate([`/${this.subURL}/${this.parentURL}/manage-sub`]);
  });
  }
  
removeValidation(){
  this.manageSubForm.get('firstName').clearValidators();
  this.manageSubForm.get('lastName').clearValidators();
  this.manageSubForm.get('mobileNo').clearValidators();
  this.manageSubForm.get('emailId').clearValidators();
  this.manageSubForm.get('country').clearValidators();
  this.manageSubForm.get('mobileNo').clearValidators();
  this.manageSubForm.get('firstName').updateValueAndValidity();
  this.manageSubForm.get('lastName').updateValueAndValidity();
  this.manageSubForm.get('mobileNo').updateValueAndValidity();
  this.manageSubForm.get('emailId').updateValueAndValidity();
  this.manageSubForm.get('country').updateValueAndValidity();
  this.manageSubForm.get('mobileNo').updateValueAndValidity();

}

lessThan(){
  console.log($('#companyName').val().length)
  if( $('#companyName').val().length<3){
    this.companyNameLessThan=true
    return;
  }else{
    this.companyNameLessThan=false;
  }
}

checkData(data){


if(data=='hidecompanyName'){
  this.hidecompanyName=false; 
}if(data=='hideselector'){
  this.hideselector=false;
}if(data=='hidecountry'){
  this.hidecountry=false;
}if(data=='hideprovinceName'){
  this.hideprovinceName=false;
}if(data=='hidetelephone'){
  this.hidetelephone=false;
}if(data=='hidepincode'){
  this.hidepincode=false;
}if(data=='hidetelephone'){
  this.hidetelephone=false;
}if(data=='hideaddressLine'){
  this.hideaddressLine=false;
}if(data=='hidecity'){
  this.hidecity=false;
}if(data=='hidebusiDocument'){
  this.hidebusiDocument=false;
}if(data=='hidebusiCountry'){
  this.hidebusiCountry=false;
}


if(data=='submittedBusiDocument'){
  this.submittedBusiDocument=false;
}if(data=='submittedCountry'){
  this.submittedCountry=false;
}

 }

 public getBusinessData(): Business {

  let data = {
    isAssociated:1,
    userId: this.userid,
    bankName: "",
    branchName: "",
    swiftCode: "",
    telephone: this.associateForm.get('telephone').value,
    comapanyName: this.associateForm.get('companyName').value,
    designation:"",
    registeredCountry: this.countryName,
    registrationType: this.associateForm.get('selector').value,
    provinceName: this.associateForm.get('provinceName').value,
    address1: this.associateForm.get('addressLine').value,
    address2: "",
    address3: "",
    city: this.associateForm.get('city').value,
    pincode: this.associateForm.get('pincode').value,
    ownerMasterBean: [],
  };
  return data;
}
  onSubmitAssociate(){
this.removeValidation();

console.log($('#busiUpload').val())
console.log(this.associateForm.get('busiUpload').value)

if( !this.associateForm.get('companyName').value){
 this.hidecompanyName=true; 
  
}if( !this.associateForm.get('selector').value){
  this.hideselector = true;
  
}if( !this.associateForm.get('country').value){
  this.hidecountry = true;
  
}if( !this.associateForm.get('provinceName').value){
  this.hideprovinceName = true;
  
}if( !this.associateForm.get('telephone').value){
  this.hidetelephone = true;
 
}if( !this.associateForm.get('pincode').value){
  this.hidepincode = true;
  
}
if( !this.associateForm.get('telephone').value){
  this.hidetelephone = true;
  
}
if( !this.associateForm.get('addressLine').value){
  this.hideaddressLine = true;
 
}if( !this.associateForm.get('city').value){
  this.hidecity = true;
 
}if( !this.associateForm.get('busiCountry').value){
  this.hidebusiCountry = true;
 
}if( !this.associateForm.get('busiDocument').value){
  this.hidebusiDocument = true;
  }

 
if(!$('#busiUpload').val()){
  this.hidebusiUpload = true;
}

if($('#companyName').val() && $('#companyName').val().length<3){
  this.companyNameLessThan=true
  return;
}else{
  this.companyNameLessThan=false;
}


if(this.hideaddressLine || this.hidebusiCountry || this.hidebusiUpload || this.hidebusiDocument || this.hidecity || this.companyNameLessThan
  ||  this.hidepincode || this.hidetelephone || this.hideprovinceName || this.hidecountry || this.hideselector || this.hidecompanyName){
    return
  }
    // if (this.associateForm.invalid) {
    //   console.log(this.associateForm.value)
    //   this.associateForm.get('companyName').setValidators(Validators.required);
    //   return;
    // }
    this.submitted = false;

const data={
  addressLine: this.associateForm.get('addressLine').value,
  city: this.associateForm.get('city').value,
  companyName:this.associateForm.get('companyName').value,
countryName: this.countryName,
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
 

  if(res.status!=="Failure"){
    this.respMessage =res.errMessage
    this.userid=res.data.userId
    this.bds.updateBusinessDetails(this.getBusinessData(), this.userid).subscribe(
      (response) => {
        this.assError= JSON.parse(JSON.stringify(response)).errMessage
        if(this.assError !='Congratulations! Your account has been successfully updated'){
          $('#associateError').show();
        
             }
      })
  }else{
    this.respMessage =res.errMessage
   this.resetPopupAS();
   }


 


const param={
documentName: this.associateForm.get('busiDocument').value,
title: 'Business',
country: this.countryName,
encodedFileContent: this.imageSrc,
documentType: 'jpg'     
}

this.businessDocumentList.push(param);

var data = {
  "userId" : this.userid,
  "businessDocumentList": this.businessDocumentList,
  "personalDocumentList":[]
}
this.kycService.upload(data)
.subscribe(
  resp => {    
    this.associateForm.reset();
    this.associateForm.reset();
    this.reAssociateForm.reset();
  $('#associateSuccess').show();
  },
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
  // this.fps.sendEmailReferSubsidiary(fg)
  // .subscribe(
  //   (response) => {
  //     this.resetPopup();
  //     this.hideCancelBtn=true;
  //     this.respMessage = " You've successfully invited a subsidiary to join "+this.tradeName+". You will be notified once invitee complete the sign up process"
  //   },
  //   (error) => {
  //     this.resetPopup();
  //     this.respMessage = "Service not working! Please try again later."
  //   }
  // )
 }else{
  this.resetPopup();
  this.respMessage = res.errMessage;
 }

 },
 (error) => {
  let err= JSON.parse(JSON.stringify(error.error))

   if(err.errMessage==="Email Id already exists. Please try another email Address."){
//      this.isValidEmail=false;
this.resetPopup();

   }
   this.respMessage = err.errMessage
 }
)  }



reSubmitAssociate(){


if( !this.reAssociateForm.get('reBusiCountry').value){
  this.submittedCountry = true;
 
}if( !this.reAssociateForm.get('reBusiDocument').value){
  this.submittedBusiDocument = true;
  
}

console.log($('#reBusiUpload').val())
if(!$('#reBusiUpload').val()){
  this.submittedBusiUpload = true;
}
if(this.submittedBusiDocument || this.submittedBusiUpload ||  this.submittedCountry){
    return
  }





  const param={
    documentName: this.reAssociateForm.get('reBusiDocument').value,
    title: 'Business',
    country: this.reAssociateForm.get('reBusiCountry').value,
    encodedFileContent: this.imageSrc,
    documentType: 'jpg'     
    }
    
    this.businessDocumentList.push(param);
    
    var data = {
      "userId" : this.userid,
      "businessDocumentList": this.businessDocumentList,
      "personalDocumentList":[]
    }
    this.kycService.upload(data)
    .subscribe(
      resp => {
        $('#reuploadId').hide();
        let res= JSON.parse(JSON.stringify(resp))
          if(res.body.message)
      $('#associateSuccess').show();

      },
      err => {
       // this.failedError();
      });


}
closeAS(){
  this.respMessage="";
  $('#busiUpload').val('');
  this.deleteFileContent();
  this.manageSubForm.reset();
  this.associateForm.reset();
  this.reAssociateForm.reset();
  this.removeValidation();  
  $('#associateSuccess').hide();
}


closeAR(){

  $('#associateSuccess').hide();
  this.router.navigateByUrl('/', {skipLocationChange: true}).then(() => {
    this.router.navigate([`/${this.subURL}/${this.parentURL}/manage-sub`]);
});
}

reupload(id){
  this.userid=id;
  $('#reuploadId').show();
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
      isAssociated: 0,
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
   this.isHeader=false;
  this.cancelMsg="OK";
  $('#authemaildiv').slideUp();
  $('#paradiv').slideDown();
  $('#okbtn').show();
  $('#btninvite').hide();
  // $('.selection').hide();
  this.manageSubForm.reset();
  this.associateForm.reset();
  this.reAssociateForm.reset();
 }
 resetPopupAS(){
  this.isHeader=false;
   this.cancelMsg="OK";
  $('#authemaildivAS').slideUp();
  $('#kycdivAS').slideUp();
  $('#paradivAS').slideDown();
  $('#okbtnAS').show();
  $('#btninviteAssociate').hide();
  // $('.selection').hide();
  this.associateForm.reset();
  this.reAssociateForm.reset();
 }
 


 validateRegexFields(event, type){
   if('count'){

   }
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
console.log(this.filename)
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
  
  this.associateForm.get('busiUpload').setValue(this.imageSrc);
  console.log(this.associateForm.get('busiUpload').value)
}



selectFile(e) {

if($('#busiUpload').val()){
  this.hidebusiUpload=false;
}
if($('#reBusiUpload').val()){
  this.submittedBusiUpload=false;
}

this.associateForm.get('busiUpload').setValue(this.imageSrc);
  // $("#moreImageUploadLinkType").show();
  if(e.target.files.length==1)
  { 
   this.count=0;
 // this.itemData =this.associateForm.get('busiUpload').value;
  var file = e.dataTransfer ? e.dataTransfer.files[0] : e.target.files[0];
  var sizeInMb = file.size/1024;
  var sizeLimit= 1024*20;
  if (sizeInMb > sizeLimit) {  
  this.invalidFileMsg="File size should be less than 20MB";
  $('#busiUpload').val("");
  //this.invalidFileMsg1="";
      $('#invalidAssosiate').show();     
      return
  }
  this.filename=file.name;  
  if(this.filename.toLowerCase().indexOf(".jpg") !== -1 || this.filename.toLowerCase().indexOf(".jpeg") !== -1 || this.filename.toLowerCase().indexOf(".png") !== -1 ||
  this.filename.toLowerCase().indexOf(".pdf") !== -1 || this.filename.toLowerCase().indexOf(".tiff") !== -1 ){
   var reader = new FileReader();
     reader.onload = this._handleReaderLoaded.bind(this);
    reader.readAsDataURL(file);  
   // this.invalidFileMsg1=""   
  }else{
    this.invalidFileMsg="Kindly select pdf , png , jpeg or tiff File";      
    $('#busiUpload').val("");
  //this.invalidFileMsg1="";            
    $('#invalidAssosiate').show();         
    return
  } 
  this.invalidFileMsg="";
} 
  else{
    this.invalidFileMsg="You are not allowed to upload more one file";
    $('#busiUpload').val("");   
     $('#invalidAssosiate').show();  
    return
}
console.log($('#busiUpload').val)
}
invalidDateOk(){
  
  $('#invalidAssosiate').hide();

}
deleteFileContent(){    
  this.myInputVariable.nativeElement.value = "";  
  $('#busiUpload').val("");    
  $('#reBusiUpload').val(""); 
  this.associateForm.get('busiUpload').setValue('');
  uploadFileRefinance5();    

}

}
