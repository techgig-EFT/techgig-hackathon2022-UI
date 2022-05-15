import { Component, OnDestroy, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { AudioConfig, SpeechConfig, SpeechSynthesizer } from 'microsoft-cognitiveservices-speech-sdk';
import { Observable, Subscription } from 'rxjs';
import { EmplistService } from './emplist.service';
import { IEmployee } from './employees';
import * as RecordRTC from 'recordrtc';
import { DomSanitizer } from '@angular/platform-browser';
import { HttpClient } from '@angular/common/http';
//Find your key and resource region under the 'Keys and Endpoint' tab in your Speech resource in Azure Portal
//Remember to delete the brackets <> when pasting your key and region!
const speechConfig = SpeechConfig.fromSubscription("89cdac66a8fc48348a331c52a8fa4de7", "eastus");
const GRAPH_ENDPOINT='https://graph.microsoft.com/v1.0/me';
@Component({
  selector: 'app-emplist',
  templateUrl: './emplist.component.html',
  styleUrls: ['./emplist.component.css'],
})
export class EmplistComponent implements OnInit, OnDestroy {
  isUserLoggedin=false;
  constructor(private emplistService: EmplistService, private domSanitizer: DomSanitizer,private http:HttpClient) {}
  sanitize(url: string) {
    return this.domSanitizer.bypassSecurityTrustUrl(url);
  }
  employeeId: number = 0;
  preferredNameDefault: number = -1;
  blob: any;
  rating: number = 5;
  recording: boolean = false;
  title: string = 'micRecorder';
  //Declare Record OBJ
  record: any;
  //URL of Blob
  url: any;
  error: any;
  pronounce: boolean[] = [];
  pronunciation: string[] = [];
  private _searchid: string = '';
  employees: IEmployee[] = [];
  filteredEmployees: any[] = [];
  errorMessage: string = '';
  updateDetails:boolean = false;
  loginUser:string = "";
  message:string="";
  optoutmessage:string="";
  loading:boolean=false;
  removePronunciation(employeeId:number){
    this.loading=true;
    this.emplistService.removePronunciation(employeeId.toString()).subscribe({
      next: (result) => {
        this.loading=false;
        this.optoutmessage="Pronunciation removed successfully";
        console.log(result);
        window.location.reload();
      },
      error: (err) => 
      {this.loading=false;
        console.log(err)},
    });;
  }
  pronounceName(employee: any, index: number) {
    this.pronounce[index] = true;

    let name="";
      if (employee.recordedPronunciation&&employee.preferredNameDefault && employee.preferred_name_pronunciation)
        this.pronunciation[index] = employee.preferred_name_pronunciation;
      else if(employee.recordedPronunciation&&employee.pronunciation)
        this.pronunciation[index] = employee.pronunciation
    else {
      /*this.emplistService.pronounceName(employee.empid,employee.empname).subscribe({
        next: (result) => {
          this.pronunciation[index]=result
          console.log(result);
        },
        error: (err) => console.log(err),
      });*/
      if(employee.preferredNameDefault)
        name=employee.preferredname
      else
        name=employee.empname

      const audioConfig = AudioConfig.fromDefaultSpeakerOutput();
      const synthesizer = new SpeechSynthesizer(speechConfig, audioConfig);

      synthesizer.speakTextAsync(
        name,
        result => {
          if (result) {
            this.pronunciation[index] = URL.createObjectURL(new Blob([new Uint8Array(result.audioData)]));
          }
          synthesizer.close();
        },
        error => {
          console.log(error);
          synthesizer.close();
        });
    }
  }

  stopPronounceName(employeeId: string, index: number) {
    this.pronounce[index] = false;
  }

  initiateRecording(employeeId: string) {
    this.recording = true;
    let mediaConstraints = {
      video: false,
      audio: true
    };
    navigator.mediaDevices.getUserMedia(mediaConstraints).then(this.successCallback.bind(this), this.errorCallback.bind(this));
  }
  /**
  * Will be called automatically.
  */
  successCallback(stream: any) {
    var options = {
      mimeType: "audio/wav",
      sampleRate: 44100,
      bufferSize: 4096
    };
    //Start Actuall Recording
    var StereoAudioRecorder = RecordRTC.StereoAudioRecorder;
    this.record = new StereoAudioRecorder(stream, options);
    this.record.record();
  }
  stopRecording(employeeId: number, preferredNameDefault: boolean) {
    this.loading=true;
    this.recording = false;
    this.employeeId = employeeId;
    this.preferredNameDefault = (preferredNameDefault==true)?1:0;
    this.record.stop(this.processRecording.bind(this));
    //update employee.recordedPronunciatio to true for the given employee id
  }

  processRecording(blob: any) {
    this.url = URL.createObjectURL(blob);
    console.log("blob", blob);
    console.log("url", this.url);
    let nametype = (this.preferredNameDefault) ? "preferred" : "default"

    this.emplistService.savePronunciation(this.employeeId, nametype, blob).subscribe({
      next: (result) => {
        console.log(result);
        this.loading=false;
        window.location.reload();
      },
      error: (err) => 
      {this.loading=false;
        console.log(err)},
    });
    
  }
  /**
  * Process Error.
  */
  errorCallback(error: any) {
    this.error = 'Can not play audio in your browser';
  }
  onSubmit(form: NgForm,empid:number) {
    this.loading=true;
    console.log('Submit came through', form.value);
    let formdata=form.value;
    formdata["empid"]=empid.toString()
    console.log(formdata);
    this.emplistService.updateEmployeeDetails(formdata).subscribe({
      next: (result) => {
        console.log(result);
        this.loading=false;
        this.message="Employee Details updated successfully"
        window.location.reload();
      },
      error: (err) => 
      {this.loading=false;
        console.log(err)},
    });
    this.clearForm();
    //this.http.post(this.url, this.form);
  }

  clearForm() {
    this.updateDetails=false;
  }
  get searchid(): string {
    return this._searchid;
  }
  set searchid(value: string) {
    this._searchid = value;
    this.filteredEmployees = this.performFilter(value);
    this.pronounce.fill(false, 0, this.filteredEmployees.length);
    this.pronunciation.fill("", 0, this.filteredEmployees.length);
  }
  performFilter(searchid: string): IEmployee[] {
    return this.employees.filter((employee: IEmployee) =>
      employee.empid.toString().startsWith(searchid)
    );
  }

  sub!: Subscription;
  ngOnInit(): void {
    this.emplistService.isUserLoggedin.subscribe(x=>
      {
       this.isUserLoggedin=x;
      }
      )
    this.loading=true;
    this.http.get<any>(GRAPH_ENDPOINT).subscribe(
      (data)=>{
       this.loginUser=data.userPrincipalName}
    )
    this.sub = this.emplistService.employees$.subscribe({
      next: (employees) => {
        this.filteredEmployees = employees["employee-details"];
        this.employees = employees["employee-details"];
        this.pronounce.fill(false, 0, employees["employee-details"].length);
        this.pronunciation.fill("", 0, employees["employee-details"].length);
        this.loading=false;
      },
      error: (err) => 
      {this.loading=false;
        console.log(err)},
    });
  }
  ngOnDestroy(): void {
    this.sub.unsubscribe();
  }
}
