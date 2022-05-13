import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { IEmployee } from '../emplist/employees';

@Component({
  selector: 'app-empadd',
  templateUrl: './empadd.component.html',
  styleUrls: ['./empadd.component.css'],
})
export class EmpaddComponent implements OnInit {
  constructor(private http: HttpClient) {}
  recording: boolean = false;
  pronounce: boolean = false;
  addemployeeUrl="http://localhost:5000/add-employee-details"
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
  pronounceName(employeeId: string) {
    this.pronounce = true;
  }

  stopPronounceName(employeeId: string) {
    this.pronounce = false;
  }

  initiateRecording(employeeId: string) {
    this.recording = true;
  }
  stopRecording(employeeId: string) {
    this.recording = false;
    this.empdet.recordedPronunciation = true;
  }
  onSubmit() {
    console.log('Submit came through', this.empdet);

        return this.http.post<any>(this.addemployeeUrl,this.empdet).subscribe({
          next: (result) => {
            console.log(result);
          },
          error: (err) => console.log(err),
        });;
  }
}
