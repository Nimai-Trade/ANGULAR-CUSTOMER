import { Component, OnInit, ViewChild } from '@angular/core';
import { Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { ActivatedRoute, Router } from '@angular/router';
import { ForgetPasswordService } from 'src/app/services/forget-password/forget-password.service';
import { TitleService } from 'src/app/services/titleservice/title.service';
import { environment } from 'src/environments/environment';
import * as $ from '../../../assets/js/jquery.min';
import { LoginComponent } from '../login/login.component';
@Component({
  selector: 'app-term-and-conditions',
  templateUrl: './term-and-conditions.component.html',
  styleUrls: ['./term-and-conditions.component.css']
})

export class TermAndConditionsComponent implements OnInit {
  tradeLegal: any;
  tradeWebsite: string;
  tradeUrl: string;
  scriptlet: string="";
  scriptletTerms: any="";  
  constructor(public fps: ForgetPasswordService){

  }
  ngOnInit() {
    this.tradeLegal=environment.legal;
    this.tradeWebsite=environment.website;
    this.tradeUrl=environment.domain;
   // $('#privacyPolicyId').show();
    
  }

 public privacyPolicy(){
  this.getTermsConditionText();
  $('#privacyPolicyId').show();
 }
 
 public termsConditions(){
  this.getTermsConditionText();
  $('#termsConditionId').show();
 } 

 close(){
  $('#privacyPolicyId').hide();
  $('#termsConditionId').hide();
 }

getTermsConditionText(){
  this.fps.viewTermsAndPolicy()
            .subscribe(
              (response) => {
             if(JSON.parse(JSON.stringify(response)).data){
              this.scriptletTerms = JSON.parse(JSON.stringify(response)).data.terms
              this.scriptlet = JSON.parse(JSON.stringify(response)).data.policy
             }
              }),
              (error)=>{
                console.log(error)
              }
         }
}
