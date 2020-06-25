import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { Component, ViewChildren, QueryList } from '@angular/core';
import { FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FormModule } from '@fundamental-ngx/core';
import { FdpFormGroupModule } from './../form-group/fdp-form.module';
import { CheckboxGroupComponent } from './checkbox-group.component';
import { CheckboxComponent } from '../checkbox/checkbox.component';
import { SelectItem } from '../../../domain/data-model';
import { PlatformCheckboxModule } from '../checkbox/checkbox.module';
import { By } from '@angular/platform-browser';

@Component({
    selector: 'fdp-cbg-reactive-test',
    template: `
        <fdp-form-group [multiLayout]="true" [formGroup]="form1" [object]="formData">
            <fdp-form-field
                #fl1
                [id]="'phones'"
                [label]="'Phones interested in:'"
                zone="zLeft"
                rank="1"
                [required]="true"
            >
                <fdp-checkbox-group
                    [list]="phoneslist"
                    [name]="'brands'"
                    [formControl]="fl1.formControl"
                ></fdp-checkbox-group>
            </fdp-form-field>

            <fdp-form-field #fl2 [id]="'visited'" [label]="'Country visited: '" zone="zLeft" rank="1" [required]="true">
                <fdp-checkbox-group
                    [list]="countryVisited"
                    [name]="'visited'"
                    [formControl]="fl2.formControl"
                ></fdp-checkbox-group>
            </fdp-form-field>

            <fdp-form-field #fl3 [id]="'hobbies'" [label]="'My Hobbies:'" zone="zLeft" rank="1" [required]="true">
                <fdp-checkbox-group [name]="'hobby'" [formControl]="fl3.formControl">
                    <fdp-checkbox [value]="'cooking'" [label]="'Cooking'"></fdp-checkbox>
                    <fdp-checkbox [value]="'painting'" [label]="'Painting'"></fdp-checkbox>
                    <fdp-checkbox [value]="'coding'" [label]="'Coding'"></fdp-checkbox>
                    <fdp-checkbox [value]="'gardening'" [label]="'Gardening'"></fdp-checkbox>
                </fdp-checkbox-group>
            </fdp-form-field>

            <fdp-form-field
                #fl4
                [id]="'language'"
                [label]="'Languages Known: '"
                zone="zLeft"
                rank="1"
                [required]="true"
            >
                <fdp-checkbox-group
                    [list]="languages"
                    [name]="'language'"
                    [formControl]="fl4.formControl"
                ></fdp-checkbox-group>
            </fdp-form-field>

            <fdp-form-field #fl5 [id]="'fruits'" [label]="'Fruits:'" zone="zLeft" rank="1" [required]="true">
                <fdp-checkbox-group [name]="'fruits'" [formControl]="fl5.formControl">
                    <fdp-checkbox [value]="'apple'" [label]="'Apple'" [disabled]="true"></fdp-checkbox>
                    <fdp-checkbox [value]="'banana'" [label]="'Banana'"></fdp-checkbox>
                    <fdp-checkbox [value]="'guava'" [label]="'Guava'" [disabled]="true"></fdp-checkbox>
                    <fdp-checkbox [value]="'papaya'" [label]="'Papaya'"></fdp-checkbox>
                </fdp-checkbox-group>
            </fdp-form-field>

            <ng-template #i18n let-errors>
                <ng-container *ngIf="errors.required">
                    One or more options selection is necessary.
                </ng-container>
            </ng-template>
        </fdp-form-group>
    `
})
class TestReactiveCheckboxGroupComponnet {
    phoneslist: string[] = ['Samsung', 'Apple', 'OnePlus', 'Redmi'];
    countryVisited = [new Country('Australia', 'Australia'), new Country('India', 'India'), new Country('USA', 'USA')];

    languages = [
        new LanguageKnown('Java', 'java', false),
        new LanguageKnown('Javascript', 'javascript', true),
        new LanguageKnown('Python', 'python', false),
        new LanguageKnown('GoLang', 'go', true)
    ];

    form1 = new FormGroup({});
    formData = { phones: ['Samsung', 'OnePlus'], visited: ['India', 'USA'], hobbies: ['coding', 'gardening'] };

