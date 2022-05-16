import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { AudioConfig, SpeechConfig, SpeechSynthesizer } from 'microsoft-cognitiveservices-speech-sdk';
import { EmplistService } from '../emplist/emplist.service';
import { IEmployee } from '../emplist/employees';

const speechConfig = SpeechConfig.fromSubscription("89cdac66a8fc48348a331c52a8fa4de7", "eastus");
@Component({
  selector: 'app-empadd',
  templateUrl: './empadd.component.html',
  styleUrls: ['./empadd.component.css'],
})
export class EmpaddComponent implements OnInit {

  constructor(private http: HttpClient,private domSanitizer: DomSanitizer,private emplistService:EmplistService) {}
  isUserLoggedin:boolean=false;
  ngOnInit(): void {
    this.emplistService.isUserLoggedin.subscribe(x=>
     {
      console.log(x);
      this.isUserLoggedin=x;
     }
      )
    
  }
  recording: boolean = false;
  message:string="";
  errorMessage:string="";
  pronounce: boolean = false;
  pronunciation:string=""
  preferredPronunciation:string=""
  host="https://name-pronunciation-api.azurewebsites.net/"
  addemployeeUrl=this.host+"add-employee-details"
  loading:boolean=false;
  empdet: IEmployee = {
    empid: '',
    name: '',
    location: 'Bangalore',
    country:'',
    contact: '',
    email:'',
    gender: '',
    performance: 5,
    notes: '',
    preferredName: '',
    phonetic: '',
    preferredNameDefault: false,
    recordedPronunciation: false,
  };



  sanitize(url: string) {
    return this.domSanitizer.bypassSecurityTrustUrl(url);
  }

  pronounceName(employeeName: string,nameType:string="default") {
    this.pronounce = true;
    this.loading=true;

    const audioConfig = AudioConfig.fromDefaultSpeakerOutput();
    const synthesizer = new SpeechSynthesizer(speechConfig, audioConfig);

    synthesizer.speakTextAsync(
      employeeName,
      result => {
        this.loading=false;
        if (result) {
          if(nameType=="preferred")
          this.preferredPronunciation = URL.createObjectURL(new Blob([new Uint8Array(result.audioData)]));
          else
          this.pronunciation = URL.createObjectURL(new Blob([new Uint8Array(result.audioData)]));
        }
        synthesizer.close();
      },
      error => {
        this.loading=false;
        console.log(error);
        synthesizer.close();
      });
  
  }

  stopPronounceName() {
    this.pronounce = false;
  }

  onSubmit() {
    this.loading=true;
    console.log('Submit came through', this.empdet);
        let formdata:any=this.empdet;
        formdata["preferredNameDefault"]=(formdata["preferredNameDefault"]==true)?1:0
        formdata["recordedPronunciation"]=(formdata["recordedPronunciation"]==true)?1:0
        console.log(formdata);
        return this.http.post<any>(this.addemployeeUrl,this.empdet).subscribe({
          next: (result) => {
            this.loading=false;
            this.message="Employee details added successfully";
            console.log(result);
            window.location.reload();
          },
          error: (err) => 
          { this.errorMessage="Form details couldnt be submitted";
            this.loading=false;
            console.log(err)},
        });
  }
}
