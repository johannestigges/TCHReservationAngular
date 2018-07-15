import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { OccupationTableComponent } from './reservation/table/occupation-table.component';
import { ReservationAddComponent } from './reservation/add/reservation-add.component';
import { ReservationModifyComponent } from './reservation/modify/reservation-modify.component';
import { UserTableComponent } from './user/table/user-table.component';
import { UserModifyComponent } from './user/modify/user-modify.component';
import { UserAddComponent } from './user/add/user-add.component';
import { ProtocolTableComponent } from './protocol/table/protocol-table.component';
import { LoginComponent } from './login/login.component';

const routes: Routes = [
    { path: '', redirectTo: '/table/1', pathMatch: 'full' },
    { path: 'table/:system',                component: OccupationTableComponent },
    { path: 'table/:system',                component: OccupationTableComponent },
    { path: 'table/:system/:date',          component: OccupationTableComponent },
    { path: 'add/:system/:court/:date',     component: ReservationAddComponent },
    { path: 'modify/:system/:reservation',  component: ReservationModifyComponent },
    { path: 'user',                         component: UserTableComponent },
    { path: 'protocol',                     component: ProtocolTableComponent },
    { path: 'user/add',                     component: UserAddComponent },
    { path: 'user/modify/:user',            component: UserModifyComponent },
    { path: 'login',                        component: LoginComponent }
];

@NgModule( {
    imports: [RouterModule.forRoot( routes )],
    exports: [RouterModule]
} )

export class AppRoutingModule {
}
