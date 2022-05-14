import { HttpClient, HttpHeaders } from "@angular/common/http";
import {Injectable} from "@angular/core";
import { Observable } from "rxjs";
import {tap, shareReplay} from 'rxjs/operators';
import { IEmployee } from "./employees";
@Injectable(
    {providedIn:'root'
}
)
export class EmplistService{
private empUrl="http://localhost:5000/get-employee-details";
private savepronounceUrl="http://localhost:5000/add-pronunciation";
private getpronounceUrl="http://localhost:5000/get-pronunciation";
private updateemployeeUrl="http://localhost:5000/update-employee-details";
private removepronunciationUrl="http://localhost:5000/remove-pronunciation"

constructor(private http:HttpClient){}
    employees$:Observable<any>=this.http.get<any>(this.empUrl).pipe(
        shareReplay(1),
        tap(data=> console.log(data,JSON.stringify(data)))
        );
    savePronunciation(empid:number,nametype:string,blob:any)
    {
        var data = new FormData()
      data.append("blob", blob,"blob");
      data.append("empid",empid.toString());
      data.append("nametype",nametype);
      
        return this.http.post<any>(this.savepronounceUrl,data);
    }
    
    pronounceName(employeeId:number,employeeName:string)
    {
        return this.http.post<any>(this.getpronounceUrl,{"name":employeeName});

    }
    updateEmployeeDetails(form:any)
    {
        return this.http.post<any>(this.updateemployeeUrl,form);
    }
    removePronunciation(employeeId:string)
    {
        return this.http.post<any>(this.removepronunciationUrl,{"empid":employeeId});
    }
}