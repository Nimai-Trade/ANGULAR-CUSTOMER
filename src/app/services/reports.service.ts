import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ReportsService {

  private headers = new HttpHeaders();

  constructor(private httpClient: HttpClient) {
    this.headers.set('Content-Type', 'application/json');
    //this.headers.set('Accept', 'application/pdf');
  }

  downloadExcelReportForTransaction(data): Observable<any> {   

    return this.httpClient.post(`${environment.domain}/nimaiTransaction/downloadExcelReportForTransaction`, data, 
    { responseType: 'blob' as 'json' }).pipe(
      map((res: any) => {
        const blob = new Blob([res], { type: 'application/csv' });
        const file = new File([blob], "excel" + new Date().getTime() + '.csv', { type: 'application/csv' });
        saveAs(file);
      })
    );
  }
  downloadExcelReportForBankTransaction(data): Observable<any> {   
    
     return this.httpClient.post(`${environment.domain}/nimaiTransaction/downloadExcelReportForBankTransaction`, data, 
     { responseType: 'blob' as 'json' }).pipe(
       map((res: any) => {
         const blob = new Blob([res], { type: 'application/csv' });
         const file = new File([blob], "excel" + new Date().getTime() + '.csv', { type: 'application/csv' });
         saveAs(file);
       })
     );
   }
  
  public downloadPDFReportForTransaction(data): Observable<any> {
    return this.httpClient.post<any[]>(`${environment.domain}/nimaiTransaction/downloadPDFReportForTransaction`, data, 
     { responseType: 'blob' as 'json' }).pipe(
      map((res: any) => {
        const blob = new Blob([res], { type: 'application/pdf' });
        const file = new File([blob], "pdf" + new Date().getTime() + '.pdf', { type: 'application/pdf' });
        saveAs(file);
        // var fileURL = URL.createObjectURL(file);
        // window.open(fileURL); 
      })
    );
  }

}
