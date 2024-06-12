import { Routes } from '@angular/router';

import { AdminLayoutComponent } from './layouts/admin/admin-layout.component';
import { AuthLayoutComponent } from './layouts/auth/auth-layout.component';
import { LoginComponent } from './pages/login/login.component';
import { PlainteComponent } from './QOSUNIVERSE/plainte/plainte.component';

export const AppRoutes: Routes = [

  {
    path: '',
    redirectTo: 'pages',
    pathMatch: 'full'
  },
  {
    path: 'pages',
    loadChildren: () => import('./pages/pages.module').then(m => m.PagesModule)
  },
  {
    path: '',
    component: AdminLayoutComponent,
    children: [
      {
        path: '',
        loadChildren: () => import('./dashboard/dashboard.module').then(m => m.DashboardModule)
      },
      {
        path: 'home',
        loadChildren: () => import('./home/home.module').then(m => m.HomeModule)
      },
      {
        path: 'components',
        loadChildren: () => import('./components/components.module').then(m => m.ComponentsModule)
      },
      {
        path: 'qosUniverse',
        loadChildren: () => import('./QOSUNIVERSE/qosuniverse.module').then(m => m.QOSUNIVERSEModule)
      },
      {
        path: 'forms',
        loadChildren: () => import('./forms/forms.module').then(m => m.Forms)
      }, {
        path: 'tables',
        loadChildren: () => import('./tables/tables.module').then(m => m.TablesModule)
      }, {
        path: 'maps',
        loadChildren: () => import('./maps/maps.module').then(m => m.MapsModule)
      }, {
        path: 'widgets',
        loadChildren: () => import('./widgets/widgets.module').then(m => m.WidgetsModule)
      }, {
        path: 'charts',
        loadChildren: () => import('./charts/charts.module').then(m => m.ChartsModule)
      }, {
        path: 'calendar',
        loadChildren: () => import('./calendar/calendar.module').then(m => m.CalendarModule)
      }
      // },
      // {
      //     path: 'pages',
      //     loadChildren: () => import('./pages/pages.module').then(m => m.PagesModule)
      // }

      // {
      //     path: '',
      //     loadChildren: () => import('./userpage/user.module').then(m => m.UserModule)
      // }, {
      //     path: '',
      //     loadChildren: () => import('./timeline/timeline.module').then(m => m.TimelineModule)
      // }
    ]
  }
];
