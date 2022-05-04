import { Component, OnInit, Input, ElementRef,ViewChild} from '@angular/core';
import { Subject } from 'rxjs';
import { DataServiceService } from 'src/app/services/upload-lc/data-service.service';
import { FormGroup } from '@angular/forms';
import  { ValidateRegex } from '../../../../beans/Validations';
import { uploadFileRefinance } from 'src/assets/js/commons'
import * as $ from 'src/assets/js/jquery.min';
import * as FileSaver from 'file-saver';

import { LoginService } from 'src/app/services/login/login.service';
@Component({
  selector: 'app-tenor-payment',
  templateUrl: './tenor-payment.component.html',
  styleUrls: ['./tenor-payment.component.css']
})

export class TenorPaymentComponent implements OnInit {
  @Input() public LcDetail:FormGroup;
  @ViewChild('myInput',{ static: true })
  myInputVariable: ElementRef;
  public selector: string;
  public discount: boolean = false;
  public refinancing: boolean = false;
  public bankGuarantee: boolean = false;
  public confirmation: boolean = true;
  public bankerBool: boolean = false;
  fileToUpload: File = null;
  private imageSrc: string = '';
  public countryName: any;
  isUpload=false;
  private filename: string = '';
  document: any;
  imgDownload: boolean;
  filenameView: any="";
  fileExist: boolean=false;
  data: any="";
  invalidFileMsg: string;
  isDownloadORview: string;
  constructor(public rds:DataServiceService,public loginService: LoginService) { 
  }

  ngOnInit() {
    $("input[name='optionsRadios']").click(function() {
      var radioValue1 = $("input[name='optionsRadios']:checked").val();
      if (radioValue1 == "rdmaturity") {
           $('.multipledate').hide();
      } else {
          $('.multipledate').show();
      } 
    });
    
    let requirementType= sessionStorage.getItem('requirementType');
if(requirementType=='appBeneReqType'){
  this.selectors('Confirmation');
}else{
 // this.selectors(requirementType);

}

    this.countryName = JSON.parse(sessionStorage.getItem('countryData'));

  }

  deleteFileContent(){    
    this.myInputVariable.nativeElement.value = ""; 
    this.LcDetail.get('tenorFile').setValue("");
    this.isUpload = false;
    uploadFileRefinance();
  }
  public upload(val){
   if(val){
     this.fileExist=true;
     this.data=val;
   }else{
     this.fileExist=false;
   }
   }
   

  public selectors(selector: string ) {
    this.selector = selector;
    if (this.selector === 'Discounting') {
      this.discount = true;
      this.confirmation = false;
      this.refinancing = false;
      this.bankerBool = false;
      this.bankGuarantee=false;
      this.rds.refinance.next(this.refinancing);
    } else if(this.selector === 'Banker'){
      this.discount = true;
      this.confirmation = false;
      this.refinancing = false;
      this.bankerBool = true;
      this.bankGuarantee=false;
      this.rds.refinance.next(this.refinancing);
    } else if (this.selector === 'Refinance') {
      this.discount = false;
      this.confirmation = false;
      this.refinancing = true;
      this.bankerBool = false;
      this.bankGuarantee=false;
      this.rds.refinance.next(this.refinancing);
    } else if(this.selector === "ConfirmAndDiscount"){
      this.discount = false;
      this.confirmation = true;
      this.refinancing = false;
      this.bankerBool = false;
      this.bankGuarantee=false;
      this.rds.refinance.next(this.refinancing);
    }
     else if(this.selector === 'BankGuarantee'){
      this.discount = false;
      this.confirmation = false;
      this.refinancing = false;
      this.bankerBool = false;
      this.bankGuarantee=true;
      this.rds.refinance.next(this.refinancing);
    }
    else if(this.selector === "BillAvalisation"){
      // localStorage.setItem('Avalisation', 'Avalisation')  
      this.discount = false;
      this.confirmation = true;
      this.refinancing = false;
      this.bankerBool = false;
      this.bankGuarantee=false;
      this.rds.refinance.next(this.refinancing);
    }
      else {
      this.discount = false;
      this.confirmation = true;
      this.refinancing = false;
      this.bankerBool = false;
      this.bankGuarantee=false;
      this.rds.refinance.next(this.refinancing);
    }



  }

  validateRegexFields(event, type){
    if(type == "number"){
      ValidateRegex.validateNumber(event);
    }
    else if(type == "alpha"){
      ValidateRegex.alphaOnly(event);
    }
    else if(type == "alphaNum"){
      ValidateRegex.alphaNumeric(event);
    }else if(type == "alphaNumericNoSpace"){
      ValidateRegex.alphaNumericNoSpace(event);
    }
  }
  invalidDateOk(){
    $('#invalidFileTenor').hide();
   }
  
