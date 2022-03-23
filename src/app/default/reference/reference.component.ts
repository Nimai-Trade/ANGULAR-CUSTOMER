import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, NavigationExtras } from '@angular/router';
import { FormBuilder, Validators, FormControl } from '@angular/forms';
import * as $ from 'src/assets/js/jquery.min';
import { manageSub } from 'src/assets/js/commons'
import { ValidateRegex } from 'src/app/beans/Validations';
import { ForgetPasswordService } from 'src/app/services/forget-password/forget-password.service';
import { formatDate } from '@angular/common';
import { ReferService } from 'src/app/services/refer/refer.service';
import { loads} from '../../../assets/js/commons'
import {removeDoubleScroll} from 'src/assets/js/commons'
import { SignupService } from 'src/app/services/signup/signup.service';
import { TitleService } from 'src/app/services/titleservice/title.service';
import { environment } from 'src/environments/environment';
@Component({
  selector: 'app-reference',
  templateUrl: './reference.component.html',
  styleUrls: ['./reference.component.css']
})
export class ReferenceComponent implements OnInit {

  public parent: string;
  submitted: boolean = false;
  public parentURL: string = "";
  public subURL: string = "";
  CompanyName: any;
  getCurrentDate: any;
  showBranchUserId: boolean = false;
  resp: any;
  
  date: Date = null;
  referViewDetails : any;
  respMessage: string;
  total_references:number;
  total_earning:number;
  responseData: any;
  isActiveRefer: boolean=false;
  data: any="";
  public detailInfo: string = "";
  userRId: string="";
  expiration_date: number;
  queryDate: any;
  hideresend: boolean;
  countryCode: any;
  countryName: any;
  hasCountrycode: boolean;
  tradeName: string;
  isFieo: boolean=true;
  isRxil: boolean=true;
  
  constructor(public titleService: TitleService,public router: Router, public activatedRoute: ActivatedRoute, private formBuilder: FormBuilder, public fps: ForgetPasswordService, public service:ReferService, public signUpService: SignupService) {

    this.activatedRoute.parent.url.subscribe((urlPath) => {
      this.parentURL = urlPath[urlPath.length - 1].path;
    });
    this.activatedRoute.parent.parent.url.subscribe((urlPath) => {
      this.subURL = urlPath[urlPath.length - 1].path;
    })
    this.getCurrentDate = formatDate(new Date(), 'yyyy-MM-dd', 'en'); 

    if(sessionStorage.getItem('userID').startsWith('BC')){
      this.showBranchUserId = true;
    }
    this.resp = JSON.parse(sessionStorage.getItem('countryData'));

  }

  referForm = this.formBuilder.group({
    userId: sessionStorage.getItem('userID'),
    // referenceId: new FormControl(''),
    firstName: new FormControl('', [Validators.required]),
    lastName: new FormControl('', [Validators.required]),
    mobileNo: ['', [Validators.required,Validators.minLength(7)]],
    emailAddress: new FormControl('', [Validators.required, Validators.pattern("^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,7}$")]),
    countryName: new FormControl('', [Validators.required]),
    companyName: new FormControl('', [Validators.required]),
    status: new FormControl('ACTIVE'),
    insertedDate: this.getCurrentDate,
    modifiedDate: this.getCurrentDate,
    branchUserId: new FormControl(''),
    insertedBy: new FormControl({fieldName:'firstName'}),
    modifiedBy: new FormControl({fieldName:'firstName'}),
    landlineNo:new FormControl('',Validators.minLength(7)),
  });

  get referDetails() {
    return this.referForm.controls;
  }

  ngOnInit() {
    if(sessionStorage.getItem('isFieo')=="FIEO" || sessionStorage.getItem('isFieo')=="RXIL"){
      this.isFieo=false;
    }else{
      this.isFieo=true;
    }
  
   
    this.tradeName= environment.name;
    loads();

    this.total_earning=0;
    var emailid=""
    if(sessionStorage.getItem('branchUserEmailId')){
      emailid=sessionStorage.getItem('branchUserEmailId')
    }else{
      emailid=sessionStorage.getItem('custUserEmailId')
    }
    this.viewReferDetails(sessionStorage.getItem('userID'), emailid);
    
    this.activatedRoute.parent.url.subscribe((urlPath) => {
      this.parentURL = urlPath[urlPath.length - 1].path;
    });
    this.activatedRoute.parent.parent.url.subscribe((urlPath) => {
      this.subURL = urlPath[urlPath.length - 1].path;
    })
    if(sessionStorage.getItem('isFieo')=="RXIL"){
      this.isRxil=false;
    }
  }



