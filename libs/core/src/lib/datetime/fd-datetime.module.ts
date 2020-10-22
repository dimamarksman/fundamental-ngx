import { NgModule } from '@angular/core';
import { PlatformModule } from '@angular/cdk/platform';

import { DatetimeAdapter } from './datetime-adapter';
import { FdDatetimeAdapter } from './fd-datetime-adapter';
import { DATE_FORMATS } from './datetime-formats';
import { FD_DATETIME_FORMATS } from './fd-date-formats';

@NgModule({
    imports: [PlatformModule],
    providers: [
        { provide: DatetimeAdapter, useClass: FdDatetimeAdapter },
        { provide: DATE_FORMATS, useValue: FD_DATETIME_FORMATS }
    ]
})
export class FdDatetimeModule {}
