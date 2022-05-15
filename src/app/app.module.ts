import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { EmplistComponent } from './emplist/emplist.component';
import { EmpaddComponent } from './empadd/empadd.component';
import { AboutmeComponent } from './aboutme/aboutme.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { FormsModule } from '@angular/forms';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { StarComponent } from './shared/star.component';
import { MsalModule, MsalRedirectComponent,MsalGuard,MsalInterceptor} from '@azure/msal-angular';
import { PublicClientApplication,InteractionType} from '@azure/msal-browser';
const isIE = window.navigator.userAgent.indexOf('MSIE ') > -1 || window.navigator.userAgent.indexOf('Trident/') > -1;

@NgModule({
  declarations: [
    AppComponent,
    EmplistComponent,
    EmpaddComponent,
    AboutmeComponent,
    StarComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    NgbModule,
    FormsModule,
    HttpClientModule,
    MsalModule.forRoot( new PublicClientApplication({
      auth: {
        clientId: '16161d3c-5487-465a-9f74-53ff04c1d432',
        authority: 'https://login.microsoftonline.com/e5727ff0-84f8-42ba-9c30-de24a8e8ceec', // The Azure cloud instance and the app's sign-in audience (tenant ID, common, organizations, or consumers)
        redirectUri: 'https://name-pronunciation-ui-eft.azurewebsites.net'// This is your redirect URI
      },
      cache: {
        cacheLocation: 'localStorage',
        storeAuthStateInCookie: isIE, // Set to true for Internet Explorer 11
      }
    }), {
          interactionType:InteractionType.Redirect,
          authRequest:{scopes:['user.read']}
        }, 
        {
          interactionType:InteractionType.Redirect,
          protectedResourceMap:new Map(
           [ ['https://graph.microsoft.com/v1.0/me',['user.read']]]
          )
            }
        )
  ],
  providers: [{
    provide:HTTP_INTERCEPTORS,
    useClass:MsalInterceptor,
    multi:true
},MsalGuard],
  bootstrap: [AppComponent, MsalRedirectComponent] 
})
export class AppModule { }
