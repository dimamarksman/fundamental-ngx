import { Component } from '@angular/core';
import {
    FdDate,
    DatetimeAdapter,
    FdDatetimeAdapter,
    DateTimeFormats,
    DATE_TIME_FORMATS,
    FD_DATETIME_FORMATS
} from '@fundamental-ngx/core';

/**
 * FD_DATETIME_FORMATS is based on Intl.DateTimeFormat,
 * see the doc https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl/DateTimeFormat
 */

export const CUSTOM_FD_DATETIME_FORMATS: DateTimeFormats = {
    ...FD_DATETIME_FORMATS,
    display: {
        ...FD_DATETIME_FORMATS.display,
        dateTimeInput: {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        }
    }
};

@Component({
    selector: 'fd-datetime-format-example',
    templateUrl: './datetime-format-example.component.html',
    providers: [
        {
            provide: DatetimeAdapter,
            useClass: FdDatetimeAdapter
        },
        {
            provide: DATE_TIME_FORMATS,
            useValue: CUSTOM_FD_DATETIME_FORMATS
        }
    ]
})
export class DatetimeFormatExampleComponent {
    date = FdDate.getNow();
}
