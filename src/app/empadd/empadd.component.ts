import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { AudioConfig, SpeechConfig, SpeechSynthesizer } from 'microsoft-cognitiveservices-speech-sdk';
import { IEmployee } from '../emplist/employees';

const speechConfig = SpeechConfig.fromSubscription("89cdac66a8fc48348a331c52a8fa4de7", "eastus");
@Component({
  selector: 'app-empadd',
  templateUrl: './empadd.component.html',
  styleUrls: ['./empadd.component.css'],
})
export class EmpaddComponent implements OnInit {
  constructor(private http: HttpClient,private domSanitizer: DomSanitizer) {}
  
  recording: boolean = false;
  message:string="";
  errorMessage:string="";
  pronounce: boolean = false;
  pronunciation:string=""
  preferredPronunciation:string=""
  host="https://name-pronunciation-api.azurewebsites.net/"
  addemployeeUrl=host+"add-employee-details"
  empdet: IEmployee = {
    empid: '',
    name: '',
    location: 'Bangalore',
    contact: '',
    gender: '',
    performance: 5,
    notes: '',
    preferredName: '',
    phonetic: '',
    preferredNameDefault: false,
    recordedPronunciation: false,
  };
  ngOnInit(): void {}
  sanitize(url: string) {
    return this.domSanitizer.bypassSecurityTrustUrl(url);
  }
  pronounceName(employeeName: string,nameType:string="default") {
    this.pronounce = true;

    const audioConfig = AudioConfig.fromDefaultSpeakerOutput();
    const synthesizer = new SpeechSynthesizer(speechConfig, audioConfig);

    synthesizer.speakTextAsync(
      employeeName,
      result => {
        if (result) {
          if(nameType=="preferred")
          this.preferredPronunciation = URL.createObjectURL(new Blob([new Uint8Array(result.audioData)]));
          else
          this.pronunciation = URL.createObjectURL(new Blob([new Uint8Array(result.audioData)]));
        }
        synthesizer.close();
      },
      error => {
        console.log(error);
        synthesizer.close();
      });
  
  }

  stopPronounceName() {
    this.pronounce = false;
  }

  onSubmit() {
    console.log('Submit came through', this.empdet);
        let formdata:any=this.empdet;
        formdata["preferredNameDefault"]=(formdata["preferredNameDefault"]==true)?1:0
        formdata["recordedPronunciation"]=(formdata["recordedPronunciation"]==true)?1:0
        console.log(formdata)
        return this.http.post<any>(this.addemployeeUrl,this.empdet).subscribe({
          next: (result) => {
            this.message="Employee details added successfully";
            console.log(result);
            window.location.reload();
          },
          error: (err) => 
          { this.errorMessage="Form details couldnt be submitted"
            console.log(err)},
        });;
  }
}
