import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { EmplistService } from '../emplist/emplist.service';
const GRAPH_ENDPOINT='https://graph.microsoft.com/v1.0/me';
const GRAPH_ENDPOINT_PIC='https://graph.microsoft.com/v1.0/me/photo/$value';

@Component({
  selector: 'app-aboutme',
  templateUrl: './aboutme.component.html',
  styleUrls: ['./aboutme.component.css']
})

export class AboutmeComponent implements OnInit {

  constructor(private emplistService:EmplistService,private http:HttpClient) { }
  isUserLoggedin:boolean=false;
  userProfile:any;
  firstName:string="";
  lastName:string="";
  initial:string="";
  ngOnInit(): void {
    this.emplistService.isUserLoggedin.subscribe(x=>
     {
      console.log(x);
      this.isUserLoggedin=x;
     }
      )

      this.http.get<any>(GRAPH_ENDPOINT).subscribe(
        (data)=>{
          this.userProfile=data;
          let name=data.displayName.split('.');
          console.log(name);
          if(name.length>0)
            {this.firstName=name[0];
            this.initial=this.firstName[0].toUpperCase();
            }

          if(name.length>1)
            {this.lastName=name[1];
            this.initial+=this.lastName[0].toUpperCase();
            }
          console.log(data);}
      )
    
  }

}
