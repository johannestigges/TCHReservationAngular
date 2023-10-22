# Tennisclub Havixbeck e.V. Reservation System

Reservation System for our tennis courts.

## ToDo

- [x] create user with qr code
- [x] reset password with qr code
- [x] select reservation system not working
- [x] migrate from mysql to postgres
- [ ] add cancellation time to system config
- [ ] repeated Occupations: improve Button Handling
- [ ] repeated Occupations: skip overlap; generate all others
- [ ] Field Error Messages
- [ ] Logo
- [x] Colors
- [ ] add 'hideText' to reservationType
- [ ] remove maxDuration, MaxReservationInFututr from systemconfig
- [ ] use hours instead of days for all max values

## Development server

Run `npm start` for a dev server. Navigate to `http://localhost:4200/`. The app will automatically reload if you change any of the source files.

## Code scaffolding

Run `ng generate component component-name` to generate a new component. You can also use `ng generate directive|pipe|service|class|module`.

## Build

Run `ng build` to build the project. The build artifacts will be stored in the `dist/` directory. Use the `-prod` flag for a production build.

## Running unit tests

Run `ng test` to execute the unit tests via [Karma](https://karma-runner.github.io).

## Running end-to-end tests

Run `ng e2e` to execute the end-to-end tests via [Protractor](http://www.protractortest.org/).
Before running the tests make sure you are serving the app via `ng serve`.

## Further help

To get more help on the Angular CLI use `ng help` or go check out the [Angular CLI README](https://github.com/angular/angular-cli/blob/master/README.md).
