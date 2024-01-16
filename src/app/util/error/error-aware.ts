import { HttpErrorResponse } from '@angular/common/http';
import { ErrorMessage } from './error-message';

export class ErrorAware {
	public httpError?: HttpErrorResponse;
	public errorMessages: ErrorMessage[] = [];
	
	public clearError() {
		this.httpError = undefined;
		this.errorMessages = [];
	}
	
	public setError(httpError: HttpErrorResponse) {
		console.log('error aware set error', httpError);
		this.httpError = httpError;
		this.errorMessages = [{message: JSON.stringify(httpError)}];
	}
	
	public addErrorMessage(message:string, field :string|undefined = undefined) {
		this.errorMessages.push({message,field});
	}
	
	public getFieldError(field: string) {
		return this.errorMessages.find(e => field === e.field);
	}
}
