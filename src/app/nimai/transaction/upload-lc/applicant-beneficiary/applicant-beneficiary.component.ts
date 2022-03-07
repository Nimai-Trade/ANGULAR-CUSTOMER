import { Component, OnInit, Input,ElementRef, ViewChild } from '@angular/core';
import  { ValidateRegex } from '../../../../beans/Validations';
import * as $ from 'src/assets/js/jquery.min';
import { LoginService } from 'src/app/services/login/login.service';
import { FormGroup, FormControl, FormBuilder } from '@angular/forms';
import {Validators} from '@angular/forms';
import { selectBox } from 'src/assets/js/commons';
import { DropDownListComponent } from '@syncfusion/ej2-angular-dropdowns';
import { SubscriptionDetailsService } from 'src/app/services/subscription/subscription-details.service';
import { PersonalDetailsService } from 'src/app/services/personal-details/personal-details.service';
import { MatSelect, MatTableDataSource } from '@angular/material';
@Component({
  selector: 'app-applicant-beneficiary',
  templateUrl: './applicant-beneficiary.component.html',
  styleUrls: ['./applicant-beneficiary.component.css']
})
export class ApplicantBeneficiaryComponent implements OnInit {
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
  constructor( public getCount: SubscriptionDetailsService , public psd: PersonalDetailsService,public loginService: LoginService,private el: ElementRef,public fb: FormBuilder) { 
    this.LcDetail = this.fb.group({
     
      swiftCode: ['', Validators.required],
     
           
      applicantName:['', Validators.required],
      applicantCountry:[''],
  
      beneName:[''],
      beneBankCountry:['', Validators.required],
      beneBankName:['', Validators.required],
      beneSwiftCode:['', Validators.required],
      beneCountry:[''],
      
     
      applicantContactPerson:[''],
      applicantContactPersonEmail:[''],
      beneContactPerson:['',Validators.required],
      beneContactPersonEmail:['', Validators.required]
    
  });

  }
  
  


  ngOnInit() {
    this.getSubsidiaryData();

  
    $('#divBene').hide();
    
    this.onItemChange("Applicant","","","","","","");
    this.countryName = JSON.parse(sessionStorage.getItem('countryData'));
    this.parentID=sessionStorage.getItem('companyName')
    this.parentID1=sessionStorage.getItem('companyName')
    this.userid=sessionStorage.getItem('userID')
    
    
       
    }

   
    ngAfterViewInit() {
    

    var userid=sessionStorage.getItem('userID');
    if (userid.startsWith('BC')) {
      this.disableRadiobtn=false;           
       this.onItemChange("","","","","","","");
       this.LcDetail.get('applicantName').setValue('');

     }else{
      this.onItemChange('Applicant',null,null,null,null,null,null)

     }
   
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
     //  this.selectSubsidiaries(null,e);
    }
    else{
     // console.log(this.LcDetail.get('applicantName').value)
      this.LcDetail.get('applicantName').setValue('');
      this.LcDetail.get('applicantCountry').setValue('');
      this.LcDetail.get('beneName').setValue('');
      this.LcDetail.get('beneCountry').setValue('');
    }

  }

  selectSubsidiaries(clone){
    
  clone=this.youAre;

// if(this.youAre=='Applicant'){
//   this.subsidiaries.forEach(element => {

//     if(element.subCompany==this.applicantName){
//       this.LcDetail.get('applicantCountry').setValue(element.country);
//        sessionStorage.setItem('subUserID',element.subUserId);
//     } 
//   });
// }
// else if(this.youAre=='Beneficiary'){
//   this.subsidiaries.forEach(element => {   
//    if (element.subCompany==this.beneName){
//       this.LcDetail.get('beneCountry').setValue(element.country);
//        sessionStorage.setItem('subUserID',element.subUserId);
//     }
    
//   });
// }
// else{
if(this.LcDetail.get('applicantName').value){

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
//}

// if(this.youAre=='Applicant'){
//   sessionStorage.setItem('subUserId',id);   
//   var userid=sessionStorage.getItem('subUserId').split(" and",2)
//   this.LcDetail.get('applicantName').setValue(userid[1]); 
//   this.LcDetail.get('beneName').setValue(""); 
// }
// if(this.youAre=='Beneficiary'){
//   sessionStorage.setItem('subUserId',id);   
//   var userid=sessionStorage.getItem('subUserId').split(" and",2)
//   this.LcDetail.get('beneName').setValue(userid[1]); 
//   this.LcDetail.get('applicantName').setValue(""); 
// }

   
  
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

  onChangeType(country) {
    // console.log(this.countryVal);
    // this.LcDetail.get('country').setValue(this.countryVal);
    // if(this.typeOfPayment==="grantVasPayment"){
    //   this.loadVasPaymentList();
    // }else{
    //   this.loadPaymentList();
    // }
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
    this.selectedcountry = this.search(value);
    
     }
     search(value: string) { 
       let filter = value.toLowerCase();
       return this.subsidiaries.filter(option => option.subCompany.toLowerCase().startsWith(filter));
     }
   
  public isValid() {
    console.log(   this.isValidBeneEmail)
    this.errorMsg="fill the "

    if(  this.isValidBeneEmail){
      $('#validateMsg').show();
      return false

    }else{
      return true;
    }
   
    
 
//   this.submitted = true;
//   if (this.LcDetail.valid ) {
//     console.log(this.submitted)
// return true;
// } else {
//   console.log(this.submitted)

//   console.log('else')

//   return false;
// }

//  this.submitted = false;
  }
 }