    @ViewChildren(CheckboxComponent)
    checkboxGroups: QueryList<CheckboxGroupComponent>;
}

describe('CheckboxGroup component Reactive Form Test', () => {
    let host: TestReactiveCheckboxGroupComponnet;
    let fixture: ComponentFixture<TestReactiveCheckboxGroupComponnet>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            imports: [FdpFormGroupModule, FormModule, PlatformCheckboxModule, FormsModule, ReactiveFormsModule],
            declarations: [TestReactiveCheckboxGroupComponnet, CheckboxGroupComponent, CheckboxComponent]
        }).compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(TestReactiveCheckboxGroupComponnet);
        host = fixture.componentInstance;
        fixture.detectChanges();
    });

    async function wait(componentFixture: ComponentFixture<any>) {
        componentFixture.detectChanges();
        await componentFixture.whenStable();
    }

    it('should create', () => {
        expect(host).toBeTruthy();
    });

    it('should create checkboxes from list of given string values', async () => {
        await wait(fixture);
        fixture.detectChanges();
        const fdpCheckboxElem = fixture.debugElement.queryAll(By.css('.fd-checkbox__label'));

        // pre-select test
        expect(host.form1.controls.phones.value).toEqual(['Samsung', 'OnePlus']);

        // select checkbox on click
        fdpCheckboxElem[1].nativeElement.click();
        await wait(fixture);
        fixture.detectChanges();

        fdpCheckboxElem[3].nativeElement.click();
        await wait(fixture);
        fixture.detectChanges();

        expect(host.form1.controls.phones.value).toEqual(['Samsung', 'OnePlus', 'Apple', 'Redmi']);

        // de-select checked checkbox on click
        fdpCheckboxElem[3].nativeElement.click();
        await wait(fixture);
        fixture.detectChanges();

        fdpCheckboxElem[2].nativeElement.click();
        await wait(fixture);
        fixture.detectChanges();

        expect(host.form1.controls.phones.value).toEqual(['Samsung', 'Apple']);
    });

    it('should show error, when all checkboxes are unchecked. checkboxes from list of given string values', async () => {
        await wait(fixture);
        fixture.detectChanges();
        const fdpCheckboxElem = fixture.debugElement.queryAll(By.css('.fd-checkbox__label'));

        // pre-select test
        expect(host.form1.controls.phones.value).toEqual(['Samsung', 'OnePlus']);

        // select checkbox on click
        fdpCheckboxElem[0].nativeElement.click();
        await wait(fixture);
        fixture.detectChanges();

        fdpCheckboxElem[2].nativeElement.click();
        await wait(fixture);
        fixture.detectChanges();

        expect(host.form1.controls.phones.value).toEqual([]);

        // Error validation.
        expect(host.form1.controls.phones.invalid).toBeTruthy();

        // error state set to checkbox.
        const inputElem = fixture.debugElement.queryAll(By.css('.fd-checkbox'))[2];
        expect(inputElem.nativeElement.getAttribute('ng-reflect-ng-class')).toEqual('is-error');
    });

    // test cases for checbox group created from list of selectItem Objects.
    it('should create checkboxes from list of given selectItem Objects', async () => {
        await wait(fixture);
        fixture.detectChanges();
        const fdpCheckboxElem = fixture.debugElement.queryAll(By.css('.fd-checkbox__label'));

        // pre-select test
        expect(host.form1.controls.visited.value).toEqual(['India', 'USA']);

        // select checkbox on click
        fdpCheckboxElem[4].nativeElement.click();
        await wait(fixture);
        fixture.detectChanges();

        expect(host.form1.controls.visited.value).toEqual(['India', 'USA', 'Australia']);

        // de-select checked checkbox on click
        fdpCheckboxElem[5].nativeElement.click();
        await wait(fixture);
        fixture.detectChanges();

        fdpCheckboxElem[6].nativeElement.click();
        await wait(fixture);
        fixture.detectChanges();

        expect(host.form1.controls.visited.value).toEqual(['Australia']);
    });

    it('should show error, when all checkboxes are unchecked. checkboxes from list of given selectItem Objects', async () => {
        await wait(fixture);
        fixture.detectChanges();
        const fdpCheckboxElem = fixture.debugElement.queryAll(By.css('.fd-checkbox__label'));

        // pre-select test
        expect(host.form1.controls.visited.value).toEqual(['India', 'USA']);

        // select checkbox on click
        fdpCheckboxElem[5].nativeElement.click();
        await wait(fixture);
        fixture.detectChanges();

        fdpCheckboxElem[6].nativeElement.click();
        await wait(fixture);
        fixture.detectChanges();

        expect(host.form1.controls.visited.value).toEqual([]);

        // Error validation.
        expect(host.form1.controls.visited.invalid).toBeTruthy();

        // error state set to checkbox.
        const inputElem = fixture.debugElement.queryAll(By.css('.fd-checkbox'))[6];
        expect(inputElem.nativeElement.getAttribute('ng-reflect-ng-class')).toEqual('is-error');
    });

    // checkbox group created from passed checkboxes.

    // test cases for checbox group created from list of selectItem Objects.
    it('should create checkbox group from passed checkboxes', async () => {
        await wait(fixture);
        fixture.detectChanges();
        const fdpCheckboxElem = fixture.debugElement.queryAll(By.css('.fd-checkbox__label'));

        // pre-select test
        expect(host.form1.controls.hobbies.value).toEqual(['coding', 'gardening']);

        // select checkbox on click
        fdpCheckboxElem[7].nativeElement.click();
        await wait(fixture);
        fixture.detectChanges();

        fdpCheckboxElem[8].nativeElement.click();
        await wait(fixture);
        fixture.detectChanges();

        expect(host.form1.controls.hobbies.value).toEqual(['coding', 'gardening', 'cooking', 'painting']);

        // de-select checked checkbox on click
        fdpCheckboxElem[9].nativeElement.click();
        await wait(fixture);
        fixture.detectChanges();

        fdpCheckboxElem[10].nativeElement.click();
        await wait(fixture);
        fixture.detectChanges();

        expect(host.form1.controls.hobbies.value).toEqual(['cooking', 'painting']);
    });

    it('should show error, when all checkboxes are unchecked.checkbox group created from passed checkboxes.', async () => {
        await wait(fixture);
        fixture.detectChanges();
        const fdpCheckboxElem = fixture.debugElement.queryAll(By.css('.fd-checkbox__label'));

        // pre-select test
        expect(host.form1.controls.hobbies.value).toEqual(['coding', 'gardening']);

        // select checkbox on click
        fdpCheckboxElem[9].nativeElement.click();
        await wait(fixture);
        fixture.detectChanges();

        fdpCheckboxElem[10].nativeElement.click();
        await wait(fixture);
        fixture.detectChanges();

        expect(host.form1.controls.hobbies.value).toEqual([]);

        // Error validation.
        expect(host.form1.controls.hobbies.invalid).toBeTruthy();

        // error state set to checkbox.
        const inputElem = fixture.debugElement.queryAll(By.css('.fd-checkbox'))[10];
        expect(inputElem.nativeElement.getAttribute('ng-reflect-ng-class')).toEqual('is-error');
    });

    it('should create checkbox group with enabled and disabled checkboxes from SelectItem object', async () => {
        await wait(fixture);
        fixture.detectChanges();

        const fdpCheckboxElem = fixture.debugElement.queryAll(By.css('fdp-checkbox'));
        expect(fdpCheckboxElem[11].nativeElement.getAttribute('ng-reflect-is-disabled')).toEqual('false');
        expect(fdpCheckboxElem[12].nativeElement.getAttribute('ng-reflect-is-disabled')).toEqual('true');
        expect(fdpCheckboxElem[13].nativeElement.getAttribute('ng-reflect-is-disabled')).toEqual('false');
        expect(fdpCheckboxElem[14].nativeElement.getAttribute('ng-reflect-is-disabled')).toEqual('true');
    });

    it('should create checkbox group with enabled and disabled checkboxes from passed checkboxes', async () => {
        await wait(fixture);
        fixture.detectChanges();

        const fdpCheckboxElem = fixture.debugElement.queryAll(By.css('fdp-checkbox'));
        expect(fdpCheckboxElem[15].nativeElement.getAttribute('ng-reflect-is-disabled')).toEqual('true');
        expect(fdpCheckboxElem[16].nativeElement.getAttribute('ng-reflect-is-disabled')).toBeFalsy();
        expect(fdpCheckboxElem[17].nativeElement.getAttribute('ng-reflect-is-disabled')).toEqual('true');
        expect(fdpCheckboxElem[18].nativeElement.getAttribute('ng-reflect-is-disabled')).toBeFalsy();
    });
});

