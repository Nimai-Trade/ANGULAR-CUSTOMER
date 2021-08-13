import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router, NavigationExtras } from '@angular/router';
import { ResetPasswordService } from 'src/app/services/reset-password/reset-password.service';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { LoginService } from 'src/app/services/login/login.service';
import { MustMatch } from 'src/app/beans/Validations';
import { loads} from '../../../../assets/js/commons.js';
import * as $ from '../../../../assets/js/jquery.min';
import { TermAndConditionsComponent } from '../../term-and-conditions/term-and-conditions.component.js';
import { MatDialog } from '@angular/material';
import { ForgetPasswordService } from 'src/app/services/forget-password/forget-password.service.js';


@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.css']
})
export class ResetPasswordComponent implements OnInit {
  @ViewChild(TermAndConditionsComponent, { static: true }) termsAndconditions: TermAndConditionsComponent;

  public flag: boolean = false;
  public key: string;
  public resetForm: FormGroup;
  submitted: boolean = false;
  isTextFieldType: boolean;
  isreTextFieldType: boolean;
  public isParent:boolean=false;
  tcFlag: string;
  userID: any;
  expiryMsg="The validity of the link has expired. Please contact 360tf Customer support team for further assistance.";
  constructor(public router: ActivatedRoute, public route: Router, public fsc: ForgetPasswordService,public lgsc:LoginService,public dialog: MatDialog, public rsc: ResetPasswordService, public fb: FormBuilder) {
    this.router.queryParams.subscribe(params => {
      this.key = params["key"]
    })
    this.rsc.validateToken(this.key).subscribe(
      (response) => {
          let resp=JSON.parse(JSON.stringify(response)).data;
          if(resp){
          if(resp.userIdentification== "MASTER")
          {
            this.isParent=false;
          }else{
            this.isParent=true;
          }
        }else{
          this.isParent=true;
        }
        this.flag = true;
      },
      (error) => {
       
        if( JSON.parse(JSON.stringify(error)).error.message== "Setting password link has expired!"){
          const navigationExtras: NavigationExtras = {
            state: {
              title: JSON.parse(JSON.stringify(error)).error.message,
              message: this.expiryMsg,
              parent: 'login'
            }
          };
          this.route.navigate(['/login/error'], navigationExtras)
            .then(success => console.log('navigation success?', success))
            .catch(console.error);
        }else{

       
        const navigationExtras: NavigationExtras = {
          state: {
            title: JSON.parse(JSON.stringify(error)).error.message,
            message: "",
            parent: 'accountactivation'
          }
        };
        this.route.navigate(['/accountactivation/error'], navigationExtras)
          .then(success => console.log('navigation success?', success))
          .catch(console.error);
      }
    }
    )
  }

  ngOnInit() {
   // if()
    loads()
    this.resetForm = this.fb.group({
      emailId: [''],
      userId: [''],
      oldPassword: [''],
      newPassword: ['', [Validators.required,Validators.minLength(6)]],
      retypePaasword: ['' ,[Validators.required,Validators.minLength(6)]],
      termsAndcondition:  [false, Validators.requiredTrue],
      getToken: this.key,
      tcFlag :this.tcFlag,
    },
    {
      validators: MustMatch('newPassword', 'retypePaasword')
    }
    )
  }
  togglePasswordFieldType(){
    this.isTextFieldType = !this.isTextFieldType;
  }
  togglerePasswordFieldType(){
    this.isreTextFieldType = !this.isreTextFieldType;
  }
  get resetFormDetails() {
    return this.resetForm.controls;
  }

  close(){
    $('#resetId').hide();
    $('.modal-backdrop').hide();

  }

  acceptTerms(){
    var element = <HTMLInputElement> document.getElementById("isCheckedForTerms");
    var isChecked = element.checked;
    if(isChecked){
      this.tcFlag='yes';
      $('#checkboxError').hide();
    }
      else{
      $('#checkboxError').show(); 
      this.tcFlag='no';  
      }   
  }

    
  openTermAndServiceDialog(num) {   
    let termAndConditionsComponent = new TermAndConditionsComponent(); 
    if(num==1){
        termAndConditionsComponent.termsConditions();
     // this.termsAndconditions.termsConditions();
    }else{     
      termAndConditionsComponent.privacyPolicy();
    //  this.termsAndconditions.privacyPolicy();
    }
  }
  submit(){
   
if(!this.isParent){

  this.resetForm.get('termsAndcondition').clearValidators();
  this.resetForm.get('termsAndcondition').updateValueAndValidity();

}
if(this.isParent){
  var element = <HTMLInputElement> document.getElementById("isCheckedForTerms");
  var isChecked = element.checked;
  if(isChecked)
  {
    $('#checkboxError').hide();
    this.tcFlag='yes';
  }  

  else{
    $('#checkboxError').show();   
    this.tcFlag='no';
  } 
}
    this.submitted = true;
    if (this.resetForm.invalid) {
      return;
    }
    this.submitted = false;  
    this.resetForm.get('tcFlag').setValue(this.tcFlag)
    this.lgsc.resetPassword(this.resetForm.value)
    .subscribe(
      (response)=>{
        this.userID=JSON.parse(JSON.stringify(response)).data.userId

        // const data = {
        //   "userId": this.userID, 
        //   "event": "RESET_SUCCESS"          
        // }
        // this.fsc.passwordChangeSuccess(data)
        // .subscribe(
        //   (response)=>{
            
        //   }
        // )
        const navigationExtras: NavigationExtras = {
          state: {
            title: 'Your password is set successfully!',
            message: '',
            parent: 'accountactivation'
          }
        };
        this.route.navigate(['/accountactivation/success'], navigationExtras)
          .then(success => console.log('navigation success?', success))
          .catch(console.error);
      },
      (error)=>{
        const navigationExtras: NavigationExtras = {
          state: {
            title: JSON.parse(JSON.stringify(error)).error.errMessage,
            message: '',
            parent: 'accountactivation'
          }
        };
        this.route.navigate(['/accountactivation/error'], navigationExtras)
          .then(success => console.log('navigation success?', success))
          .catch(console.error);
      
      }
    )

  }

  validateRegexFields(event, type){
    var key = event.keyCode;
    if(type == "noSpace"){
      if ( key == 32) {
        event.preventDefault();
      }
    }
  
  }





}
