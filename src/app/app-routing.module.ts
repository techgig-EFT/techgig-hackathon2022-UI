import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AboutmeComponent } from './aboutme/aboutme.component';
import { EmpaddComponent } from './empadd/empadd.component';
import { EmplistComponent } from './emplist/emplist.component';

const routes: Routes = [
  {path:'employee-list',component:  EmplistComponent},
  {path:'about-me',component:  AboutmeComponent},
  {path:'add-employee',component:  EmpaddComponent},
  {path:'',redirectTo: 'employee-list', pathMatch:'full'}];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
