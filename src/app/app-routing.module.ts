import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {EasyPageComponent} from "./components/easy-page/easy-page.component";
import {MediumPageComponent} from "./components/medium-page/medium-page.component";
import {HardPageComponent} from "./components/hard-page/hard-page.component";

const routes: Routes = [
  {path: '', redirectTo: '/', pathMatch: 'full'},
  {path: 'easy', component: EasyPageComponent},
  {path: 'medium', component: MediumPageComponent},
  {path: 'hard', component: HardPageComponent},
  {path: '**', redirectTo: '/', pathMatch: 'full'}
]

@NgModule({
  imports: [
    RouterModule.forRoot(routes)
  ],
  exports: [
    RouterModule
  ]
})
export class AppRoutingModule {
}
