import { HttpErrorResponse } from '@angular/common/http';
import { ErrorMessage } from './error-message';

export class ErrorAware {
	public httpError?: HttpErrorResponse;
	public errorMessages: ErrorMessage[] = [];
	public fieldErrors = new Map<string, string>();

	public clearError() {
		this.httpError = undefined;
		this.errorMessages = [];
		this.fieldErrors.clear();
	}

	public setError(httpError: HttpErrorResponse) {
		this.clearError();
		console.log('error aware set error', httpError);
		this.httpError = httpError;
		this.analyzeHttpError();
	}

	public addErrorMessage(message: string) {
		this.errorMessages.push({ message });
	}
	
	public addFieldError(field: string, message: string) {
		this.fieldErrors.set(field, message);
	}

	private analyzeHttpError() {
		if (this.httpError?.error) {
			for (const e of this.httpError.error as ErrorMessage[]) {
				if (e.field) {
					this.fieldErrors.set(e.field, e.message);
				} else {
					this.errorMessages.push(e);
				}
			}
			if (!this.errorMessages.length && !this.fieldErrors.size) {
				this.errorMessages.push({ message: JSON.stringify(this.httpError) });
			}

		}
	}

}
