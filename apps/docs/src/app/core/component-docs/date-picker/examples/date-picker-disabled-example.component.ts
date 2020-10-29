import { Component } from '@angular/core';
import { FdDate } from '@fundamental-ngx/core';

@Component({
    selector: 'fd-date-picker-disabled-example',
    template: ` <fd-date-picker [disabled]="true" type="single" [(ngModel)]="date"></fd-date-picker>
        <br />
        <div>Selected Date: {{ date || 'null' }}</div>`
})
export class DatePickerDisabledExampleComponent {
    date = new FdDate();
}
