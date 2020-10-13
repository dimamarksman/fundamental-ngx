import {
    Component,
    OnInit,
    OnChanges,
    AfterContentInit,
    ElementRef,
    ViewEncapsulation,
    ChangeDetectionStrategy,
    Input,
    HostBinding,
    ContentChildren,
    QueryList,
    ChangeDetectorRef
} from '@angular/core';
import { startWith } from 'rxjs/operators';

import { applyCssClass, CssClassBuilder } from '../utils/public_api';

import {
    CLASS_NAME,
    DynamicSideContentPosition,
    DynamicSideContentSize,
    DYNAMIC_SIDE_CONTENT_CHILD_TOKEN
} from './constants';
import { DynamicSideMainComponent } from './dynamic-side-content-main.component';
import { DynamicSideSideComponent } from './dynamic-side-content-side.component';

let componentId = 0;

@Component({
    selector: 'fd-dynamic-side',
    templateUrl: './dynamic-side-content.component.html',
    styleUrls: ['./dynamic-side-content.component.scss'],
    encapsulation: ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class DynamicSideContentComponent implements CssClassBuilder, OnChanges, OnInit, AfterContentInit {
    /**
     * Side content position, can be 'left' | 'right' | 'bottom' | 'equalSplit' | 'none'.
     */
    @Input()
    set position(position: DynamicSideContentPosition) {
        this._position = position;

        this._calculateSidePosition();
    }
    get position(): DynamicSideContentPosition {
        return this._position;
    }

    /**
     * Screen size, can be 'sm' | 'md' | 'lg' | 'xl'.
     */
    @Input()
    size: DynamicSideContentSize = 'xl';

    /** Unique element Id, by default it's auto generated */
    @Input()
    @HostBinding('attr.id')
    id = 'fd-dynamic-side-content-id-' + componentId++;

    /**
     * @hidden
     * required by CssClassBuilder
     */
    class: string;

    /**
     * @hidden
     * Indicates when side content should be rendered before or after main content
     */
    _isSideBefore = true;

    /** @hidden */
    @ContentChildren(DYNAMIC_SIDE_CONTENT_CHILD_TOKEN as any)
    private _children: QueryList<DynamicSideMainComponent | DynamicSideSideComponent>;

    /** @hidden */
    private _isSideProjectedAsFirst = false;

    /** @hidden */
    private _position: DynamicSideContentPosition = 'none';

    /** @hidden */
    constructor(private _elementRef: ElementRef<HTMLElement>, private _changeDetectorRef: ChangeDetectorRef) {}

    /** @hidden */
    ngOnChanges(): void {
        this.buildComponentCssClass();
    }

    /** @hidden */
    ngOnInit(): void {
        this.buildComponentCssClass();
    }

    /** @hidden */
    ngAfterContentInit(): void {
        this._listenToChildrenOrder();
    }

    /** @hidden */
    @applyCssClass
    buildComponentCssClass(): string[] {
        return [
            CLASS_NAME.container,
            this.size === 'sm'
                ? CLASS_NAME.containerSizeSm
                : this.size === 'md' || this.size === 'lg'
                ? CLASS_NAME.containerSizeMd
                : this.size === 'xl'
                ? CLASS_NAME.containerSizeXl
                : '',
            this._position === 'bottom' ? CLASS_NAME.containerSideBelow : '',
            this._position === 'equalSplit' ? CLASS_NAME.containerSideEqual : ''
        ];
    }

    /** @hidden */
    elementRef(): ElementRef<any> {
        return this._elementRef;
    }

    /** @hidden */
    private _listenToChildrenOrder(): void {
        this._children.changes.pipe(startWith(this._children)).subscribe(() => {
            this._isSideProjectedAsFirst = this._children.first instanceof DynamicSideSideComponent;

            this._calculateSidePosition();

            this._changeDetectorRef.markForCheck();
        });
    }

    /** @hidden */
    private _calculateSidePosition(): void {
        const position = this._position;

        if (position === 'none' || position === 'equalSplit' || !position) {
            this._isSideBefore = this._isSideProjectedAsFirst;
        }

        if (position === 'left') {
            this._isSideBefore = true;
        }

        if (position === 'right' || position === 'bottom') {
            this._isSideBefore = false;
        }
    }
}
