import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { CardModule } from '@fundamental-ngx/core';

import { ApiComponent } from '../../../documentation/core-helpers/api/api.component';
import { API_FILES } from '../../api-files';
import { SharedDocumentationPageModule } from '../../../documentation/shared-documentation-page.module';

import { CardHeaderComponent } from './card-header/card-header.component';
import { CardDocsComponent } from './card-docs.component';
import { CardExampleComponent } from './examples/card-example.component';

const routes: Routes = [
    {
        path: '',
        component: CardHeaderComponent,
        children: [
            { path: '', component: CardDocsComponent },
            { path: 'api', component: ApiComponent, data: { content: API_FILES.card } }
        ]
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes), SharedDocumentationPageModule, CardModule],
    exports: [RouterModule],
    declarations: [CardDocsComponent, CardHeaderComponent, CardExampleComponent]
})
export class CardDocsModule {}
