import { Component, OnDestroy, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Observable, Subscription } from 'rxjs';
import { EmplistService } from './emplist.service';
import { IEmployee } from './employees';
<<<<<<< Updated upstream
=======
import * as RecordRTC from 'recordrtc';
import { DomSanitizer } from '@angular/platform-browser'; 
//Find your key and resource region under the 'Keys and Endpoint' tab in your Speech resource in Azure Portal
//Remember to delete the brackets <> when pasting your key and region!
const speechConfig = SpeechConfig.fromSubscription("89cdac66a8fc48348a331c52a8fa4de7","eastus");

>>>>>>> Stashed changes
@Component({
  selector: 'app-emplist',
  templateUrl: './emplist.component.html',
  styleUrls: ['./emplist.component.css'],
})
export class EmplistComponent implements OnInit, OnDestroy {
  constructor(private emplistService: EmplistService,private domSanitizer: DomSanitizer) {}
  sanitize(url: string) {
    return this.domSanitizer.bypassSecurityTrustUrl(url);
    }
  employeeId: number=0;
  preferredNameDefault: string="";
  blob: any;
  rating: number = 5;
  recording: boolean = false;
  title:string = 'micRecorder';
//Declare Record OBJ
  record:any;
//URL of Blob
  url:any;
  error:any;
  pronounce: boolean[] = [];
  private _searchid: string = '';
  employees: IEmployee[] = [];
  filteredEmployees: any[] = [];
  errorMessage: string = '';
  updatePreferredName: boolean = false;
  updatePhonetic: boolean = false;
  loginUser = '23890';

  pronounceName(employeeId: string, index: number) {
    this.pronounce[index] = true;
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
    successCallback(stream:any) {
      var options = {
      mimeType: "audio/wav",
      numberOfAudioChannels: 1,
      sampleRate: 16000,
      };
      //Start Actuall Recording
      var StereoAudioRecorder = RecordRTC.StereoAudioRecorder;
      this.record = new StereoAudioRecorder(stream, options);
      this.record.record();
  }
  stopRecording(employeeId: number,preferredNameDefault:boolean) {
    this.recording = false;
    this.employeeId=employeeId;
    this.preferredNameDefault=preferredNameDefault?.toString();
    this.record.stop(this.processRecording.bind(this));
    //update employee.recordedPronunciatio to true for the given employee id
  }

  processRecording(blob:any,employeeId:number,preferredNameDefault:boolean) {
    this.url = URL.createObjectURL(blob);
    console.log("blob", blob);
    let nametype=(preferredNameDefault)?"preferred":"default"
    
    this.emplistService.savePronunciation(this.employeeId,nametype,blob).subscribe({
      next: (result) => {
        console.log(result);
      },
      error: (err) => console.log(err),
    });
    console.log("url", this.url);
    }
    /**
    * Process Error.
    */
    errorCallback(error:any) {
    this.error = 'Can not play audio in your browser';
    }
  onSubmit(form: NgForm) {
    console.log('Submit came through', form.value);
    this.clearForm();
    //this.http.post(this.url, this.form);
  }

  clearForm() {
    this.updatePreferredName = false;
    this.updatePhonetic = false;
  }
  get searchid(): string {
    return this._searchid;
  }
  set searchid(value: string) {
    this._searchid = value;
    this.filteredEmployees = this.performFilter(value);
    this.pronounce.fill(false, 0, this.filteredEmployees.length);
  }
  performFilter(searchid: string): IEmployee[] {
    return this.employees.filter((employee: IEmployee) =>
      employee.empid.toString().startsWith(searchid)
    );
  }

  sub!: Subscription;
  ngOnInit(): void {
    this.sub = this.emplistService.employees$.subscribe({
      next: (employees) => {
        this.filteredEmployees = employees["employee-details"];
        this.employees = employees["employee-details"];
        this.pronounce.fill(false, 0, employees["employee-details"].length);
      },
      error: (err) => console.log(err),
    });
  }
  ngOnDestroy(): void {
    this.sub.unsubscribe();
  }
}