  handleFileInput(e) {

    var file = e.dataTransfer ? e.dataTransfer.files[0] : e.target.files[0];
    var sizeInMb = file.size/1024;
    var sizeLimit= 1024*20;
    
    this.filename=file.name;
    if (sizeInMb > sizeLimit) {
    //alert('File size should be less than 20MB')
    this.invalidFileMsg="File size should be less than 20MB";
    $('#invalidFileTenor').show();
    $('#upload_file1').val("");
    this.LcDetail.get('tenorFile').setValue('');
    return
    }
    if(this.filename.toLowerCase().indexOf(".jpg") !== -1 || this.filename.toLowerCase().indexOf(".jpeg") !== -1 || this.filename.toLowerCase().indexOf(".png") !== -1 ||
    this.filename.toLowerCase().indexOf(".pdf") !== -1 || this.filename.toLowerCase().indexOf(".tiff") !== -1 
    || this.filename.toLowerCase().indexOf(".xlsx") !== -1 || this.filename.toLowerCase().indexOf(".csv") !== -1 || this.filename.toLowerCase().indexOf(".xls") !== -1  ){
   
    var reader = new FileReader();
      this.isUpload=true;
    reader.onload = this._handleReaderLoaded.bind(this);
    reader.readAsDataURL(file);
  }else{
    this.LcDetail.get('tenorFile').setValue('') 
    this.invalidFileMsg="Kindly select pdf, png, jpeg, xlsx or csv File";      
  //  $('#upload_file1').val("");              
    $('#invalidFileTenor').show();    
    return
  }
  }
  _handleReaderLoaded(e) {
    let reader = e.target;
    this.imageSrc =this.filename +" |" + reader.result;
    this.LcDetail.get('tenorFile').setValue(this.imageSrc);

  }
  close(){
    $('#myModaluploadMView').hide();
    }
  openDocument(file){
    
     $('#myModaluploadMView').show();
     var str = this.data; 
     var splittedStr = str.split(" |", 2); 
     var filename=str.split(" |", 1); 
     var filename=splittedStr[0].toLowerCase();
     this.filenameView=filename;

     var ext = filename.split("."); 
      // if(ext[1]=='jpeg' || ext[1]=='jpg' || ext[1]=='png' || ext[1]=='svg'){
      //  this.imgDownload=true;
      // }else{
      //  this.imgDownload=false;
      // }
      if(ext[ext.length-1]=='jpeg' || ext[ext.length-1]=='jpg' || ext[ext.length-1]=='png' || ext[ext.length-1]=='svg'){
        this.imgDownload=true;
        this.isDownloadORview="Download"
       }else{
        this.imgDownload=false;
        if( ext[ext.length-1]=='pdf'){
          this.isDownloadORview="View"
             }else{
                this.isDownloadORview="Download"
         }     
       }
     var data=splittedStr[1];
     this.document = data;
   }

 
  convertbase64toArrayBuffer(base64) {
    var binary_string = window.atob(base64);
    var len = binary_string.length;
    var bytes = new Uint8Array(len);
    for (var i = 0; i < len; i++) {
      bytes[i] = binary_string.charCodeAt(i);
    }
    return bytes.buffer;
  }
  download(){
    var str =this.data;
    var splittedStr = str.split(" |", 2); 
    var data=splittedStr[1];
    var base64string = data;

    var filename=splittedStr[0].toLowerCase();
    var ext = filename.split("."); 
   // var extension='.'+ext[1];
   var extension='.'+ext[ext.length-1];
    if(extension=='.xlsx'){
      base64string= base64string.replace('data:application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;base64,', '')
      const byteArr = this.convertbase64toArrayBuffer(base64string);
      var blob = new Blob([byteArr], { type:'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'});
      FileSaver.saveAs(blob, filename);
    } 
    else if(extension=='.xls'){
      var  base64string= base64string.replace('data:application/vnd.ms-excel;base64,', '')
        const byteArr = this.convertbase64toArrayBuffer(base64string);
        var blob = new Blob([byteArr], { type:'application/vnd.ms-excel'});
        FileSaver.saveAs(blob, filename);
        this.imgDownload=false;
      } 
    //   else if(extension=='.doc'){
    //     base64string= base64string.replace('data:application/msword;base64,', '')
    //     const byteArr = this.convertbase64toArrayBuffer(base64string);
    //     var blob = new Blob([byteArr], { type: 'application/msword' });
    //     FileSaver.saveAs(blob,filename);
    //     this.imgDownload=false;

    // }
    else if(extension=='.pdf'){
      base64string= base64string.replace('data:application/pdf;base64,', '')
      const byteArr = this.convertbase64toArrayBuffer(base64string);
      var blob = new Blob([byteArr], { type: 'application/pdf' });
      var fileURL = URL.createObjectURL(blob);
      window.open(fileURL);
    }  
    //  else if(extension=='.docx'){
    //     base64string= base64string.replace('data:application/vnd.openxmlformats-officedocument.wordprocessingml.document;base64,', '')
    //     const byteArr = this.convertbase64toArrayBuffer(base64string);
    //     var blob = new Blob([byteArr], { type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' });
    //     FileSaver.saveAs(blob,filename );
    // }
     else if(extension=='.csv'){
            base64string= base64string.replace('data:application/vnd.ms-excel;base64,', '')
            const byteArr = this.convertbase64toArrayBuffer(base64string);
            var blob = new Blob([byteArr], { type: 'application/vnd.ms-excel' });
            FileSaver.saveAs(blob, filename);
          }
          else if(extension=='.jpeg' || extension=='.jpg' || extension=='.png' || extension=='.svg'){
            base64string= base64string.replace('data:image/jpeg;base64,', '')
            const byteArr = this.convertbase64toArrayBuffer(base64string);
            var blob = new Blob([byteArr], { type: 'image/jpeg' });
            FileSaver.saveAs(blob, filename );

          }     
          else if(extension=='.tiff'){
            base64string= base64string.replace('data:image/tiff;base64,', '')
            const byteArr = this.convertbase64toArrayBuffer(base64string);
            var blob = new Blob([byteArr], { type: 'image/tiff' });
            FileSaver.saveAs(blob, filename );
            this.imgDownload=true;

          } else{
            console.log('in')
          } 
      }
  handleRadio(e, type){
    if(type){
      if(type == "DOM"){
        // this.LcDetail.get('tenorEndDate').setValue('DOM');
      }
      else{
        // this.LcDetail.get('tenorEndDate').setValue(this.LcDetail.get('negotiationDate').value);
      }

    }
    else{
      // this.LcDetail.get('lcMaturityDate').setValue(this.LcDetail.get('lCIssuingDate').value);
    }
  }


}
