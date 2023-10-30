import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RowActionComponent } from './row-actions.component';
import { MatToolbarModule } from '@angular/material/toolbar';
import { OverlayModule } from '@angular/cdk/overlay';

@NgModule({
  imports: [
    CommonModule,
    MatToolbarModule,
    OverlayModule
    ],
  declarations: [
    RowActionComponent
  ],
  exports: [
    RowActionComponent
  ],
})
export class RowActionsModule {
}
