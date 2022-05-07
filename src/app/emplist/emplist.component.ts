import { THIS_EXPR } from '@angular/compiler/src/output/output_ast';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Observable, Subscription } from 'rxjs';
import { EmplistService } from './emplist.service';
import { IEmployee } from './employees';
@Component({
  selector: 'app-emplist',
  templateUrl: './emplist.component.html',
  styleUrls: ['./emplist.component.css'],
})
export class EmplistComponent implements OnInit, OnDestroy {
  constructor(private emplistService: EmplistService) {}

  rating: number = 5;
  recording: boolean = false;
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
  }
  stopRecording(employeeId: string) {
    this.recording = false;
    //update employee.recordedPronunciation to true for the given employee id
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
      employee.empid.startsWith(searchid)
    );
  }

  sub!: Subscription;
  ngOnInit(): void {
    this.sub = this.emplistService.employees$.subscribe({
      next: (employees) => {
        this.filteredEmployees = employees;
        this.employees = employees;
        this.pronounce.fill(false, 0, employees.length);
      },
      error: (err) => console.log(err),
    });
  }
  ngOnDestroy(): void {
    this.sub.unsubscribe();
  }
}