@Component({
    selector: 'fdp-cbg-template-driven-test',
    template: `
        <fdp-form-group [multiLayout]="true">
            <fdp-form-field
                #fl1
                [id]="'phones'"
                [label]="'Phones interested in:'"
                zone="zLeft"
                rank="1"
                [required]="true"
            >
                <fdp-checkbox-group [list]="phoneslist" [name]="'brands'" [(ngModel)]="phones"></fdp-checkbox-group>
            </fdp-form-field>

            <fdp-form-field #fl2 [id]="'visited'" [label]="'Country visited: '" zone="zLeft" rank="1" [required]="true">
                <fdp-checkbox-group
                    [list]="countryVisited"
                    [name]="'visited'"
                    [(ngModel)]="visited"
                ></fdp-checkbox-group>
            </fdp-form-field>

            <fdp-form-field #fl3 [id]="'hobbies'" [label]="'My Hobbies:'" zone="zLeft" rank="1" [required]="true">
                <fdp-checkbox-group [name]="'hobby'" [(ngModel)]="hobbies">
                    <fdp-checkbox [value]="'cooking'" [label]="'Cooking'"></fdp-checkbox>
                    <fdp-checkbox [value]="'painting'" [label]="'Painting'"></fdp-checkbox>
                    <fdp-checkbox [value]="'coding'" [label]="'Coding'"></fdp-checkbox>
                    <fdp-checkbox [value]="'gardening'" [label]="'Gardening'"></fdp-checkbox>
                </fdp-checkbox-group>
            </fdp-form-field>

            <fdp-form-field [id]="'language'" [label]="'Languages Known: '" zone="zLeft" rank="1" [required]="true">
                <fdp-checkbox-group [list]="languages" [name]="'language'" [(ngModel)]="language"></fdp-checkbox-group>
            </fdp-form-field>

            <fdp-form-field [id]="'fruits'" [label]="'Fruits:'" zone="zLeft" rank="1" [required]="true">
                <fdp-checkbox-group [name]="'fruits'" [(ngModel)]="fruits">
                    <fdp-checkbox [value]="'apple'" [label]="'Apple'" [disabled]="true"></fdp-checkbox>
                    <fdp-checkbox [value]="'banana'" [label]="'Banana'"></fdp-checkbox>
                    <fdp-checkbox [value]="'guava'" [label]="'Guava'" [disabled]="true"></fdp-checkbox>
                    <fdp-checkbox [value]="'papaya'" [label]="'Papaya'"></fdp-checkbox>
                </fdp-checkbox-group>
            </fdp-form-field>

            <ng-template #i18n let-errors>
                <ng-container *ngIf="errors.required">
                    One or more options selection is necessary.
                </ng-container>
            </ng-template>
        </fdp-form-group>
    `
})
class TestTemplateDrivenCheckboxGroupComponnet {
    phoneslist: string[] = ['Samsung', 'Apple', 'OnePlus', 'Redmi'];
    countryVisited = [new Country('Australia', 'Australia'), new Country('India', 'India'), new Country('USA', 'USA')];
    phones = ['Samsung', 'OnePlus'];
    visited = ['India', 'USA'];
    hobbies = ['coding', 'gardening'];

