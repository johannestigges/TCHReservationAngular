import { Component, OnInit, Input } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-show-error',
  templateUrl: './show-error.component.html',
  styleUrls: ['./show-error.component.css']
})
export class ShowErrorComponent implements OnInit {

  @Input() httpError: HttpErrorResponse;
  @Input() errorMessage: string;
  
  constructor() { }
   
  ngOnChanges() {
      if (this.httpError) {
          this.errorMessage = JSON.stringify(this.httpError);
      }
  }
  
  ngOnInit() {
  }
}
