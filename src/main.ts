/// <reference types="@angular/localize" />
import {Component, enableProdMode} from '@angular/core';
import {environment} from './environments/environment';
import {bootstrapApplication} from "@angular/platform-browser";
import {provideHttpClient, withInterceptorsFromDi} from "@angular/common/http";
import {provideRouter, RouterOutlet, withHashLocation} from "@angular/router";
import {routes} from "./app/routes";

if (environment.production) {
  enableProdMode();
}

@Component({
  selector: '[tchRoot]',
  imports: [RouterOutlet],
  template: '<div class="container-fluid"><router-outlet/></div>'
})
export class App {
}

bootstrapApplication(App, {
  providers: [
    provideHttpClient(withInterceptorsFromDi()),
    provideRouter(routes, withHashLocation())
  ]
});