    fruits = '';
    languages = [
        new LanguageKnown('Java', 'java', false),
        new LanguageKnown('Javascript', 'javascript', true),
        new LanguageKnown('Python', 'python', false),
        new LanguageKnown('GoLang', 'go', true)
    ];
}

describe('Checkbox Group Component Template driven Form Tests', () => {
    let host: TestTemplateDrivenCheckboxGroupComponnet;
    let fixture: ComponentFixture<TestTemplateDrivenCheckboxGroupComponnet>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            imports: [FdpFormGroupModule, FormModule, PlatformCheckboxModule, FormsModule],
            declarations: [TestTemplateDrivenCheckboxGroupComponnet, CheckboxGroupComponent, CheckboxComponent]
        }).compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(TestTemplateDrivenCheckboxGroupComponnet);
        host = fixture.componentInstance;
        fixture.detectChanges();
    });

    async function wait(componentFixture: ComponentFixture<any>) {
        componentFixture.detectChanges();
        await componentFixture.whenStable();
    }

    it('should create', () => {
        expect(host).toBeTruthy();
    });

    it('should create checkboxes from list of given string values', async () => {
        await wait(fixture);
        fixture.detectChanges();
        const fdpCheckboxElem = fixture.debugElement.queryAll(By.css('.fd-checkbox__label'));

        // pre-select test
        expect(host.phones).toEqual(['Samsung', 'OnePlus']);

        // select checkbox on click
        fdpCheckboxElem[1].nativeElement.click();
        await wait(fixture);
        fixture.detectChanges();

        fdpCheckboxElem[3].nativeElement.click();
        await wait(fixture);
        fixture.detectChanges();

        expect(host.phones).toEqual(['Samsung', 'OnePlus', 'Apple', 'Redmi']);

        // de-select checked checkbox on click
        fdpCheckboxElem[3].nativeElement.click();
        await wait(fixture);
        fixture.detectChanges();

        fdpCheckboxElem[2].nativeElement.click();
        await wait(fixture);
        fixture.detectChanges();

        expect(host.phones).toEqual(['Samsung', 'Apple']);
    });

    it('should show error, when all checkboxes are unchecked. checkboxes from list of given string values', async () => {
        await wait(fixture);
        fixture.detectChanges();
        const fdpCheckboxElem = fixture.debugElement.queryAll(By.css('.fd-checkbox__label'));
        const inputElem1 = fixture.debugElement.queryAll(By.css('.fd-checkbox'));

        // pre-select test
        expect(inputElem1[0].nativeElement.getAttribute('ng-reflect-model')).toEqual('true');
        expect(inputElem1[1].nativeElement.getAttribute('ng-reflect-model')).toEqual('false');
        expect(inputElem1[2].nativeElement.getAttribute('ng-reflect-model')).toEqual('true');
        expect(inputElem1[3].nativeElement.getAttribute('ng-reflect-model')).toEqual('false');
        expect(host.phones).toEqual(['Samsung', 'OnePlus']);

        // select checkbox on click
        fdpCheckboxElem[0].nativeElement.click();
        await wait(fixture);
        fixture.detectChanges();

        fdpCheckboxElem[2].nativeElement.click();
        await wait(fixture);
        fixture.detectChanges();

        expect(host.phones).toEqual([]);

        // error state set to checkbox.
        const inputElem2 = fixture.debugElement.queryAll(By.css('.fd-checkbox'))[2];
        expect(inputElem2.nativeElement.getAttribute('ng-reflect-ng-class')).toEqual('is-error');
    });

    // test cases for checbox group created from list of selectItem Objects.
    it('should create checkboxes from list of given selectItem Objects', async () => {
        await wait(fixture);
        fixture.detectChanges();
        const fdpCheckboxElem = fixture.debugElement.queryAll(By.css('.fd-checkbox__label'));

        // pre-select test
        expect(host.visited).toEqual(['India', 'USA']);

        // select checkbox on click
        fdpCheckboxElem[4].nativeElement.click();
        await wait(fixture);
        fixture.detectChanges();

        expect(host.visited).toEqual(['India', 'USA', 'Australia']);

        // de-select checked checkbox on click
        fdpCheckboxElem[5].nativeElement.click();
        await wait(fixture);
        fixture.detectChanges();

        fdpCheckboxElem[6].nativeElement.click();
        await wait(fixture);
        fixture.detectChanges();

        expect(host.visited).toEqual(['Australia']);
    });

    it('should show error, when all checkboxes are unchecked. checkboxes from list of given selectItem Objects', async () => {
        await wait(fixture);
        fixture.detectChanges();
        const fdpCheckboxElem = fixture.debugElement.queryAll(By.css('.fd-checkbox__label'));

        // pre-select test
        expect(host.visited).toEqual(['India', 'USA']);

        // select checkbox on click
        fdpCheckboxElem[5].nativeElement.click();
        await wait(fixture);
        fixture.detectChanges();

        fdpCheckboxElem[6].nativeElement.click();
        await wait(fixture);
        fixture.detectChanges();

        expect(host.visited).toEqual([]);

        // error state set to checkbox.
        const inputElem = fixture.debugElement.queryAll(By.css('.fd-checkbox'))[6];
        expect(inputElem.nativeElement.getAttribute('ng-reflect-ng-class')).toEqual('is-error');
    });

    // checkbox group created from passed checkboxes.

    // test cases for checbox group created from list of selectItem Objects.
    it('should create checkbox group from passed checkboxes', async () => {
        await wait(fixture);
        fixture.detectChanges();
        const fdpCheckboxElem = fixture.debugElement.queryAll(By.css('.fd-checkbox__label'));

        // pre-select test
        expect(host.hobbies).toEqual(['coding', 'gardening']);

        // select checkbox on click
        fdpCheckboxElem[7].nativeElement.click();
        await wait(fixture);
        fixture.detectChanges();

        fdpCheckboxElem[8].nativeElement.click();
        await wait(fixture);
        fixture.detectChanges();

        expect(host.hobbies).toEqual(['coding', 'gardening', 'cooking', 'painting']);

        // de-select checked checkbox on click
        fdpCheckboxElem[9].nativeElement.click();
        await wait(fixture);
        fixture.detectChanges();

        fdpCheckboxElem[10].nativeElement.click();
        await wait(fixture);
        fixture.detectChanges();

        expect(host.hobbies).toEqual(['cooking', 'painting']);
    });

    it('should show error, when all checkboxes are unchecked.checkbox group created from passed checkboxes.', async () => {
        await wait(fixture);
        fixture.detectChanges();
        const fdpCheckboxElem = fixture.debugElement.queryAll(By.css('.fd-checkbox__label'));

        // pre-select test
        expect(host.hobbies).toEqual(['coding', 'gardening']);

        // select checkbox on click
        fdpCheckboxElem[9].nativeElement.click();
        await wait(fixture);
        fixture.detectChanges();

        fdpCheckboxElem[10].nativeElement.click();
        await wait(fixture);
        fixture.detectChanges();

        expect(host.hobbies).toEqual([]);

        // error state set to checkbox.
        const inputElem = fixture.debugElement.queryAll(By.css('.fd-checkbox'))[10];
        expect(inputElem.nativeElement.getAttribute('ng-reflect-ng-class')).toEqual('is-error');
    });

    it('should create checkbox group with enabled and disabled checkboxes from SelectItem object', async () => {
        await wait(fixture);
        fixture.detectChanges();

        const fdpCheckboxElem = fixture.debugElement.queryAll(By.css('fdp-checkbox'));
        expect(fdpCheckboxElem[11].nativeElement.getAttribute('ng-reflect-is-disabled')).toEqual('false');
        expect(fdpCheckboxElem[12].nativeElement.getAttribute('ng-reflect-is-disabled')).toEqual('true');
        expect(fdpCheckboxElem[13].nativeElement.getAttribute('ng-reflect-is-disabled')).toEqual('false');
        expect(fdpCheckboxElem[14].nativeElement.getAttribute('ng-reflect-is-disabled')).toEqual('true');
    });

    it('should create checkbox group with enabled and disabled checkboxes from passed checkboxes', async () => {
        await wait(fixture);
        fixture.detectChanges();

        const fdpCheckboxElem = fixture.debugElement.queryAll(By.css('fdp-checkbox'));
        expect(fdpCheckboxElem[15].nativeElement.getAttribute('ng-reflect-is-disabled')).toEqual('true');
        expect(fdpCheckboxElem[16].nativeElement.getAttribute('ng-reflect-is-disabled')).toBeFalsy();
        expect(fdpCheckboxElem[17].nativeElement.getAttribute('ng-reflect-is-disabled')).toEqual('true');
        expect(fdpCheckboxElem[18].nativeElement.getAttribute('ng-reflect-is-disabled')).toBeFalsy();
    });
});

class Country implements SelectItem {
    constructor(public label: string, public value: string) {}
}

class LanguageKnown implements SelectItem {
    constructor(public label: string, public value: string, public disabled: boolean) {}
}
