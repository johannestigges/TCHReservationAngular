import { Component, Input, OnChanges } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
	selector: 'tch-show-error',
	templateUrl: './show-error.component.html',
	styleUrls: ['./show-error.component.scss']
})
export class ShowErrorComponent implements OnChanges {

	@Input() httpError: HttpErrorResponse;
	@Input() errorMessages: string[];

	ngOnChanges() {
		this.analyzeHttpError();
	}

	private analyzeHttpError() {
		if (this.httpError) {
			if (this.httpError.error) {
				this.errorMessages.push(this.httpError.error.message);
				if (this.httpError.error.fieldErrors) {
					this.httpError.error.fieldErrors.forEach((fe) => {
						this.errorMessages.push('Fehler im Feld ' + fe.field + ': ' + fe.message);
					});
				}
			} else if (this.httpError.message) {
				this.errorMessages.push(this.httpError.message);
			}
		}
	}
}