  close() {
    $("#addsubref").hide();
    this.referForm.reset();
    this.onOkClick();
  }
  close_details(){
    $("#referDetail").hide();
  }
  close_successmsg(){
    $("#successResend1").hide();
  }
  onOkClick(){
    this.router.navigateByUrl('/', {skipLocationChange: true}).then(() => {
          this.router.navigate([`/${this.subURL}/${this.parentURL}/reference`]);
      });
      $("#addsubref").hide();
  }

  addRefer() {
    
    $("#okbtn").hide();
    $("#addsubref").show();
    this.referForm.reset();
    this.respMessage = "";
  }
  onSubmit() {
    //alert("1")
    this.submitted = true;
    if (this.referForm.invalid) {
      return;
    }
    const data = {
      referrer_Email_Id:sessionStorage.getItem('branchUserEmailId'),
      userId: sessionStorage.getItem('userID'),
      // referenceId: this.referForm.get('referenceId').value,
      firstName: this.referForm.get('firstName').value,
      lastName: this.referForm.get('lastName').value,
      mobileNo: this.referForm.get('mobileNo').value,
      landlineNo:this.referForm.get('landlineNo').value,
      emailAddress: this.referForm.get('emailAddress').value,
      countryName: this.countryName,
      companyName: this.referForm.get('companyName').value,
      status: 'ACTIVE',
      insertedDate: this.getCurrentDate,
      modifiedDate: this.getCurrentDate,
      branchUserId: 'TEST',//this.referForm.get('branchUserId').value,
      insertedBy: this.referForm.get('firstName').value,
      modifiedBy: this.referForm.get('firstName').value
    }  
    
    let request = {
      isAssociated: 0,
      firstName: this.referForm.get('firstName').value,
      lastName: this.referForm.get('lastName').value,
      emailAddress: this.referForm.get('emailAddress').value,
      mobileNum: this.countryCode+this.referForm.get('mobileNo').value,
      countryName: this.countryName,
      landLinenumber: this.referForm.get('landlineNo').value,
      companyName: this.referForm.get('companyName').value,
      otherTypeBank:'',
      designation: '',
      businessType: '',
      userId: sessionStorage.getItem('userID'),
      bankType: 'customer',
      subscriberType: 'customer',
      otherType:'',
      minLCValue: '0',
      interestedCountry: [],
      blacklistedGoods: [],
      beneInterestedCountry:[],
      account_source: sessionStorage.getItem('userID'),
      account_type: "REFER",
      account_status: "ACTIVE",
      account_created_date: formatDate(new Date(), "yyyy-MM-dd'T'HH:mm:ss.SSSZ", 'en-US'),
      regCurrency: "",
      emailAddress1: "",
      emailAddress2: "",
      emailAddress3: ""

    }
    
    this.submitted = false;
    this.CompanyName = this.referForm.get('companyName').value;
    this.signUpService.signUp(request).subscribe((response) => {

    this.service.addRefer(data)
      .subscribe(
        (response) => {
          let res = JSON.parse(JSON.stringify(response));
          
          const fg = {
            "emailId": this.referForm.get('emailAddress').value,
            "event": 'ADD_REFER',
            "userId": sessionStorage.getItem('userID'),
            "referenceId":res.data.reId
          }
          this.fps.sendEmailReferSubsidiary(fg)
            .subscribe(
              (response) => {
                this.resetPopup();

                this.respMessage = "You've successfully invited a corporate to join "+this.tradeName+". You will be notified once corporate completes the signup process."
              },
              (error) => {
                this.resetPopup();
                this.respMessage = "Service not working! Please try again later."
              }
            )
        },
        (error) => {
          this.resetPopup();
          this.respMessage = "Service not working! Please try again later."
        }
      )},
      (error) => {
        $('#authemaildiv').slideDown();
        $('#paradiv').slideDown();
        $('#okbtn').hide();
        $('#btninvite').show();  
        this.respMessage = JSON.parse(JSON.stringify(error.error)).errMessage;
      }
    )


  }

