import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PlainteComponent } from './plainte/plainte.component';
import { PlainteKPIComponent } from './plainte_kpi/plainte_kpi.component';

export const routes: Routes = [
  {
    path: '',
    children: [{
      path: 'plaintes',
      component: PlainteComponent
    },
  ]
  },
  {
    path: '',
    children: [{
      path: 'plainte_kpi',
      component: PlainteKPIComponent
    },
  ]
  }
  // {
  // path: '',
  // children: [ {
  //   path: 'extended',
  //   component: ExtendedFormsComponent
  // }]
  // }, {
  // path: '',
  // children: [ {
  //   path: 'validation',
  //   component: ValidationFormsComponent
  // }]
  // }, {
  //     path: '',
  //     children: [ {
  //         path: 'wizard',
  //         component: WizardComponent
  //     }]
  // }
];
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class QOSUNIVERSERoutingModule { }