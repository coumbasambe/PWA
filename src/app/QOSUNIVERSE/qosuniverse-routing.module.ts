import { Routes } from '@angular/router';
// import { StatutComponent } from './statut/statut.component';
// import { ParametreComponent } from './parametre/parametre.component';
// import { ComplexiteComponent } from './complexite/complexite.component';
// import { ChampsComponent } from './champs/champs.component';
// import { TypeComponent } from './type/type.component';
// import { DomaineComponent } from './domaine/domaine.component';
// import { SousDomaineComponent } from './sousDomaine/sousdomaine.component';
// import { MessagerieComponent } from './messagerie/messagerie.component';
// import { CouvertureComponent } from './couverture/couverture.component';
// import { TypologieComponent } from './typologie/typologie.component';
// import { PrioriteComponent } from './priorite/priorite.component';
// import { OrigineComponent } from './origine/origine.component';
// import { GroupeComponent } from './groupe/groupe.component';
// import { CourrierComponent } from './courrier/courrier.component';
// import { DetailsCourrierComponent } from './details-courrier/details-courrier.component';
// import { DetailsCouvertureComponent } from './details-couverture/details-couverture.component';
// import { MapComponent } from './map/map.component';
import { PlainteComponent } from './plainte/plainte.component';
// import { AdminComponent } from './admin-upload-file/admin.component';
import { DetailsPlainteComponent } from './details-plainte/details-plainte.component';


export const QosUniverseRoutes: Routes = [
  {
    path: '',
    children: [
      //   {
      //   path: 'courriers',
      //   component: CourrierComponent
      // },
      // {
      //   path: 'courrier/:id',
      //   component: DetailsCourrierComponent
      // },
      //  {
      //   path: 'couvertures',
      //   component: CouvertureComponent
      // },
      // {
      //   path: 'couverture/:id',
      //   component: DetailsCouvertureComponent
      // }, 
      // {
      //   path: 'map',
      //   component: MapComponent
      // }, {
      //   path: 'map/:lat/:lon',
      //   component: MapComponent
      // },
      {
        path: "plaintes",
        component: PlainteComponent,
      },
      {
        path: "plainte/:id",
        component: DetailsPlainteComponent,
      },
      // {
      //   path: "groupe",
      //   component: GroupeComponent,
      // },
      // {
      //   path: "type",
      //   component: TypeComponent,
      // },
      // {
      //   path: "typologie",
      //   component: TypologieComponent,
      // },
      // {
      //   path: "messagerie",
      //   component: MessagerieComponent,
      // },
      // {
      //   path: "sous-domaine",
      //   component: SousDomaineComponent,
      // },
      // {
      //   path: "domaine",
      //   component: DomaineComponent,
      // },
      // {
      //   path: "statut",
      //   component: StatutComponent,
      // },
      // {
      //   path: "origine",
      //   component: OrigineComponent,
      // },
      // {
      //   path: "champs",
      //   component: ChampsComponent,
      // },
      // {
      //   path: "admin",
      //   component: AdminComponent,
      // },
      // {
      //   path: "complexite",
      //   component: ComplexiteComponent,
      // },
      // {
      //   path: "priorite",
      //   component: PrioriteComponent,
      // },
      // {
      //   path: "parametre",
      //   component: ParametreComponent,
      // }
    ]
  }
];
