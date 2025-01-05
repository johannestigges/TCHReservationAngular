import { Component, Input } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { ErrorMessage } from '../error/error-message';
import {KeyValuePipe, NgFor} from "@angular/common";

@Component({
    selector: 'tch-show-error',
    templateUrl: './show-error.component.html',
    styleUrls: ['./show-error.component.scss'],
    imports:[NgFor, KeyValuePipe],
    standalone: true
})
export class ShowErrorComponent {

	@Input() httpError?: HttpErrorResponse;
	@Input() errorMessages: ErrorMessage[] = [];
	@Input() fieldErrors: Map<string, string> = new Map();
}
