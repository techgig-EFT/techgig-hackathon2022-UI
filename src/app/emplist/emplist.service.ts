import { HttpClient } from "@angular/common/http";
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
private pronounceUrl="http://localhost:5000/add-pronunciation";
constructor(private http:HttpClient){}
    employees$:Observable<any>=this.http.get<any>(this.empUrl).pipe(
        shareReplay(1),
        tap(data=> console.log(data,JSON.stringify(data)))
        );
    savePronunciation(empid:number,nametype:string,blob:any)
    {
        //var formData = new FormData();
        //formData.append('empid',empid.toString());
        //formData.append('nametype',nametype);
        //formData.append('file', blob , 'file')
        return this.http.get<any>(this.empUrl);}
    }