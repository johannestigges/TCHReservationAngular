import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { OccupationTableComponent } from './reservation/table/occupation-table.component';
import { ReservationAddComponent } from './reservation/add/reservation-add.component';
import { ReservationModifyComponent } from './reservation/modify/reservation-modify.component';

const routes: Routes = [
    { path: '', redirectTo: '/table/1/1', pathMatch: 'full' },
    { path: 'table/:system',                      component: OccupationTableComponent },
    { path: 'table/:system/:user',                component: OccupationTableComponent },
    { path: 'table/:system/:user/:date',          component: OccupationTableComponent },
    { path: 'add/:system/:user/:court/:date',     component: ReservationAddComponent },
    { path: 'modify/:system/:user/:reservation',  component: ReservationModifyComponent }
];

@NgModule( {
    imports: [RouterModule.forRoot( routes )],
    exports: [RouterModule]
} )

export class AppRoutingModule {
}
