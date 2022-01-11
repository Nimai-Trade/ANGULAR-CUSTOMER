import { Component, OnInit } from '@angular/core';
import { SubscriptionDetailsService } from 'src/app/services/subscription/subscription-details.service';
import { creditTransaction } from  'src/assets/js/commons';

@Component({
  selector: 'app-leads',
  templateUrl: './leads.component.html',
  styleUrls: ['./leads.component.css']
})
export class LeadsComponent implements OnInit {

  subscriptionData:any;
  noData:any;
  constructor(public service: SubscriptionDetailsService) { }

  ngOnInit() {
    this.leadsList();
  }
  leadsList(){
    this.service.getReferrerLeads(sessionStorage.getItem("userID")).subscribe(
      (response) => {
        creditTransaction();
        if(JSON.parse(JSON.stringify(response)).data){
          this.subscriptionData = JSON.parse(JSON.stringify(response)).data;
        }
        else{
          this.subscriptionData=""
        }  
        if(this.subscriptionData.length === 0){
          this.noData = true;
        }else{
          this.noData=false;
        }
      },(error) =>{
        this.noData = true;
      }
      )
  }

}
