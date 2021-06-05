import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { CookieService } from 'ngx-cookie-service';
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { ReservationService } from './reservation/reservation.service';
import { OccupationTableComponent } from './reservation/table/occupation-table.component';
import { ReservationAddComponent } from './reservation/add/reservation-add.component';
import { ReservationModifyComponent } from './reservation/modify/reservation-modify.component';
import { UserTableComponent } from './admin/user/table/user-table.component';
import { UserModifyComponent } from './admin/user/modify/user-modify.component';
import { UserAddComponent } from './admin/user/add/user-add.component';
import { ProtocolTableComponent } from './admin/protocol/table/protocol-table.component';
import { ProtocolService } from './admin/protocol/protocol.service';
import { UserService } from './admin/user/user.service';
import { AutofocusDirective } from './autofocus.directive';
import { LoginComponent } from './login/login.component';
import { ShowErrorComponent } from './util/show-error/show-error.component';
import { CorsInterceptor } from './cors-interceptor';
import { SystemconfigTableComponent } from './admin/systemconfig/table/systemconfig-table.component';
import { SystemconfigService } from './admin/systemconfig/systemconfig.service';
import { SystemconfigAddComponent } from './admin/systemconfig/add/systemconfig-add.component';
import { SystemconfigModifyComponent } from './admin/systemconfig/modify/systemconfig-modify.component';
import { AdminComponent } from './admin/admin.component';

@NgModule({
    declarations: [
        AppComponent,
        OccupationTableComponent,
        ReservationAddComponent,
        ReservationModifyComponent,
        AdminComponent,
        UserTableComponent,
        UserAddComponent,
        UserModifyComponent,
        ProtocolTableComponent,
        SystemconfigTableComponent,
        SystemconfigAddComponent,
        SystemconfigModifyComponent,
        AutofocusDirective,
        LoginComponent,
        ShowErrorComponent
    ],
    imports: [
        BrowserModule,
        BrowserAnimationsModule,
        BsDatepickerModule.forRoot(),
        AppRoutingModule,
        RouterModule,
        FormsModule,
        ReactiveFormsModule,
        HttpClientModule
    ],
    providers: [
        ReservationService,
        UserService,
        ProtocolService,
        SystemconfigService,
        CookieService,
        {
            provide: HTTP_INTERCEPTORS,
            useClass: CorsInterceptor,
            multi: true
        }
    ],
    bootstrap: [AppComponent]
})
export class AppModule { }
