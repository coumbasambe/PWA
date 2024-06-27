// declare var require: any;
import { NouisliderModule } from 'ng2-nouislider';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MdModule } from '../md/md.module';
import { MaterialModule } from '../app.module';
import { NgMultiSelectDropDownModule } from 'ng-multiselect-dropdown';
import { MatSelectModule } from '@angular/material/select';

// import { HighchartsStatic } from 'angular2-highcharts/dist/HighchartsService';
// import { ParametreComponent } from './parametre/parametre.component';

// import { PlainteKPIComponent } from './plainte_kpi/plainte_kpi.component';
// import { QosReportComponent } from './qos-report/qos-report.component';
import { QosUniverseRoutes } from './qosuniverse-routing.module';
// import { ComplexiteComponent } from './complexite/complexite.component';
// // import { BrowserModule } from '@angular/platform-browser';
// import { StatutComponent } from './statut/statut.component';
// import { ChampsComponent } from './champs/champs.component';
// import { TypeComponent } from './type/type.component';
// import { DomaineComponent } from './domaine/domaine.component';
// import { SousDomaineComponent } from './sousDomaine/sousdomaine.component';
import { MatNativeDateModule } from '@angular/material/core';
import { ActionGroupService } from '../pages/auth/actionGroup.service';
import { AuthGuard } from '../pages/auth/auth-guard.service';
import { AuthService } from '../pages/auth/auth.service';
import { BaseService } from '../shared/base.service';
import { NotificationService } from '../shared/services/notifications';
import { qosUniverseService } from '../shared/qosUniverseService';
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
import { AdminListComponent } from './list_admin/admin_list.component';
import { DetailsPlainteComponent } from './details-plainte/details-plainte.component';
import { GroupListComponent } from './list_group/group_list.component';
import { UserListComponent } from './list_user/user_list.component';


// export function highchartsFactory() {
//     const hc = require('highcharts/highstock');
//     const dd = require('highcharts/modules/exporting');
//     const de = require('highcharts/highcharts-3d.js');
//     dd(hc);
//     de(hc);
//     return hc;
//     }
@NgModule({
    imports: [
        CommonModule,
        RouterModule.forChild(QosUniverseRoutes),
        FormsModule,
        // BrowserModule,
        ReactiveFormsModule,
        MdModule,
        MaterialModule,
        NouisliderModule,
        MatSelectModule,

        // ChartModule,
        NgMultiSelectDropDownModule.forRoot(),
        // DataTablesModule.forRoot()
    ],
    // exports:[
    //     RouterModule
    // ],
    declarations: [
        // CourrierComponent,
        // CouvertureComponent,
        // MapComponent,
        // DetailsCouvertureComponent,
        // DetailsCourrierComponent,
        PlainteComponent,
        DetailsPlainteComponent,
        // GroupeComponent,
        // TypeComponent,
        // ChampsComponent,
        // TypologieComponent,
        // MessagerieComponent,
        // SousDomaineComponent,
        // DomaineComponent,
        // StatutComponent,
        // OrigineComponent,
        // PrioriteComponent,
        // ParametreComponent,
        AdminListComponent,
        UserListComponent,
        GroupListComponent,
        // PlainteKPIComponent,
        // AdminComponent,
        // QosReportComponent,
        // ComplexiteComponent
        ],
    providers: [
        // {
        //     provide: HighchartsStatic,
        //     useFactory: highchartsFactory
        // }
        MatNativeDateModule,
        AuthService,
        ActionGroupService,
        BaseService,
        NotificationService,
        AuthService,
        AuthGuard,
        ActionGroupService,
        qosUniverseService
    ]
})

export class QosUniverseModule {}
