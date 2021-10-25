import { Component, OnInit, Input, ElementRef, ViewChild } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { DataServiceService } from 'src/app/services/upload-lc/data-service.service';
import { LoginService } from 'src/app/services/login/login.service';
import * as $ from 'src/assets/js/jquery.min';
import { UploadLcService } from 'src/app/services/upload-lc/upload-lc.service';
import { uploadFileRefinance } from 'src/assets/js/commons'
import * as FileSaver from 'file-saver';


@Component({
  selector: 'app-others',
  templateUrl: './others.component.html',
  styleUrls: ['./others.component.css']
})
export class OthersComponent implements OnInit {
  @Input() public LcDetail:FormGroup;
  fileToUpload: File = null;
  @ViewChild('myInput',{ static: true })
  myInputVariable: ElementRef;
  public imageSrc: string = '';
  countryName: any;
  portOfLoading:any;
  chargesTypeCk1:boolean=false;
  chargesTypeCk2:boolean=false;
  portOfDischarge:any;
  minDate = new Date;
  private filename: string = '';
  isUpload: boolean;
  imgDownload: boolean;
  document: any;
  fileData: any;
  isviewEmpty: any="";
  filenameView: any="";
  invalidFileMsg: string;
  isDownloadORview: string;
  bankGuarantee: boolean=false;
  uploadTxt: string="";
  constructor(public rds:DataServiceService,public loginService: LoginService,public upls: UploadLcService) {
  }
  ngOnInit() {
    this.countryName = JSON.parse(sessionStorage.getItem('countryData'));
  }

  onItemChangeApp(e){
  var appChargeType=this.LcDetail.get('applicantName').value+ " ("+e+")";
  this.LcDetail.get('chargesType').setValue(appChargeType)
  this.chargesTypeCk1=true;
  this.chargesTypeCk2=false;

}
onItemChangeBene(e){
  var benChargeType=this.LcDetail.get('beneName').value+" ("+e+")";
  this.LcDetail.get('chargesType').setValue(benChargeType)
  this.chargesTypeCk2=true;
  this.chargesTypeCk1=false;
  }

  isESGComplaint(Checked){
if(Checked=='Yes')
  this.LcDetail.get('isESGComplaint').setValue(true);
else
this.LcDetail.get('isESGComplaint').setValue(false);

  }
  onSelectBG(reqType){
    if(reqType=='BankGuarantee'){
      this.bankGuarantee=true;
      this.uploadTxt="Upload BG Text ";
    }   
    else{
      this.bankGuarantee=false;
      this.uploadTxt="Upload Invoice";

    }
   
  }
  onItemChange(e){
    if(e){
    var str = e; 
    var splittedStr = str.split(" (", 2); 
    var name1=splittedStr[1];
    var splitted = name1.split(")", 2); 
    e=splitted[0]
if(e=='Applicant'){
  this.chargesTypeCk1=true;
  this.chargesTypeCk2=false;
  this.onItemChangeApp(e) 
   this.LcDetail.get('chargesType').setValue(str)
}  
  if(e=='Beneficiary'){
    this.chargesTypeCk2=true;
    this.chargesTypeCk1=false;
    this.onItemChangeBene(e)
    this.LcDetail.get('chargesType').setValue(str)

  }
    }
 }
 

 invalidDateOk(){
  $('#invalidFileOthers').hide();
 }

 
  handleFileInput1(e) {

    
    var file = e.dataTransfer ? e.dataTransfer.files[0] : e.target.files[0];
    var sizeInMb = file.size/1024;
    var sizeLimit= 1024*20;
    
  this.filename=file.name;
    if (sizeInMb > sizeLimit) {
    //alert('File size should be less than 20MB')
    this.invalidFileMsg="File size should be less than 20MB";
    $('#invalidFileOthers').show();
    $('#upload_file11').val("");
    this.LcDetail.get('lcProForma').setValue('');
    return
    }
    if(this.filename.toLowerCase().indexOf(".jpg") !== -1 || this.filename.toLowerCase().indexOf(".jpeg") !== -1 || this.filename.toLowerCase().indexOf(".png") !== -1 ||
    this.filename.toLowerCase().indexOf(".pdf") !== -1 || this.filename.toLowerCase().indexOf(".tiff") !== -1 ){
      var reader = new FileReader();
      this.isUpload=true;   
          reader.onload = this._handleReaderLoaded.bind(this);
          reader.readAsDataURL(file);
    }else{
      this.LcDetail.get('lcProForma').setValue('')
            this.invalidFileMsg="Kindly select jpg, jpeg, png, pdf, tiff File";      
           // $('#upload_file11').val("");              
            $('#invalidFileOthers').show();    
            return
          }
   
  //    reader.readAsDataURL(e.target.files[0]);
  
  }
  _handleReaderLoaded(e) {
    let reader = e.target;
    this.imageSrc =this.filename +" |" + reader.result;
    
    console.log(this.imageSrc)
    this.LcDetail.get('lcProForma').setValue(this.imageSrc);

  }


  portDischargeOnchange(event:any){
    var data;
    if(this.LcDetail.get('dischargeCountry').value==""){
       data={
        "countryName":event
        
      } 
    }else{
       data={
        "countryName":this.LcDetail.get('dischargeCountry').value
      } 
    }
      
      this.upls.getPortByCountry(data).subscribe(
        (response) => {
          this.portOfDischarge = JSON.parse(JSON.stringify(response)).data;
        });
        
  }
  portLoadingOnchange(event:any){
var data;
if(this.LcDetail.get('loadingCountry').value==""){
   data={
    "countryName":event
  } 
}else{
   data={
    "countryName":this.LcDetail.get('loadingCountry').value
  } 
}

     
      this.upls.getPortByCountry(data).subscribe(
        (response) => {
          this.portOfLoading = JSON.parse(JSON.stringify(response)).data;
        });
  }
  close(){
    $('#myModaluploadView').hide();
    }
  openDocument(file){

     $('#myModaluploadView').show();
    
     var str = this.LcDetail.get('lcProForma').value; 
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

  deleteFileContent(){     
    this.myInputVariable.nativeElement.value = ""; 
    
    this.LcDetail.get('lcProForma').setValue('');
    this.isUpload = false;   
    uploadFileRefinance();



    

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
    var str = this.LcDetail.get('lcProForma').value; 
    var splittedStr = str.split(" |", 2); 
    var data=splittedStr[1];
    var base64string = data;
    
    var filename=splittedStr[0].toLowerCase();
   
    var ext = filename.split("."); 
    //var extension='.'+ext[1];
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
      else if(extension=='.doc'){
        base64string= base64string.replace('data:application/msword;base64,', '')
        const byteArr = this.convertbase64toArrayBuffer(base64string);
        var blob = new Blob([byteArr], { type: 'application/msword' });
        FileSaver.saveAs(blob,filename);
        this.imgDownload=false;

    }
    else if(extension=='.pdf'){
      base64string= base64string.replace('data:application/pdf;base64,', '')
      const byteArr = this.convertbase64toArrayBuffer(base64string);
      var blob = new Blob([byteArr], { type: 'application/pdf' });
      var fileURL = URL.createObjectURL(blob);
      window.open(fileURL);
      this.imgDownload=false;
    }  
     else if(extension=='.docx'){
        base64string= base64string.replace('data:application/vnd.openxmlformats-officedocument.wordprocessingml.document;base64,', '')
        const byteArr = this.convertbase64toArrayBuffer(base64string);
        var blob = new Blob([byteArr], { type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' });
        FileSaver.saveAs(blob,filename );
    }
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

          }  
      }
}

