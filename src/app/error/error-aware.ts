import { Component, OnInit, Input } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';


export class ErrorAware {

    public httpError: HttpErrorResponse;
    public errorMessages: string[];

    constructor() { }

    public clearError() {
        this.httpError = undefined;
        this.errorMessages = [];
    }
}