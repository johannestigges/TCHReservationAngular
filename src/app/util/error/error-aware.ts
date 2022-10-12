import { HttpErrorResponse } from '@angular/common/http';

export class ErrorAware {
	public httpError: HttpErrorResponse;
	public errorMessages: string[];

	public clearError() {
		this.httpError = undefined;
		this.errorMessages = [];
	}
}
