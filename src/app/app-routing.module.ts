import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import {EasyPageComponent} from "./components/easy-page/easy-page.component";
import {DashboardComponent} from "./components/dashboard/dashboard.component";

const routes: Routes = [
  {path: 'easy', component: EasyPageComponent}
]

@NgModule({
  imports: [
    RouterModule.forRoot(routes)
  ],
  exports: [
    RouterModule
  ]
})
export class AppRoutingModule { }
