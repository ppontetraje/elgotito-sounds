import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { DownloadListComponent } from './components/download-list/download-list.component';

const routes: Routes = [
  
  { path: '', component: DashboardComponent },
  {path:'descargar-audios-matthew', component:DownloadListComponent},
  {path:'**', redirectTo: '', pathMatch: 'full'},

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