  resetPopup(){
    $('#authemaildiv').slideUp();
    $('#paradiv').slideDown();
    $('#okbtn').show();
    $('#btninvite').hide();
    this.referForm.reset();
  }

  validateRegexFields(event, type) {
    var key = event.keyCode;
    if (type == "number") {
      ValidateRegex.validateNumber(event);
    }
    else if (type == "alpha") {
      ValidateRegex.alphaOnly(event);
    }
    else if (type == "alphaNum") {
      ValidateRegex.alphaNumeric(event);
    }else if(type=="name_validation"){
      if (!((key >= 65 && key <= 90)|| key==32/*SPACE*/ || key == 8/*backspce*/ || key==46/*DEL*/ || key==9/*TAB*/ || key==37/*LFT ARROW*/ || key==39/*RGT ARROW*/ || key==222/* ' key*/ || key==189/* - key*/)) {
          event.preventDefault();
      }    
    }else if(type=="mobile_number"){
      if (key!= 43 && key > 31 && (key < 48 || key > 57)) {
        event.preventDefault();
    }
    }
  }
  addDays(date: Date, days: number): Date {
    date.setDate(date.getDate() + days);
    return date;
}
  viewReferDetails(userID: string,email: string) {
 
    this.service.getRegisterUsers(userID,email)
      .subscribe(
        (response) => {
          this.responseData = JSON.parse(JSON.stringify(response)).list;
      
          manageSub();
         for(this.queryDate of this.responseData)
              {
              
                this.date= new Date((new Date(this.queryDate.insertedDate)).getTime() + (60*60*24* 30000));
              let formatedDate = formatDate(new Date(this.date), "yyyy-MM-dd", 'en-US');

                if(this.getCurrentDate==formatedDate){
                    this.hideresend=true;

                }else{
                  this.hideresend=false;
                
                }
              }

           

      
        },
        (error) => {}
      )
  }
  openNav3() {
    document.getElementById("myCanvasNav").style.width = "100%";
    document.getElementById("myCanvasNav").style.opacity = "0.6";
  }
  closeOffcanvas() {
    document.getElementById("referDetail").style.width = "0%";
    document.getElementById("myCanvasNav").style.width = "0%";
    document.getElementById("myCanvasNav").style.opacity = "0";
  }
  openOffcanvas() {
      document.getElementById("referDetail").style.width = "600px";
  
  } 
  showDetail(data: any) {
      this.isActiveRefer = true;
    this.titleService.quote.next(true);
    removeDoubleScroll()
  
    this.service.getRegisterUserByUserId(data.userid).subscribe(
      (response) => {
        this.detailInfo = JSON.parse(JSON.stringify(response));
        this.data = this.detailInfo[0];

        // this.viewData=this.detailInfo;
        // if(this.viewData.lcProForma==null || this.viewData.lcProForma=="" || this.viewData.lcProForma==undefined){
        //   this.noFileDisable=false;
        //   this.viewDisable=true;
    
        //  }else{
        //   this.viewDisable=false;
        //   this.noFileDisable=true;
        //  }
      }, (error) => {
        //this.hasNoRecord = true;
      }
    )

  }
 
  resend(data){
    this.userRId=data.userid;
    $('#successResend').show();
    
    }

    closeResend(){
      $('#successResend').hide();
    }
  
successResend(){
  const param = {
    "emailId": sessionStorage.getItem('custUserEmailId'),
    "event": 'ADD_REFER',
    "userId": this.userRId,
    "referenceId":""
  }
  this.fps.sendEmailReferSubsidiary(param).subscribe((response)=>{
    if(response.message=='Email Send Succefully'){
 $('#successResend').hide();
 $('#successResend1').show();

    }
  })
}

showCountryCode(data){
  this.countryName = data.country;
  console.log(data.code)
  this.countryCode = data.code;
  if(this.countryCode){
    this.hasCountrycode=true;
  }
}

}

