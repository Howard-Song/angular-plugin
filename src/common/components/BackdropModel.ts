import { Component, ViewContainerRef, ViewChild } from '@angular/core';

@Component({
  selector: 'backdrop-model',
  template: `
  <div class="background-overlay">
    <div class="backdrop"></div>
    <div class="table">
      <div class="table-cell">
        <div class="body">
				<ng-content select="*"></ng-content>
        </div>
      </div>
    </div>
  </div>`
})
export class BackdropModelComponent { }


@Component({
  selector: 'backdrop-model-view',
  template: `
  <div class="background-overlay" [ngClass]="{
    'model-view':!isPage,
    'page-view':isPage
  }">
    <div class="table">
      <div class="table-cell">
        <div class="backdrop" *ngIf="disableBackdrop"></div>
        <div class="backdrop" (click)="close()" *ngIf="!disableBackdrop"></div>
        <div class="body">
        <button class="btn btn-default btn-back pageBack" *ngIf="isPage" (click)="close()">
        <i></i>返回
         </button>
          <div #view></div>
        </div>
      </div>
    </div>
  </div>`
})
export class BackdropModelViewComponent {
  isPage: boolean = false;
  @ViewChild("view", { read: ViewContainerRef }) view: ViewContainerRef;

  disableBackdrop: boolean = true;

  close() { }
}
