import { Component, OnInit } from '@angular/core';
import { SubscriptionDetailsService } from 'src/app/services/subscription/subscription-details.service';
import { Router, ActivatedRoute,NavigationExtras} from '@angular/router';
import * as $ from 'src/assets/js/jquery.min';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-vas-plan',
  templateUrl: './vas-plan.component.html',
  styleUrls: ['./vas-plan.component.css']
})
export class VasPlanComponent implements OnInit {
  public parentURL: string = "";
  public subURL: string = "";
  advDetails: any = "";
  viewAdvDetails:any="";
  callVasService=false;
  choosedPrice: any;
  advPrice:any;
  addedAmount: any=0;
  showVasPlan =true;
  showSuccess=false;
  isvasapplied:boolean=false;
  subscriptionId:any;
  hideAddBtn: boolean=false;
  vasId: any;
  addBtn: boolean=false;
  hideAdvDetails: boolean=false;
  noVas: boolean=false;
  trnxMsg: string;
  isActive: any;
  isRejected: boolean=false;
  trnxPendingMsg: string="";
  paymentStatus: any="";
  tradeSupport: string;
  nimaiCount: any;
  constructor(public router: Router, public activatedRoute: ActivatedRoute,public subscriptionService: SubscriptionDetailsService) {

    this.activatedRoute.parent.url.subscribe((urlPath) => {
      this.parentURL = urlPath[urlPath.length - 1].path;
    });
    this.activatedRoute.parent.parent.url.subscribe((urlPath) => {
      this.subURL = urlPath[urlPath.length - 1].path;
    })

   }
  ngOnInit() {
   
    this.tradeSupport= environment.support;
    this.addedAmount = 0;
    this.choosedPrice=sessionStorage.getItem('subscriptionamount');
    this.subscriptionId=sessionStorage.getItem('subscriptionid');
  
    if(sessionStorage.getItem('status')=='INACTIVE'){
      this.addBtn=true;
     
        this.trnxMsg="  Your subcription plan is inactive , Please renew your subcription plan."
        $('#trnxInactiveVas').show();
     
    }else{
      this.addBtn=false;

    }
    let data = {
      "userid": sessionStorage.getItem('userID'),
      "emailAddress": ""
    }

    this.subscriptionService.getTotalCount(data,sessionStorage.getItem('token')).subscribe(
      response => {
        this.nimaiCount = JSON.parse(JSON.stringify(response)).data;
        this.isvasapplied=this.nimaiCount.isvasapplied;
 
        if(this.isvasapplied){
          this.getVASByUserId();   
          this.showSuccess=true;
          this.showVasPlan =false;
          this.hideAddBtn=false;
        }else{
          this.viewVASPlans();   
          this.showSuccess=false;
          this.showVasPlan =true;
          this.hideAddBtn=true;
    
        }
        },  
      error => { }
    )
  
    
  }

