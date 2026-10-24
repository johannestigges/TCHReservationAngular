/// <reference types="@angular/localize" />
import {Component, enableProdMode, provideZoneChangeDetection, ChangeDetectionStrategy} from '@angular/core';
import {environment} from './environments/environment';
import {bootstrapApplication} from "@angular/platform-browser";
import {provideHttpClient, withInterceptorsFromDi, withXhr} from "@angular/common/http";
import {provideRouter, RouterOutlet, withHashLocation} from "@angular/router";
import {routes} from "./app/routes";

if (environment.production) {
  enableProdMode();
}

@Component({
  selector: '[tchRoot]',
  imports: [RouterOutlet],
  changeDetection: ChangeDetectionStrategy.Eager,
  template: '<div class="container-fluid"><router-outlet/></div>'
})
export class App {
}

bootstrapApplication(App, {
  providers: [
    provideZoneChangeDetection(),provideHttpClient(withXhr(), withInterceptorsFromDi()),
    provideRouter(routes, withHashLocation())
  ]
});
