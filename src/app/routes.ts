import {Routes} from '@angular/router';
import {OccupationTableComponent} from './reservation/table/occupation-table.component';
import {ReservationAddComponent} from './reservation/add/reservation-add.component';
import {ReservationModifyComponent} from './reservation/modify/reservation-modify.component';
import {UserTableComponent} from './admin/user/table/user-table.component';
import {UserModifyComponent} from './admin/user/modify/user-modify.component';
import {UserAddComponent} from './admin/user/add/user-add.component';
import {ProtocolTableComponent} from './admin/protocol/table/protocol-table.component';
import {LoginComponent} from './login/login.component';
import {SystemconfigTableComponent} from './admin/systemconfig/table/systemconfig-table.component';
import {SystemconfigAddComponent} from './admin/systemconfig/add/systemconfig-add.component';
import {SystemconfigModifyComponent} from './admin/systemconfig/modify/systemconfig-modify.component';
import {AdminComponent} from './admin/admin.component';
import {QrComponent} from './admin/user/qr/qr.component';
import {NewsAddComponent} from './admin/news/add/news-add.component';
import {NewsModifyComponent} from './admin/news/modify/news-modify.component';
import {NewsOverviewComponent} from './news/overview/news-overview.component';
import {NewsDetailComponent} from './news/detail/news-detail.component';

export const routes: Routes = [
  {path: '', redirectTo: '/table', pathMatch: 'full'},
  {path: 'table', component: OccupationTableComponent},
  {path: 'table/:system', component: OccupationTableComponent},
  {path: 'table/:system/:date', component: OccupationTableComponent},
  {path: 'add/:system/:court/:date', component: ReservationAddComponent},
  {path: 'modify/:system/:occupation', component: ReservationModifyComponent},
  {path: 'admin', component: AdminComponent},
  {path: 'protocol', component: ProtocolTableComponent},
  {path: 'systemconfig', component: SystemconfigTableComponent},
  {path: 'systemconfig/add', component: SystemconfigAddComponent},
  {path: 'systemconfig/modify/:id', component: SystemconfigModifyComponent},
  {path: 'user', component: UserTableComponent},
  {path: 'user/add', component: UserAddComponent},
  {path: 'user/modify/:user', component: UserModifyComponent},
  {path: 'user/qr', component: QrComponent},
  {path: 'admin/news', component: NewsOverviewComponent},
  {path: 'admin/news/add', component: NewsAddComponent},
  {path: 'admin/news/modify/:id', component: NewsModifyComponent},
  {path: 'news', component: NewsOverviewComponent},
  {path: 'news/:id', component: NewsDetailComponent},
  {path: 'login', component: LoginComponent}
];
