import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { DownloadListComponent } from './components/download-list/download-list.component';
import { RecommendationsComponent } from './components/recommendations/recommendations.component';

const routes: Routes = [
  { path: '', component: DashboardComponent },
  { path: 'descargar-audios-matthew', component: DownloadListComponent },
  { path: 'pedir-audio-matthew', component: RecommendationsComponent },
  { path: '**', redirectTo: '', pathMatch: 'full' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
