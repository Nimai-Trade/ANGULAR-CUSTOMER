import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ICreateOrderRequest, IPayPalConfig } from 'ngx-paypal';
import { OnlinePaymentService } from 'src/app/services/payment/online-payment.service';
import {paypalScript} from '../../../assets/js/commons';
import * as xlsx from 'xlsx';
@Component({
  selector: 'app-online-payment',
  templateUrl: './online-payment.component.html',
  styleUrls: ['./online-payment.component.css']
})
export class OnlinePaymentComponent implements OnInit {
  @ViewChild('epltable', { static: false }) epltable: ElementRef;

  public payPalConfig?: IPayPalConfig;
  showSuccess: boolean;
  detail: any;
  paymentId: any;
  token: any;
  PayerID: any;

  constructor( public onlinePayment:OnlinePaymentService,private route: Router,public router: ActivatedRoute) { }


  clubs = [
   {
     position: 1,
     name: "Liverpool",
     played: 20,
     won: 19,
     drawn: 1,
     lost: 0,
     points: 58
   },
   {
     position: 2,
     name: "Leicester City",
     played: 21,
     won: 14,
     drawn: 3,
     lost: 4,
     points: 45
   },
   {
     position: 3,
     name: "Manchester City",
     played: 21,
     won: 14,
     drawn: 2,
     lost: 5,
     points: 44
   },
   {
     position: 4,
     name: "Chelsea",
     played: 21,
     won: 11,
     drawn: 3,
     lost: 7,
     points: 36
   },
   {
     position: 5,
     name: "Manchester United",
     played: 21,
     won: 8,
     drawn: 7,
     lost: 6,
     points: 31
   }
  ];
  exportToExcel() {
   const ws: xlsx.WorkSheet =   
   xlsx.utils.table_to_sheet(this.epltable.nativeElement);
   const wb: xlsx.WorkBook = xlsx.utils.book_new();
   xlsx.utils.book_append_sheet(wb, ws, 'Sheet1');
   xlsx.writeFile(wb, 'epltable.xlsx');
  }
 


  ngOnInit() {
    this.initConfig();
   //paypalScript();
   this.router.queryParams.subscribe(params => {
    this.paymentId = params["paymentId"],   
    this.PayerID=params["PayerID"]
  })

const data={
  "paymentId":this.paymentId,
   "payerId":this.PayerID
}

this.onlinePayment.completePayment(data).subscribe((response)=>{
console.log(response)
})

  }
  public initConfig(): void {
    this.payPalConfig = {
    currency: 'USD',
    clientId: 'sb',
    createOrderOnClient: (data) => <ICreateOrderRequest>{
      intent: 'CAPTURE',
      purchase_units: [
        {
          amount: {
            currency_code: 'USD',
            value: '1.00',
            breakdown: {
              item_total: {
                currency_code: 'USD',
                value: '1.00'
              }
            }
          },
          items: [
            {
              name: 'Enterprise Subscription',
              quantity: '1',
              category: 'DIGITAL_GOODS',
              unit_amount: {
                currency_code: 'USD',
                value: '1.00',
              },
            }
          ]
        }
      ],
      application_context: {
        shipping_preference: 'NO_SHIPPING',      
        billing_preference: 'NO_BILLING'
      },
      style: {
        layout: 'horizontal'
    },
      advanced: { extraQueryParams: [ { name: "disable-funding", value:"credit,card"} ] } ,
    },
    advanced: {
      commit: 'true'
    },
    style: {
      label: 'paypal',
      layout: 'vertical'
    },
    onApprove: (data, actions) => {
      console.log('onApprove - transaction was approved, but not authorized', data, actions);
      actions.order.get().then(details => {
        console.log('onApprove - you can get full order details inside onApprove: ', details);
      });
    },
    onClientAuthorization: (data) => {
      console.log('onClientAuthorization - you should probably inform your server about completed transaction at this point', data);
      this.showSuccess = true;
    },
    onCancel: (data, actions) => {
      console.log('OnCancel', data, actions);
    },
    onError: err => {
      console.log('OnError', err);
    },
    onClick: (data, actions) => {
      console.log('onClick', data, actions);
    },
  };
  }
  

 test(){

 
  const onlinePay={
    "userId":sessionStorage.getItem('userID'),
    "merchantId":"45990",
    "orderId":"orderid",
    //"amount":this.addedAmount,
    "currency":"",  
    
   "merchantParam1":sessionStorage.getItem('userID'),
   "merchantParam2":sessionStorage.getItem('subscriptionid'),
   "merchantParam3":sessionStorage.getItem('flag'), 
   "merchantParam4":"",
   "merchantParam5":sessionStorage.getItem('subscriptionamount'),
   
  }
  this.onlinePayment.pay("12").subscribe((response)=>{
    let url=JSON.parse(JSON.stringify(response)).redirect_url
    console.log(url)
   // this.route.navigate(url);

//var url="https://secure.ccavenue.ae/transaction/transaction.do?command=initiateTransaction"

const mapForm = document.createElement('form');
mapForm.method = 'POST';
mapForm.action = url;
mapForm.style.display = 'none';

const mapInput = document.createElement('input');
mapInput.type = 'hidden';
mapInput.name = 'encRequest';
//mapInput.value = this.detail.requestDump;
mapForm.appendChild(mapInput);

const mapInput1 = document.createElement('input');
mapInput1.type = 'hidden';
mapInput1.name = 'access_code';
//mapInput1.value = this.detail.accessCode;
mapForm.appendChild(mapInput1);
document.body.appendChild(mapForm);

mapForm.submit();



  })
}
}
