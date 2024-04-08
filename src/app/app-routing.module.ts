import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PlaintesComponent } from './plaintes/plaintes.component';
import { AdminComponent } from './admin/admin.component';
import { FormulaireComponent } from './formulaire/formulaire.component';
import { DetailPlainteComponent } from './detail-plainte/detail-plainte.component';

const routes: Routes = [

  {
    path: "plaintes",
    component: PlaintesComponent,
  },
  {
    path: "admin",
    component: AdminComponent,
  },
  {
    path: "formulaire",
    component: FormulaireComponent,
  },
  {
    path: "detailPlainte",
    component: DetailPlainteComponent,
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
