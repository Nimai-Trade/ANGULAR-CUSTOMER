import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { BnNgIdleService } from 'bn-ng-idle';
import { OnlinePaymentService } from './services/payment/online-payment.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent  {

  pgResponse: any;
  

  constructor(public router: Router,private bnIdle: BnNgIdleService,private onlinePayment:OnlinePaymentService) {
   
}
//mPending
ngOnInit(): void {
    this.bnIdle.startWatching(1800).subscribe((isTimedOut: boolean) => {
      if (isTimedOut) {
        console.log('session expired');

        sessionStorage.clear();
        this.router.navigate(['/']);
      }
    });


  }
  

}
