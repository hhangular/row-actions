import { animate, state, style, transition, trigger } from '@angular/animations';
import { ConnectedPosition, OverlayModule } from '@angular/cdk/overlay';
import { AsyncPipe, NgStyle } from '@angular/common';
import { AfterViewInit, ChangeDetectionStrategy, Component, ElementRef, HostBinding, Input } from '@angular/core';
import { MatToolbarModule } from '@angular/material/toolbar';
import { BehaviorSubject, Observable, combineLatestWith, debounceTime, map } from 'rxjs';


@Component({
  selector: 'row-actions',
  standalone: true,
  template: `
        <span class="actions-trigger" cdkOverlayOrigin #trigger="cdkOverlayOrigin"></span>
        <ng-template cdkConnectedOverlay [cdkConnectedOverlayPositions]="overlayPositions" [cdkConnectedOverlayOrigin]="trigger" [cdkConnectedOverlayOpen]="!!(show$ | async)">
          <mat-toolbar [ngStyle]="{height: heightToolbar, minHeight: heightToolbar, maxHeight: heightToolbar}" [color]="color"
            (mouseenter)="hover$.next(true)" (mouseleave)="hover$.next(false)" [@expandFromRight]="animatedFrom" [@expandFromLeft]="animatedFrom">
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
  imports: [
    AsyncPipe,
    NgStyle,
    MatToolbarModule,
    OverlayModule,
  ],
  animations: [
    trigger('expandFromRight', [
      state('void', style({ transform: 'scaleX(0)', transformOrigin: 'right center' })),
      state('right', style({ transform: 'scaleX(1)', transformOrigin: 'right center' })),
      transition('void => right', animate('300ms ease-out')),
      transition('right => void', animate('300ms ease-in'))
    ]),
    trigger('expandFromLeft', [
      state('void', style({ transform: 'scaleX(0)', transformOrigin: 'left center' })),
      state('left', style({ transform: 'scaleX(1)', transformOrigin: 'left center' })),
      transition('void => left', animate('300ms ease-out')),
      transition('left => void', animate('300ms ease-in'))
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

  position: 'left' | 'right' = 'right';

  @Input()
  animationDisabled: boolean = false;

  animatedFrom: 'left' | 'right' | null = null;

  constructor(
    private el: ElementRef,
  ) {
    this.show$ = this.open$.pipe(
      combineLatestWith(this.hover$),
      debounceTime(400),
      map(([open, hover]: [boolean, boolean]) => open || hover)
    );
  }
  ngAfterViewInit(): void {
    const parentElement = this.el.nativeElement.parentElement;
    const parentStyle = getComputedStyle(parentElement);
    // parentElement.childNodes[this.el.nativeElement.parentElement.childNodes.length - 1] === this.el.nativeElement ? 'right' : 'left';
    this.position = parentElement.childNodes[0] === this.el.nativeElement ? 'left' : 'right';
    this.animatedFrom = this.position;
    if (this.position === 'left') {
      this.overlayPositions = [{ originY: 'top', originX: 'start', overlayY: 'top', overlayX: 'start' }];
      this.flexGrow = 0;
      this.left = -parseFloat(parentStyle.paddingLeft);
    } else { // We're right
      this.overlayPositions = [{ originY: 'top', originX: 'end', overlayY: 'top', overlayX: 'end' }];
      this.flexGrow = 1;
      this.marginRight = -parseFloat(parentStyle.paddingRight);;
    }
    if (this.animationDisabled) {
      this.animatedFrom = null;
    }
    const matRowElement = this.el.nativeElement.closest('tr[mat-row], mat-row');
    matRowElement.addEventListener('mouseenter', () => {
      const parentStyle = getComputedStyle(parentElement);
      this.heightToolbar = parentStyle.height;
      this.open$.next(true);
    }, { capture: true, once: false, passive: true });
    matRowElement.addEventListener('mouseleave', (event: MouseEvent) => {
      const newTarget = event.relatedTarget;
      if (!this.hover$.getValue()) {
        if (matRowElement.contains(newTarget)) {
          this.open$.next(true);
        } else {
          this.open$.next(false);
        }
      }
    }, { capture: true, once: false, passive: true });

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
}
