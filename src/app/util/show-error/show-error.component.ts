import { Component, Input, OnChanges } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { ErrorMessage } from '../error/error-message';

@Component({
	selector: 'tch-show-error',
	templateUrl: './show-error.component.html',
	styleUrls: ['./show-error.component.scss']
})
export class ShowErrorComponent implements OnChanges {

	@Input() httpError?: HttpErrorResponse;
	@Input() errorMessages: ErrorMessage[] = [];

	ngOnChanges() {
		this.analyzeHttpError();
	}

	private analyzeHttpError() {
		console.log('show error component analyze http error', this.httpError,this.httpError?.error,typeof this.httpError?.error);
		if (this.httpError?.error) {
			for (let e of this.httpError.error as ErrorMessage[]) {
				this.errorMessages.push(e);
			}
		}
	}
}

interface FieldMessage {
	field: string;
	message: string;
}
