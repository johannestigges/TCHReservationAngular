import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { OccupationTableComponent } from './occupation/table/occupation-table.component';
import { OccupationAddComponent } from './occupation/add/occupation-add.component';
import { OccupationModifyComponent } from './occupation/modify/occupation-modify.component';

const routes: Routes = [
    { path: '', redirectTo: '/table/1/1', pathMatch: 'full' },
    { path: 'table/:system',                      component: OccupationTableComponent },
    { path: 'table/:system/:user',                component: OccupationTableComponent },
    { path: 'table/:system/:user/:date',          component: OccupationTableComponent },
    { path: 'add/:system/:user/:court/:date',     component: OccupationAddComponent },
    { path: 'modify/:system/:user/:reservation',  component: OccupationModifyComponent }
];

@NgModule( {
    imports: [RouterModule.forRoot( routes )],
    exports: [RouterModule]
} )

export class AppRoutingModule {
}
