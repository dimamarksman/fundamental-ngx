import { Component, OnInit, ChangeDetectionStrategy, ElementRef, Renderer2 } from '@angular/core';

import { CLASS_NAME } from '../constants';

@Component({
    selector: 'fd-card-kpi-scale-icon',
    template: '<ng-content></ng-content>',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class CardKpiScaleIconComponent implements OnInit {
    /** @hidden */
    constructor(private _elementRef: ElementRef<HTMLElement>, private _renderer: Renderer2) {}

    /** @hidden */
    ngOnInit(): void {
        this._addClassNameToHostElement(CLASS_NAME.cardAnalyticsScaleIcon);
    }

    /**@hidden */
    private _addClassNameToHostElement(className: string): void {
        this._renderer.addClass(this._elementRef.nativeElement, className);
    }
}
