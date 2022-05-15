import { Component, Inject, INJECTOR, OnDestroy, OnInit } from '@angular/core';
import {MsalGuardConfiguration,MSAL_GUARD_CONFIG,MsalBroadcastService,MsalService} from '@azure/msal-angular';
import { InteractionStatus, RedirectRequest } from '@azure/msal-browser';
import { filter, Subject, takeUntil } from 'rxjs';
import { environment } from 'src/environments/environment';
import { EmplistService } from './emplist/emplist.service';
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit,OnDestroy {
  private readonly _destroy=new Subject<void>();
  constructor(@Inject(MSAL_GUARD_CONFIG) private msalGaurdConfig:MsalGuardConfiguration, private msalBroadCastService:MsalBroadcastService,private authService:MsalService, private emplistService:EmplistService){}
  ngOnInit(): void 
  {
    this.msalBroadCastService.inProgress$.pipe(
      filter((interactionStatus:InteractionStatus)=>interactionStatus==InteractionStatus.None),
      takeUntil(this._destroy)
    )
      .subscribe(x=>
        {
          this.userLoggedin=this.authService.instance.getAllAccounts().length>0;
          this.emplistService.isUserLoggedin.next(this.userLoggedin);
        })
    }
  ngOnDestroy(): void {
    this._destroy.next(undefined);
    this._destroy.complete();
  }
  title = 'name-pronunciation-tool';
  userLoggedin:boolean=false;
  login()
  {
    if(this.msalGaurdConfig.authRequest)
    {
      this.authService.loginRedirect({...this.msalGaurdConfig.authRequest} as RedirectRequest)
    }
    else
    {
      this.authService.loginRedirect();
    }
  }
  logout()
  {
    this.userLoggedin=false;
    this.authService.logoutRedirect({postLogoutRedirectUri:environment.postLogoutUrl});
  }
}
