import { animate, style, transition, trigger } from '@angular/animations';
import { ConnectedPosition } from '@angular/cdk/overlay';
import { AfterViewInit, ChangeDetectionStrategy, Component, ElementRef, HostBinding, Input } from '@angular/core';
import { BehaviorSubject, Observable, combineLatestWith, debounceTime, map } from 'rxjs';


@Component({
    selector: 'row-actions',
    template: `
        <span class="actions-trigger" cdkOverlayOrigin #trigger="cdkOverlayOrigin"></span>
        <ng-template cdkConnectedOverlay [cdkConnectedOverlayPositions]="overlayPositions" [cdkConnectedOverlayOrigin]="trigger" [cdkConnectedOverlayOpen]="!!(show$ | async)">
            <mat-toolbar [ngStyle]="{height: heightToolbar, minHeight: heightToolbar, maxHeight: heightToolbar}" [color]="color" (mouseenter)="hover$.next(true)" (mouseleave)="hover$.next(false)" @toolbarAppear>
                <ng-content></ng-content>
            </mat-toolbar>
        </ng-template>
    `,
    styles: [`
        .actions-trigger {
            display: flex;
            flex-grow: 1;
        }
        :host {
            position: relative;
            height: 100%;
            margin-top: -2px;
            display: flex;
        }
   `],
    animations: [
        trigger('toolbarAppear', [
            transition(':enter', [
                style({ opacity: 0 }), animate(300)
            ]),
            transition(':leave', [
                animate(300, style({ opacity: 0 }))
            ])
        ])
    ],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class RowActionComponent implements AfterViewInit {

    overlayPositions: ConnectedPosition[] = [{ originY: 'top', originX: 'end', overlayY: 'top', overlayX: 'end' }];

    open$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
    hover$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
    show$: Observable<boolean>;

    heightToolbar: string = '48px';

    constructor(
        private el: ElementRef,
    ) {
        this.show$ = this.open$.pipe(
            combineLatestWith(this.hover$),
            debounceTime(100),
            map(([open, hover]: [boolean, boolean]) => open || hover)
        );

    }
    ngAfterViewInit(): void {
        const parentElement = this.el.nativeElement.parentElement;
        const parentStyle = getComputedStyle(parentElement);
        this.heightToolbar = parentStyle.height;
        if (this.el.nativeElement.parentElement.children[0] === this.el.nativeElement) {
            this.overlayPositions = [{originY: 'top', originX: 'start', overlayY: 'top', overlayX: 'start'}];
            this.flexGrow = 0;
            this.left = -parseFloat(parentStyle.paddingLeft);
        } else if (this.el.nativeElement.parentElement.children[this.el.nativeElement.parentElement.children.length - 1] === this.el.nativeElement) {
            this.overlayPositions = [{ originY: 'top', originX: 'end', overlayY: 'top', overlayX: 'end' }];
            this.marginRight = -parseFloat(parentStyle.paddingRight);;
            this.flexGrow = 1;
        }
    }

    // We're right
    @HostBinding('style.margin-right.px')
    marginRight: number = 0;
    @HostBinding('style.flex-grow')
    flexGrow: number = 0;

    // We're left
    @HostBinding('style.left.px')
    left: number = 0;


    @Input()
    color: string = 'primary';

    @Input()
    set open(open: boolean) {
        this.open$.next(open);
    }
}
