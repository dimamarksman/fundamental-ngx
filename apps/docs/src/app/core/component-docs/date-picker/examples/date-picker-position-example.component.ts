import { Component } from '@angular/core';
import { FdDate } from '@fundamental-ngx/core';

@Component({
    selector: 'fd-date-picker-position-example',
    template: ` <fd-date-picker [placement]="'top-end'" [(ngModel)]="date"></fd-date-picker>
        <br />
        <div>Selected Date: {{ date || 'null' }}</div>`
})
export class DatePickerPositionExampleComponent {
    date = FdDate.getNow();
}
