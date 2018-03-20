import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { OccupationService } from './occupation/occupation.service';
import { OccupationTableComponent } from './occupation/table/occupation-table.component';
import { OccupationAddComponent } from './occupation/add/occupation-add.component';
import { OccupationModifyComponent } from './occupation/modify/occupation-modify.component';
import { UserService } from './user/user.service';
import { AutofocusDirective } from './autofocus.directive';


@NgModule( {
    declarations: [
        AppComponent,
        OccupationTableComponent,
        OccupationAddComponent,
        OccupationModifyComponent,
        AutofocusDirective
    ],
    imports: [
        BrowserModule,
        AppRoutingModule,
        RouterModule,
        FormsModule
    ],
    providers: [OccupationService, UserService],
    bootstrap: [AppComponent]
} )
export class AppModule { }
