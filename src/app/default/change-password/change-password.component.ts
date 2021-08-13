import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, NavigationExtras } from '@angular/router';
import { MustMatch } from 'src/app/beans/Validations';
import * as $ from 'src/assets/js/jquery.min';
import { FormGroup, FormBuilder, FormControl, Validators } from '@angular/forms';
import { LoginService } from 'src/app/services/login/login.service';
import { ChangePassword } from 'src/app/beans/login';
import { loads} from '../../../assets/js/commons'
import { ValidateRegex } from 'src/app/beansbk/Validations';
import { ForgetPasswordService } from 'src/app/services/forget-password/forget-password.service';

@Component({
  selector: 'app-change-password',
  templateUrl: './change-password.component.html',
  styleUrls: ['./change-password.component.css']
})
export class ChangePasswordComponent implements OnInit {
  submitted: boolean = false;
  public parentURL: string = "";
  public subURL: string = "";
  isTextFieldType: boolean;
  isTextFieldType2: boolean;
  isTextFieldType1: boolean;
  wrongPassword: boolean=false;

  constructor(public router: Router, public activatedRoute: ActivatedRoute, public rsc: ForgetPasswordService, private formBuilder: FormBuilder, public loginService: LoginService) {

    this.activatedRoute.parent.url.subscribe((urlPath) => {
      this.parentURL = urlPath[urlPath.length - 1].path;
    });
    this.activatedRoute.parent.parent.url.subscribe((urlPath) => {
      this.subURL = urlPath[urlPath.length - 1].path;
    })

  }

  changePasswordForm = this.formBuilder.group({
    oldpassword: new FormControl('', [Validators.required, Validators.pattern(/^(\s+\S+\s*)*(?!\s).*$/)]),
    newPassword: new FormControl('', [Validators.required,Validators.minLength(6), Validators.pattern(/^(\s+\S+\s*)*(?!\s).*$/)]),
    confirmPassword: new FormControl('', [Validators.required,Validators.minLength(6), Validators.pattern(/^(\s+\S+\s*)*(?!\s).*$/)]),
    //validators: MustMatch('newPassword', 'confirmPassword')
  },
  {
    validators: MustMatch('newPassword', 'confirmPassword')
  });

  get changePassDetails() {
    return this.changePasswordForm.controls;
  }

  ngOnInit() {
    loads();
  }

  close() {
    this.router.navigate([`/${this.subURL}/${this.parentURL}/dashboard-details`])
  }

  onSubmit() {
    this.submitted = true;
    if (this.changePasswordForm.invalid) {
      return;
    }
    this.submitted = false;
    //$('.modal1').hide();

    let data: ChangePassword = {
      userId: sessionStorage.getItem('userID'),
      oldPassword: this.changePasswordForm.get('oldpassword').value,
      newPassword: this.changePasswordForm.get('newPassword').value,
      retypePaasword: this.changePasswordForm.get('confirmPassword').value,
    }

    this.loginService.changePassword(data).
      subscribe(
        (response) => {
          if(JSON.parse(JSON.stringify(response)).errCode=='ASA008'){
            const param = {
              "userId": sessionStorage.getItem('userID'),
              "event": "RESET_SUCCESS"          
            }
            this.rsc.passwordChangeSuccess(param)
            .subscribe(
              (response)=>{
                
              }
            )
      
          const navigationExtras: NavigationExtras = {
            state: {
              title: 'Congratulations! Your Password has been successfully Changed!',
              message: 'Kindly login with new Password',
              parent: 'login'
            }
          };
          this.router.navigate(['/login/success'], navigationExtras)
            .then(success => console.log('navigation success?', success))
            .catch(console.error);
          }else if(JSON.parse(JSON.stringify(response)).errCode='ASA011'){
            this.wrongPassword=true;
          }
        },
        (error) => {
        // this.wrongPassword=true;
        
        }
      )
      
  }
  wrngPassOK(){
    this.router.navigateByUrl('/', {skipLocationChange: true}).then(() => {
      this.router.navigate([`/${this.subURL}/${this.parentURL}/change-password`]);
  });
  //  $('#wrongPassword').hide();
  }


  validateRegexFields(event, type){
    var key = event.keyCode;
    if(type == "noSpace"){
      if ( key == 32) {
        event.preventDefault();
      }
    }
  
  }

  togglePasswordFieldType(data){
    if(data=='oldpassword'){
      this.isTextFieldType = !this.isTextFieldType;
    }else if(data=='newPassword'){
      this.isTextFieldType1 = !this.isTextFieldType1;
    }else if(data=='confirmPassword'){
      this.isTextFieldType2 = !this.isTextFieldType2;
    }
    
  }
}