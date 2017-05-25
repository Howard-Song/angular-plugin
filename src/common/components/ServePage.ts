import { Component, TemplateRef, ViewChild, OnInit, Input, Output, EventEmitter, ChangeDetectorRef, ElementRef, OnChanges } from '@angular/core';
import { ServerProvider } from "./../../common/providers/ServerProvider";
import { UtilProvider } from "./../../common/providers/UtilProvider";

@Component({
  selector: 'serve-page',
  template: `
  <div [class.refresh]="pageRefreshStatus">
   <div *ngIf="pageNum && pageNum.length>1" class="table-page">
      <div class="pages">
        <div class="icon-prev" [ngClass]="{'disabled':selectIndex == 1}" (click)="page(1)"></div>
        <div class="icon-left" [ngClass]="{'disabled':selectIndex == 1}" (click)="page(selectIndex-1)"></div>
        <select (change)=selectPage($event)>
          <option *ngFor="let index of pageNum" [selected]="pageIndex == index" [value]="index">{{index}}</option>
        </select>
        <div class="icon-right" [ngClass]="{'disabled':selectIndex == pageLength}" (click)="page(selectIndex+1)"></div>
        <div class="icon-skip" [ngClass]="{'disabled':selectIndex == pageLength}" (click)="page(pageLength)"></div>
      </div>
    </div>
  </div>
  `
})
export class ServePage implements OnInit {
  _pageConfig;
  @Input() set pageConfig(config) {
    if (config) {
      this._pageConfig = config;
    }
  };
  isLoad = false;
  get pageConfig() {
    return this._pageConfig;
  };
  _prevRefreshStatus;
  get pageRefreshStatus() {
    if (this._prevRefreshStatus != localStorage.getItem("dataTableRefreshStatus")) {
      if ($("body").find(this.elementRef.nativeElement)) {
        setTimeout(() => {
          if (this._prevRefreshStatus != localStorage.getItem("dataTableRefreshStatus")) {
            this._prevRefreshStatus = localStorage.getItem("dataTableRefreshStatus");
            if (this.isLoad) {
              this.page(this.selectIndex);
            }
          }
        });
      }
      return true;
    } else {
      return false;
    }
  }
  pageNum;
  selectIndex = 1;
  pageIndex;
  pageLength;
  constructor(
    private elementRef: ElementRef,
    private serverProvider: ServerProvider,
    private cdr: ChangeDetectorRef,
    private utilProvider: UtilProvider,
  ) { }
  @Output() query: EventEmitter<any> = new EventEmitter();

  ngOnInit() {

  }
  selectPage(e) {
    this.page(parseInt(e.target.value));
    console.log(e);
  }
  setData(config) {
    this.isLoad = true;
    this.pageIndex = config.pageIndex;
    this.pageNum = config.pageNum;
    this.pageLength = config.pageLength;
  }
  page(index) {
    this.selectIndex = index;
    this.pageIndex = index;
    this.query.emit(this.pageIndex - 1);
  }
  reload() {

  }
}
