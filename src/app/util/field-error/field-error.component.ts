
import { Component, Input, ChangeDetectionStrategy } from '@angular/core';

@Component({
    selector: 'tch-field-error',
    imports: [],
    changeDetection: ChangeDetectionStrategy.Eager,
    templateUrl: './field-error.component.html'
})
export class FieldErrorComponent {
  @Input() fieldErrors = new Map<string, string>();
  @Input() field = '';
}
