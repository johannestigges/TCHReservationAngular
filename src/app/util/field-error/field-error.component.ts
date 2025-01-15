
import { Component, Input } from '@angular/core';

@Component({
    selector: 'tch-field-error',
    imports: [],
    templateUrl: './field-error.component.html'
})
export class FieldErrorComponent {
  @Input() fieldErrors = new Map<string, string>();
  @Input() field = '';
}
