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
private host="https://name-pronunciation-api.azurewebsites.net/"
private empUrl=this.host+"get-employee-details";
private savepronounceUrl=this.host+"add-pronunciation";
private getpronounceUrl=this.host+"get-pronunciation";
private updateemployeeUrl=this.host+"update-employee-details";
private removepronunciationUrl=this.host+"remove-pronunciation"

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