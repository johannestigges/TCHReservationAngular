import { Component, OnInit, Input } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';

@Component( {
    selector: 'app-show-error',
    templateUrl: './show-error.component.html',
    styleUrls: ['./show-error.component.css']
} )
export class ShowErrorComponent implements OnInit {

    @Input() httpError: HttpErrorResponse;
    @Input() errorMessages: string[];

    constructor() { }
    ngOnInit() { }

    ngOnChanges() {
        this.analyzeHttpError();
    }

    private analyzeHttpError() {
        if ( this.httpError ) {
            if ( this.httpError.error ) {
                this.errorMessages.push( this.httpError.error.message );
                if ( this.httpError.error.fieldErrors ) {
                    this.httpError.error.fieldErrors.forEach(( fe ) => { 
                        this.errorMessages.push( 'Fehler im Feld ' + fe.field + ': ' + fe.message ) 
                        } );
                }
            } else if ( this.httpError.message ) {
                this.errorMessages.push(this.httpError.message);
            }
        }
    }
}
