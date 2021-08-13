import { Component, OnInit, ViewChild } from '@angular/core';
import { Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { ActivatedRoute, Router } from '@angular/router';
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


  
  constructor(){
  }
  ngOnInit() {
    this.tradeLegal=environment.legal;
    this.tradeWebsite=environment.website;
    this.tradeUrl=environment.domain;
   // $('#privacyPolicyId').show();
    
  }
 public privacyPolicy(){
  $('#privacyPolicyId').show();

 }
 
 public termsConditions(){
  $('#termsConditionId').show();

 }
  

 close(){
  $('#privacyPolicyId').hide();
  $('#termsConditionId').hide();

 }
}
