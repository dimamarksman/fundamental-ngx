import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { FormModule as FdFormModule, ButtonModule, FileInputModule } from '@fundamental-ngx/core';

import { FileUploaderComponent } from './file-uploader.component';

@NgModule({
    declarations: [FileUploaderComponent],
    exports: [FileUploaderComponent],
    imports: [CommonModule, FormsModule, ReactiveFormsModule, FdFormModule, ButtonModule, FileInputModule]
})
export class FileUploaderModule {}
