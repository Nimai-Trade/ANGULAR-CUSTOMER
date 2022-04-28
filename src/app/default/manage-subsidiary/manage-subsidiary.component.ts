import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Router, ActivatedRoute,NavigationExtras} from '@angular/router';
import { FormBuilder, Validators, FormControl, FormGroup, FormArray } from '@angular/forms';
import * as $ from '../../../assets/js/jquery.min';
import { manageSub ,custTrnsactionDetail} from 'src/assets/js/commons'
import { ForgetPasswordService } from 'src/app/services/forget-password/forget-password.service';
import { loads } from '../../../assets/js/commons';
import { ValidateRegex } from 'src/app/beans/Validations';
import { formatDate } from '@angular/common';
import { SignupService } from 'src/app/services/signup/signup.service';
import { uploadFileRefinance5 } from 'src/assets/js/commons'

import { ResetPasswordService } from 'src/app/services/reset-password/reset-password.service';
import { SubscriptionDetailsService } from 'src/app/services/subscription/subscription-details.service';
import { environment } from 'src/environments/environment';
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
  public manageSubForm: FormGroup;
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
  adds: any;
  imageSrc: string="";
  filename: any;
  results: any;
  isError: boolean=false;
  list: any;
  inviteList: any[]=[];
  userId: string;
  extension: string;
  files: any;
  errMsg: string;
  userid: any;
  businessDocumentList: any=[];
  invalidFileMsg: string;
  constructor(public router: Router, public kycService: KycuploadService,public activatedRoute: ActivatedRoute, private formBuilder: FormBuilder, public fps: ForgetPasswordService, 
    public signUpService: SignupService,public getCount: SubscriptionDetailsService) {
    this.activatedRoute.parent.url.subscribe((urlPath) => {
      this.parentURL = urlPath[urlPath.length - 1].path;
    });
    this.activatedRoute.parent.parent.url.subscribe((urlPath) => {
      this.subURL = urlPath[urlPath.length - 1].path;
    })
    this.resp = JSON.parse(sessionStorage.getItem('countryData'));
    
    const items = [];
    items.push(this.formBuilder.group({      
        companyName:['',Validators.required],
        registrationType:['',Validators.required],
        country:['',Validators.required],
        state:['',Validators.required],
        city:['',Validators.required],
        address:['',Validators.required],
        zipcode:['',Validators.required],
        telephone:['',Validators.required],
        kycCountry:['',Validators.required],
        validDocument:['',Validators.required],
        uploadDocument:['',Validators.required],
     //   parentUserId:[sessionStorage.getItem('userID')]
    }));
    
    this.manageSubForm = this.formBuilder.group({
      details: this.formBuilder.array( items )
  });
  }
  reAssociateForm =this.formBuilder.group({
    reBusiCountry: new FormControl('',[Validators.required]),
    reBusiDocument: new FormControl('',[Validators.required]),
    reBusiUpload: new FormControl('',[Validators.required]),
    isAssociated:[1]

  })
  // manageSubForm = this.formBuilder.group({
  //   firstName: new FormControl('',[Validators.required]),
  //   lastName: new FormControl('',[Validators.required]),
  //   mobileNo: new FormControl('',[Validators.required,Validators.minLength(7)]),
  //   country: new FormControl('',[Validators.required]),
  //   landlineNo: new FormControl('',[Validators.minLength(7)]),
  //   emailId: new FormControl('', [Validators.required, Validators.pattern("^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,7}$")])
  // });

  get manageSubDetails() {
    return this.manageSubForm.controls;
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
  
  listOfSubsidiary(){  
    let userID: string = sessionStorage.getItem('userID');
    this.signUpService.getSubsidiaryList(userID,"All").subscribe(
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
  onOkClick(){    
    this.router.navigateByUrl('/', {skipLocationChange: true}).then(() => {
          this.router.navigate([`/${this.subURL}/${this.parentURL}/manage-sub`]);
      });
     // window.location.reload()
     // $("#addsub").hide();
  }
  pendingOkBtn(){
    $('#txnPendingSub').hide();
  //   this.router.navigateByUrl('/', {skipLocationChange: true}).then(() => {
  //     this.router.navigate([`/${this.subURL}/${this.parentURL}/manage-sub`]);
  // });
  }
  addSubsidiary() {
if(this.subsidiries-this.subuticount==0)
{
  this.errMsg="Renew"
  this.trnxPendingMsg="You had no / reached Maximum Subsidiary Count. Please Renew Your Subscription."
  $("#txnPendingSub").show() ; 
}else if(sessionStorage.getItem('paymentstatus').toLowerCase()=="pending")
{
  this.errMsg="Transaction Pending"
  this.trnxPendingMsg="Your payment is sent for approval. It usually takes up to 48 hours to approve the payment. For more clarification contact us at "+this.tradeSupport
  $("#txnPendingSub").show() ; 
}else{
   $("#addsub").show();
    this.manageSubForm.reset();
    this.respMessage = "";
  }
  }


  handleFileProForma(e,item){
    var file = e.dataTransfer ? e.dataTransfer.files[0] : e.target.files[0];
    var pattern = /image-*/;
    var reader = new FileReader();
this.filename=file.name;
var ext = this.filename.split("."); 
this.extension=ext[1];


if(this.filename.toLowerCase().indexOf(".jpg") !== -1 || this.filename.toLowerCase().indexOf(".jpeg") !== -1 || this.filename.toLowerCase().indexOf(".png") !== -1 ||
    this.filename.toLowerCase().indexOf(".pdf") !== -1 || this.filename.toLowerCase().indexOf(".tiff") !== -1 ){
     var reader = new FileReader();
    
      
      
      reader.onload = this._handleReaderLoadedForma.bind(this);
      reader.readAsDataURL(file);
      console.log(item)
      this.results=item;
  
    }else{
    
      this.invalidFileMsg="Kindly select pdf, png, jpeg or tiff File";      
      $('#uploadDocument').val("");  
      $('#invalidFile').show();         

      return
    } 

  }
  _handleReaderLoadedForma(e) {
    let reader = e.target;
    this.imageSrc = this.filename +" |" + reader.result;
   //this.results.get('details').setValue('uploadDocument '+this.imageSrc);

  this.results.setControl('uploadDocument',  new FormControl(this.imageSrc));
  }

  invalidDateOk(){
  
  
    $('#invalidFile').hide();
    this.deleteFileContent();

  }
  reupload(id){
    this.userid=id;
    $('#reuploadId').show();
  }

  reSubmitAssociate(){


    // if( !this.reAssociateForm.get('reBusiCountry').value){
    //   this.submittedCountry = true;
     
    // }if( !this.reAssociateForm.get('reBusiDocument').value){
    //   this.submittedBusiDocument = true;
      
    // }
    
    console.log($('#reBusiUpload').val())
    // if(!$('#reBusiUpload').val()){
    //   this.submittedBusiUpload = true;
    // }
    // if(this.submittedBusiDocument || this.submittedBusiUpload ||  this.submittedCountry){
    //     return
    //   }
    
    
    
    
    
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
      $('#associateSuccess').hide();
      this.router.navigateByUrl('/', {skipLocationChange: true}).then(() => {
        this.router.navigate([`/${this.subURL}/${this.parentURL}/manage-sub`]);
    });
    }
    
    
    closeAR(){
    
      $('#associateSuccess').hide();
      this.router.navigateByUrl('/', {skipLocationChange: true}).then(() => {
        this.router.navigate([`/${this.subURL}/${this.parentURL}/manage-sub`]);
    });
    }
  onSubmit() {
    this.submitted = true;
    if (this.manageSubForm.invalid) {
      console.log(this.manageSubForm.value)
     this.isError=true
      return;
    }
    this.submitted = false;
    this.isError=false

this.list=this.manageSubForm.get('details').value;
   this.userId=sessionStorage.getItem('userID')
  
    this.list.forEach(element => {
    
      this.files=element.uploadDocument;
var ext = this.files.split(" |",2); 
var str=ext[0].split(".",2);
this.extension=str[1];
console.log(this.extension)
      let data={
        "companyName":element.companyName,
        "registrationType":element.registrationType,
        "country":element.country,
        "state":element.state,
        "city":element.city,
        "address":element.address,
        "zipcode":element.zipcode,
        "telephone":element.telephone,
        "kycCountry":element.kycCountry,
        "validDocument":element.validDocument,
        "uploadDocument":element.uploadDocument,
        "docType":this.extension,
       // "parentUserId":element.parentUserId
      }
      this.inviteList.push(data);
});

console.log(JSON.stringify(this.inviteList));

   

    this.signUpService.registerAssociate(JSON.stringify(this.inviteList),sessionStorage.getItem('userID')).subscribe(
      (response) => {
     console.log(response)
     if(JSON.parse(JSON.stringify(response)).status=="Success"){
      // this.trnxPendingMsg="Your payment is sent for approval. It usually takes up to 48 hours to approve the payment. For more clarification contact us at "+this.tradeSupport
      this.trnxPendingMsg="you have successfully added group companies!"

      this.errMsg="Success"
      $("#txnPendingSub").show() ; 
     }
     if(JSON.parse(JSON.stringify(response)).status=="Failure"){
      this.errMsg="Error"
      this.trnxPendingMsg=JSON.parse(JSON.stringify(response)).errMessage
            $("#txnPendingSub").show() ; 
     }
    }),
    (error)=>{
      console.log(JSON.parse(JSON.stringify(error)).errMessage)
      console.log((error).errMessage)
      this.errMsg="Error"
      this.trnxPendingMsg=JSON.parse(JSON.stringify(error)).errMessage
      $("#txnPendingSub").show() ; 
    }


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
deleteFileContent1(i: any){

  console.log("delete file:..", i)
  let items = this.manageSubForm.get('details') as FormArray;
    items.removeAt(i);

}
deleteFileContent(){    
  this.myInputVariable.nativeElement.value = "";  
  $('#busiUpload').val("");    
  $('#reBusiUpload').val(""); 
  //this.associateForm.get('busiUpload').setValue('');
  uploadFileRefinance5();    

}

addUser(){
  loads();
  manageSub();
  const details = this.manageSubForm.get('details') as FormArray;
      

      //  let items = this.manageSubForm.get('details') as FormArray;
        if (details.length < 10)
        {
          details.push(this.createItem());
        }
      

    }
    _handleReaderLoaded(e) {
      let reader = e.target;
      this.imageSrc =this.filename +" |" + reader.result;
      
    }

handleFileInputSA(e) {  
  debugger  
  var file = e.dataTransfer ? e.dataTransfer.files[0] : e.target.files[0];
  var sizeInMb = file.size/1024;
  var sizeLimit= 1024*20;
  
this.filename=file.name;

  // if(this.filename.toLowerCase().indexOf(".jpg") !== -1 || this.filename.toLowerCase().indexOf(".jpeg") !== -1 || this.filename.toLowerCase().indexOf(".png") !== -1 ||
  // this.filename.toLowerCase().indexOf(".pdf") !== -1 || this.filename.toLowerCase().indexOf(".tiff") !== -1 ){
    var reader = new FileReader();
        reader.onload = this._handleReaderLoaded.bind(this);
        reader.readAsDataURL(file);
  // }else{
  //   this.reAssociateForm.get('busiUpload').setValue('')
  //         this.invalidFileMsg="Kindly select jpg, jpeg, png, pdf, tiff File";      
  //        // $('#busiUpload').val("");              
  //         $('#invalidFileOthers').show();    
  //         return
  //       } 
}
    createItem(): FormGroup {
        return this.formBuilder.group({
          companyName:[''],
          registrationType:[''],
          country:[''],
          state:[''],
          city:[''],
          address:[''],
          zipcode:[''],
          telephone:[''],
          kycCountry:[''],
          validDocument:[''],
          uploadDocument:[''],
      //    parentUserId:[sessionStorage.getItem("userID")]
        });
    }
}
