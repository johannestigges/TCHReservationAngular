import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { ReservationService } from './reservation/reservation.service';
import { OccupationTableComponent } from './reservation/table/occupation-table.component';
import { ReservationAddComponent } from './reservation/add/reservation-add.component';
import { ReservationModifyComponent } from './reservation/modify/reservation-modify.component';
import { UserTableComponent } from './user/table/user-table.component';
import { UserModifyComponent } from './user/modify/user-modify.component';
import { UserAddComponent } from './user/add/user-add.component';
import { UserService } from './user/user.service';
import { AutofocusDirective } from './autofocus.directive';
import { LoginComponent } from './login/login.component';
import { ShowErrorComponent } from './show-error/show-error.component';
//import { KeyPipe } from './key-pipe';


@NgModule( {
    declarations: [
        AppComponent,
        OccupationTableComponent,
        ReservationAddComponent,
        ReservationModifyComponent,
        UserTableComponent,
        UserAddComponent,
        UserModifyComponent,
        AutofocusDirective,
        LoginComponent,
        ShowErrorComponent
    ],
    imports: [
        BrowserModule,
        AppRoutingModule,
        RouterModule,
        FormsModule,
        HttpClientModule
    ],
    providers: [ReservationService, UserService],
    bootstrap: [AppComponent]
} )
export class AppModule { }