  inactiveOk(){
    $('#trnxInactiveVas').hide();
  }
  getVASByUserId(){
    let data = {
      "userId": sessionStorage.getItem("userID")
    }
    this.subscriptionService.getVASByUserId(data).subscribe(response => {
    
      let res = JSON.parse(JSON.stringify(response.data[0]));
      this.viewAdvDetails=res;
      // this.addBtn=false;
     if(this.viewAdvDetails.mode=="Wire"){
       if(this.viewAdvDetails.paymentSts.toLowerCase()=="rejected"){
         this.isRejected=true;
        this.isActive=  "Your VAS payment is Rejected";
        this.addBtn=false;
        this.hideAddBtn=true;
        this.viewVASPlans();   
        this.showSuccess=false;
        this.showVasPlan =true;
        
               }
       if(this.viewAdvDetails.paymentSts=="Maker Approved" || this.viewAdvDetails.paymentSts=="Pending"){
        this.isActive="Your VAS payment approval is Pending"
       }
       if(this.viewAdvDetails.paymentSts=="Approved"){       
        this.isActive=" Your VAS is Active"
       }
     }else{
      this.isActive=" Your VAS is Active"
     }

     // alert(this.viewAdvDetails.paymentSts)
    
    })
  }
  viewVASPlans(){
    var userid = sessionStorage.getItem("userID");
    let data = {
      "country_name": sessionStorage.getItem("registeredCountry")
    }
    this.subscriptionService.viewAdvisory(data,userid).subscribe(response => {
      if(JSON.parse(JSON.stringify(response)).data){
        this.noVas=false;
      this.advDetails = JSON.parse(JSON.stringify(response)).data[0];
      this.vasId=this.advDetails.vas_id;
      if(this.advDetails){
        this.advPrice = this.advDetails.pricing;        
      }
      else {
        this.advDetails=0;
      }
    }else{
      this.noVas=true;
      this.showSuccess=false;
      this.showVasPlan=false
    }
       }),
       (error) => {
        this.advDetails="";
        this.advPrice =0;
        this.hideAdvDetails=true;
        
       }    
  }
  addAdvService(event){  
if(this.nimaiCount.paymentstatus.toLowerCase()=="pending" || this.nimaiCount.paymentstatus.toLowerCase()=="maker approved"){
this.trnxPendingMsg="  Your renewal payment approval is pending. It usually takes up to 48 hours to approve the payment. For more clarification contact us at "+this.tradeSupport

  this.paymentStatus="Transaction Pending"
  $('#txnPending').show();
}else if(this.nimaiCount.paymentstatus.toLowerCase()=="rejected"){
  this.trnxPendingMsg="  Your subscription payment is rejected. Contact support for more clarification "+this.tradeSupport
  this.paymentStatus="Transaction Rejected"
  $('#txnPending').show();
}else{

    if (event.target.value === "Add") {
      this.callVasService=true;
      this.addedAmount = 0 + parseFloat(this.advPrice);
      event.target.value = "Remove";
     const req ={
        "userId":sessionStorage.getItem('userID'),
        "vasId":this.vasId
   }
this.subscriptionService.getFinalVASAmount(req).subscribe(data => {
        let sdata= JSON.parse(JSON.stringify(data))
      this.addedAmount=sdata.data;
      })    
       

      } else {
      this.callVasService=false;  
      event.target.value = "Add";
      this.addedAmount = 0;
      }   
    }   
  }
  addVasPlan(data){
   
    if(this.callVasService)   {
      this.showVasPlan =false;
          this.showSuccess=true;
          sessionStorage.setItem('vasPending','No')
          sessionStorage.setItem('withVasAmt',this.addedAmount)
          sessionStorage.setItem('vasId',data.vas_id)
          sessionStorage.setItem('flag','renew-vas'),
          this.router.navigateByUrl('/', {skipLocationChange: true}).then(() => {
            this.router.navigate([`/${this.subURL}/${this.parentURL}/subscription`]);
        });
      // let req = {
      //   "userId": sessionStorage.getItem('userID'),
      //   "vasId": data.vas_id,
      //   "subscriptionId":this.subscriptionId
      // }
     
      // this.subscriptionService.addVas(req).subscribe(data => {
      //   let sdata= JSON.parse(JSON.stringify(data))
      //   console.log(sdata.status)
      //   if(sdata.status=="Success"){
      //     this.showVasPlan =false;
      //     this.showSuccess=true;
      //     sessionStorage.setItem('vasPending','No')
      //     this.router.navigateByUrl('/', {skipLocationChange: true}).then(() => {
      //       this.router.navigate([`/${this.subURL}/${this.parentURL}/subscription`]);
      //   });
      //   }else{
      //     console.log("error")
      //   }
      // }
      // )
    }else{
     
      this.trnxPendingMsg="  Please add Vas Plan";
      this.paymentStatus="Add VAS"
      $('#txnPending').show();
    }
  }



  pendingOkBtn(){
    
    $('#txnPending').hide();
  }
   
}
