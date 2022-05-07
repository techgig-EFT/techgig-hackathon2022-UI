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
private empUrl='assets/employees.json';
constructor(private http:HttpClient){}
    employees$:Observable<IEmployee[]>=this.http.get<IEmployee[]>(this.empUrl).pipe(
        shareReplay(1),
        tap(data=> console.log(data,JSON.stringify(data)))
        );
}