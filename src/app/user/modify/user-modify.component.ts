import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';

import { UserService } from '../../user/user.service';
import { User } from '../../user/user';
import { UserRole } from '../user-role.enum';
import { ActivationStatus } from '../activation-status.enum';
import { ErrorAware } from '../../error/error-aware';


@Component( {
    selector: 'user-modify',
    templateUrl: './user-modify.component.html',
    styleUrls: ['./user-modify.component.css']
} )
export class UserModifyComponent extends ErrorAware {

    role_values: string[];
    status_values: string[];
    user_role: string;
    user_status: string;
    user: User;
    loggedinUser: User
    confirmPassword: string;
    isAdmin = false;

    constructor( private route: ActivatedRoute, private userService: UserService, private location: Location ) {
        super();
    }

    ngOnInit() {

        this.role_values = Object.keys( UserRole ).map( key => UserRole[key] )
            .filter( value => typeof value === 'string' );
        this.status_values = Object.keys( ActivationStatus ).map( key => ActivationStatus[key] )
            .filter( value => typeof value === 'string' );

        const id = this.route.snapshot.params['user'];
        this.userService.getUser( id ).subscribe(
            data => {
                this.user = data;
                this.confirmPassword = this.user.password;
                this.user_role = "" + this.user.role;
                this.user_status = "" + this.user.status;
            },
            err => {
                this.httpError = err;
            },
            () => {
                //        console.log("finished read user " + id);
            }
        );

        this.userService.getLoggedInUser().subscribe(
            data => {
                this.loggedinUser = new User(data.id, data.name, UserRole["" + data.role]);
                this.isAdmin = this.loggedinUser.hasRole(UserRole.ADMIN);
            },
            err => {
                this.httpError = err;
            },
            () => { }
        );
    }

    onClick() {
        this.clearError();
        if ( this.user.password !== this.confirmPassword ) {
            this.errorMessages.push( 'Passwörter stimmen nicht überein!' );
            return;
        }
        this.user.role = UserRole[this.user_role];
        this.user.status = ActivationStatus[this.user_status];

        this.userService.updateUser( this.user ).subscribe(
            data => {
                this.user = data;
                this.cancel();
            },
            err => {
                this.httpError = err;
            },
            () => {
                this.cancel();
            }
        );
    }

    cancel() {
        this.location.back();
    }
}
