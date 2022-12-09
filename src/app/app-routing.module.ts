import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { DownloadListComponent } from './components/download-list/download-list.component';

const routes: Routes = [
  
  { path: '', component: DashboardComponent },
  {path:'audio', component:DownloadListComponent},
  {path:'**',component:DashboardComponent},

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
