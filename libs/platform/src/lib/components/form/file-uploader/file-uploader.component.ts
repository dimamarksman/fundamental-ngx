import { Component, Optional, Self, ChangeDetectorRef, ChangeDetectionStrategy, Input } from '@angular/core';
import { NgControl, NgForm } from '@angular/forms';

import { BaseInput } from '../base.input';

@Component({
    selector: 'fdp-file-uploader',
    templateUrl: './file-uploader.component.html',
    styleUrls: ['./file-uploader.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class FileUploaderComponent extends BaseInput {
    @Input() buttonLabel: string = 'Browse';

    get value(): any {
        return this.getValue();
    }
    set value(selectValue: any) {
        this.setValue(selectValue);
    }

    constructor(
        protected _cd: ChangeDetectorRef,
        @Optional() @Self() public ngControl: NgControl,
        @Optional() @Self() public ngForm: NgForm
    ) {
        super(_cd, ngControl, ngForm);
    }

    ngOnInit(): void {
        //
    }

    ngAfterViewInit(): void {
        super.ngAfterViewInit();
    }
}
