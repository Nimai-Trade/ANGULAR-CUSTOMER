import { Component, OnInit, ViewChild } from '@angular/core';
import { Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { ActivatedRoute, Router } from '@angular/router';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
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
    this.getTermsConditionText();
   // $('#privacyPolicyId').show();
    
  }
  public convetToPDF()
  {
$('#termsConditionId').show();

  var data = document.getElementById('termsConditionId');
  html2canvas(data).then(canvas => {
  // Few necessary setting options
  var imgWidth = 509;
  var pageHeight = 595;
  var imgHeight = canvas.height * imgWidth / canvas.width;
  var heightLeft = imgHeight;
   
  const contentDataURL = canvas.toDataURL('image/png')
  let pdf = new jsPDF('p', 'mm', 'a4'); // A4 size page of PDF
  var position = 0;
  pdf.addImage(contentDataURL, 'PNG', 0, position, imgWidth, imgHeight)
  pdf.save('Payment Invoice.pdf'); // Generated PDF
  });
  //$('#termsConditionId').hide();
  }
 public privacyPolicy(){
  this.getTermsConditionText();
  $('#privacyPolicy').show();
 }
 
 public termsConditions(){
  this.getTermsConditionText();
  $('#termsConditionId').show();
 } 

 close(){
  $('#privacyPolicy').hide();
  $('#termsConditionId').hide();
 }

getTermsConditionText(){
  this.fps.viewTermsAndPolicy()
            .subscribe(
              (response) => {
             if(JSON.parse(JSON.stringify(response)).data){
              this.scriptletTerms = JSON.parse(JSON.stringify(response)).data.terms
              this.scriptlet = JSON.parse(JSON.stringify(response)).data.policy
             // console.log(this.scriptletTerms)
             }
              }),
              (error)=>{
                console.log(error)
              }
         }
}
