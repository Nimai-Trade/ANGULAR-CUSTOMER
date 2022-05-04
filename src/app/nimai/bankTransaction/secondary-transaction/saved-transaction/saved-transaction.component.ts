import { Component, OnInit } from '@angular/core';
import { UploadLcService } from 'src/app/services/upload-lc/upload-lc.service';
import { NavigationExtras, ActivatedRoute, Router } from '@angular/router';
import { custTrnsactionDetail,custActiveTransaction } from 'src/assets/js/commons';
import { TitleService } from 'src/app/services/titleservice/title.service';
@Component({
  selector: 'app-saved-transaction',
  templateUrl: './saved-transaction.component.html',
  styleUrls: ['./saved-transaction.component.css']
})
export class SavedTransactionComponent implements OnInit {
  public noData: boolean = false;
  draftData: any;
  public parentURL: string = "";
  public subURL: string = "";

  constructor(public titleService: TitleService,public service: UploadLcService, public activatedRoute: ActivatedRoute, public router: Router ) {
    this.activatedRoute.parent.url.subscribe((urlPath) => {
      this.parentURL = urlPath[urlPath.length - 1].path;
    });
    this.activatedRoute.parent.parent.url.subscribe((urlPath) => {
      this.subURL = urlPath[urlPath.length - 1].path;
    })
    this.titleService.quote.next(false);

  }

  ngOnInit() {

    this.callAllDraftTransaction();
  }

  callAllDraftTransaction(){
    var userIdDetail = sessionStorage.getItem('userID');
    var emailId = "";
  
    if(sessionStorage.getItem('accountType')=='Passcode'){
      emailId = sessionStorage.getItem('branchUserEmailId');
    }else{
      //emailId="";
      emailId = sessionStorage.getItem('branchUserEmailId');
    }

    if(userIdDetail.startsWith('BC')){
      emailId = sessionStorage.getItem('branchUserEmailId');
    }
    const param = {
      userId: sessionStorage.getItem('userID'),
      "branchUserEmail":emailId
    }
    
    this.service.getCustDraftTransaction(param).subscribe(
      (response) => {
        custTrnsactionDetail();
        this.draftData=[];
        this.draftData = JSON.parse(JSON.stringify(response)).data;
        // if(!this.draftData){
        //   this.noData = true;
        // }
      },(error) =>{
        this.noData = true;
      }
      )
  }


  
  editDraft(trnsactionID){
    const navigationExtras: NavigationExtras = {
      state: {
        redirectedFrom: "draftTransaction",
        trnsactionID: trnsactionID
      }
    };
    this.router.navigate([`/${this.subURL}/${this.parentURL}/new-secondary-transaction`], navigationExtras)
      .then(success => console.log('navigation success?', success))
      .catch(console.error);
  }

  deleteDraft(data){
    var req = {
      "transactionId": data.transactionId
      }
    this.service.getCustDraftTransactionDelete(req).subscribe(
      (response) => {
        const index = this.draftData.indexOf(data);
        this.draftData.splice(index, 1);
        this.router.navigateByUrl('/', {skipLocationChange: true}).then(() => {
          this.router.navigate([`/${this.subURL}/${this.parentURL}/saved-transaction`]);
      });
      },(error) =>{
      }
      )
    
  }

  
  openNav3() {
    document.getElementById("myCanvasNav").style.width = "100%";
    document.getElementById("myCanvasNav").style.opacity = "0.6";
  }
  closeOffcanvas() {
    
    document.getElementById("myCanvasNav").style.width = "0%";
    document.getElementById("myCanvasNav").style.opacity = "0";
  }
}
