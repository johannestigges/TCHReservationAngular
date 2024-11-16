import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HTTP_INTERCEPTORS, provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
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
import { LoginComponent } from './login/login.component';
import { ShowErrorComponent } from './util/show-error/show-error.component';
import { CorsInterceptor } from './cors-interceptor';
import { SystemconfigTableComponent } from './admin/systemconfig/table/systemconfig-table.component';
import { SystemconfigService } from './admin/systemconfig/systemconfig.service';
import { SystemconfigAddComponent } from './admin/systemconfig/add/systemconfig-add.component';
import { SystemconfigModifyComponent } from './admin/systemconfig/modify/systemconfig-modify.component';
import { AdminComponent } from './admin/admin.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { QRCodeModule } from 'angularx-qrcode';
import { QrComponent } from './admin/user/qr/qr.component';
import { ReservationTypeComponent } from './admin/systemconfig/reservation-type/reservation-type.component';
import { ReservationTypesComponent } from './admin/systemconfig/reservation-types/reservation-types.component';
import { SelectFilterComponent } from './util/select-filter/select-filter.component';
import { NewsAddComponent } from './admin/news/add/news-add.component';
import { NewsModifyComponent } from './admin/news/modify/news-modify.component';
import { NewsAdminOverviewComponent } from './admin/news/overview/news-admin-overview.component';
import { NewsOverviewComponent } from './news/overview/news-overview.component';
import { NewsDetailComponent } from './news/detail/news-detail.component';
import { NewsLinkComponent } from './news/link/news-link.component';
import { FieldErrorComponent } from './util/field-error/field-error.component';

@NgModule({ declarations: [
	AppComponent,
	OccupationTableComponent,
	ReservationAddComponent,
	ReservationModifyComponent,
	AdminComponent,
	UserTableComponent,
	UserAddComponent,
	UserModifyComponent,
	QrComponent,
	SelectFilterComponent,
	ProtocolTableComponent,
	SystemconfigTableComponent,
	SystemconfigAddComponent,
	SystemconfigModifyComponent,
	LoginComponent,
	ShowErrorComponent,
	ReservationTypeComponent,
	ReservationTypesComponent,
	NewsAdminOverviewComponent,
	NewsAddComponent,
	NewsModifyComponent,
	NewsOverviewComponent,
	NewsDetailComponent,
	NewsLinkComponent
],
bootstrap: [AppComponent], imports: [BrowserModule,
	BrowserAnimationsModule,
	AppRoutingModule,
	RouterModule,
	FormsModule,
	ReactiveFormsModule,
	QRCodeModule,
	FieldErrorComponent,
	NgbModule], providers: [
	ReservationService,
	UserService,
	ProtocolService,
	SystemconfigService,
	{
		provide: HTTP_INTERCEPTORS, useClass: CorsInterceptor, multi: true,
	},
	provideHttpClient(withInterceptorsFromDi()),
] })
export class AppModule { }
