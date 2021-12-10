import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Subscription } from 'src/app/beans/subscription';
import { environment } from '../../../environments/environment';


@Injectable({
  providedIn: 'root'
})
export class SubscriptionDetailsService {

  constructor(private httpClient: HttpClient) { }

  getSubscriptionDetails(): Observable<any> {
    return this.httpClient.get(`${environment.domain}/nimaiSPlan/getSPlans`,
      { headers: { 'content-type': 'application/json' } });
  }

  getPlansByCountry(data): Observable<any> {
    return this.httpClient.post<any>(`${environment.domain}/nimaiSPlan/viewCustomerSPlan` , data, { headers: { 'content-type': 'application/json' } })
  }


  public getPlanByUserId(userID: string): Observable<Subscription> {
    return this.httpClient.get<Subscription>(`${environment.domain}/nimaiSPlan/getSPlan/` + userID, { headers: { 'content-type': 'application/json' } })
  }
  
  public getFinalVASAmount(data): Observable<Subscription> {
    return this.httpClient.post<Subscription>(`${environment.domain}/nimaiSPlan/getFinalVASAmount`, data,{ headers: { 'content-type': 'application/json' } })
  }

  public saveSplan(userID: string, plan: Subscription): Observable<Subscription> {
    return this.httpClient.post<Subscription>(`${environment.domain}/nimaiSPlan/saveUserSubscriptionPlan/` + userID, plan,{ headers: { 'content-type': 'application/json' } })
  }
  public verifyPayment(data): Observable<Subscription> {
    return this.httpClient.post<Subscription>(`${environment.domain}/nimaiSPlan/verifyPayment` , data,{ headers: { 'content-type': 'application/json' } })
  }
  public continueBuy(data): Observable<Subscription> {
    return this.httpClient.post<Subscription>(`${environment.domain}/nimaiSPlan/continueBuy` , data,{ headers: { 'content-type': 'application/json' } })
  }
   public addVASToGrand(data): Observable<Subscription> {
    return this.httpClient.post<Subscription>(`${environment.domain}/nimaiSPlan/addVASToGrand` , data,{ headers: { 'content-type': 'application/json' } })
  }
  public applyCouponAfterVASBuy(data): Observable<Subscription> {
    return this.httpClient.post<Subscription>(`${environment.domain}/nimaiSPlan/applyCouponAfterVASBuy` , data,{ headers: { 'content-type': 'application/json' } })
  }
  public removeVASFromGrand(data): Observable<Subscription> {
    return this.httpClient.post<Subscription>(`${environment.domain}/nimaiSPlan/removeVASFromGrand` , data,{ headers: { 'content-type': 'application/json' } })
  }
  public addVASAfterSubscription(data:any): Observable<Subscription> {
    return this.httpClient.post<Subscription>(`${environment.domain}/nimaiSPlan/addVASAfterSubscription` , data,{ headers: { 'content-type': 'application/json' } })
  }
  public addVas(data): Observable<Subscription> {
    return this.httpClient.post<Subscription>(`${environment.domain}/nimaiSPlan/addVAS`, data,{ headers: { 'content-type': 'application/json' } })
  }
  public applyCoupon(data): Observable<Subscription> {
    return this.httpClient.post<Subscription>(`${environment.domain}/nimaiSPlan/applyCoupon`, data,{ headers: { 'content-type': 'application/json' } })
  }
  public removeCoupon(data): Observable<Subscription> {
    return this.httpClient.post<Subscription>(`${environment.domain}/nimaiSPlan/removeCoupon`, data,{ headers: { 'content-type': 'application/json' } })
  }
  public sendAccDetails(data): Observable<Subscription> {
    return this.httpClient.post<Subscription>(`${environment.domain}/nimaiEmail/sendAccDetails`, data,{ headers: { 'content-type': 'application/json' } })
  }
  
  public sendBankDetails(data): Observable<Subscription> {
    return this.httpClient.post<Subscription>(`${environment.domain}/nimaiEmail/sendBankDetails`, data,{ headers: { 'content-type': 'application/json' } })
  }
  public viewAdvisory(data,userID): Observable<any> {
    return this.httpClient.post<any>(`${environment.domain}/nimaiSPlan/getAdvisoryListByCountry/`+ userID ,data, { headers: { 'content-type': 'application/json' } })
  }
  public getVASByUserId(data): Observable<any> {
    return this.httpClient.post<any>(`${environment.domain}/nimaiSPlan/getVASByUserId` ,data, { headers: { 'content-type': 'application/json' } })
  }
  public getDownloadInvoice(data): Observable<any> {
    return this.httpClient.post<any>(`${environment.domain}/nimaiEmail/downloadInvoice/`+data, { headers: { 'content-type': 'application/pdf' } })
  }
  public viewSubscriptionBySubscriptionId(data): Observable<any> {
    return this.httpClient.post<any>(`${environment.domain}/nimaiSPlan/viewSubscriptionBySubscriptionId` ,data, { headers: { 'content-type': 'application/json' } })
  }

  public getTotalCount(data,token): Observable<any> {
    const httpHeaders = {
      headers: new HttpHeaders({
        "Authorization": "Bearer " + token,
        'content-type':'application/json'
      })
    };
    return this.httpClient.post<any>(`${environment.domain}/nimaiSPlan/getCount`, data, httpHeaders)
  }

  public getUserStats(): Observable<any[]>{
    return this.httpClient.get<any[]>(`${environment.domain}/nimaiUAM/passwordPolicy/getLiveUserStats`, { headers: { 'content-types': 'application/json' } });
  }
  public getSubscriptionList(userid): Observable<any[]> {
   // console.log("In service")
    return this.httpClient.get<any[]>(`${environment.domain}/nimaiSPlan/viewAllCustomerSPlan/`+userid , { headers: { 'content-type': 'application/json' } });
  }

  
  public getReferrerLeads(): Observable<any[]> {
    // console.log("In service")
     return this.httpClient.get<any[]>(`${environment.domain}/nimaiUCM/getReferrerLeads` , { headers: { 'content-type': 'application/json' } });
   }
}
