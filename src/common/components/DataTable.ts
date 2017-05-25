import { Component, TemplateRef, ViewChild, OnInit, Input, Output, EventEmitter, ChangeDetectorRef, ElementRef, OnChanges } from '@angular/core';
import { ServerProvider } from "./../../common/providers/ServerProvider";
import { UtilProvider } from "./../../common/providers/UtilProvider";
import { Column } from "./../../common/models/DataTable";
import { DatatableComponent as DTComponent } from '@swimlane/ngx-datatable';

@Component({
  selector: 'data-table',
  template: `
    <div [class.refresh]="pageRefreshStatus" [class.resize]="pageResizeStatus">
      <ngx-datatable
      #dataTable
        class="material"
        [rows]="rows"
        [columns]="columns"
        [columnMode]="'force'"
        [headerHeight]="40"
        [footerHeight]="34"
        [messages]="messages"
        [rowHeight]="'auto'"
        [externalPaging]="isPage"
        [externalSorting]="true"
        [count]="count"
        [selected]="selected"
        [selectionType]="'checkbox'"
        [offset]="offset"
        [limit]="limit"
        [url]="url"
        [scrollbarH]="true"
        (page)="onPage($event)"
        (select)='onSelect($event)'
        (sort)="onSort($event)">
      </ngx-datatable>
    </div>
  `
})

export class DataTableComponent implements OnInit, OnChanges {
  messages = {
    emptyMessage: "无数据",
    totalMessage: ""
  }
  @ViewChild("dataTable") dataTable: DTComponent;
  @Input() define;
  @Input() rows;
  @Input() count;
  @Input() columns;
  @Input() configDefault;
  @Input() offset;
  @Input() limit;
  _queryContext;
  isLoad = false;
  isPage = true;
  @Output() fetchData: EventEmitter<any> = new EventEmitter();
  @Output() select: EventEmitter<any> = new EventEmitter();

  @Input() set queryContext(context) {
    if (context) {
      this._queryContext = context;
      this.define.configDefault.params = this._queryContext;
      this.define.configDefault.offset = 0;
      this.fetchData.emit(this.define.configDefault);
      this.dataTable.offset = 0;
      this.dataTable.bodyComponent.offset = 0;
    }
  };
  get queryContext() {
    return this._queryContext;
  }
  _prevRefreshStatus;
  get pageRefreshStatus() {
    if (this._prevRefreshStatus != localStorage.getItem("dataTableRefreshStatus")) {
      if ($("body").find(this.elementRef.nativeElement)) {
        setTimeout(() => {
          if (this._prevRefreshStatus != localStorage.getItem("dataTableRefreshStatus")) {
            this._prevRefreshStatus = localStorage.getItem("dataTableRefreshStatus");
            if (this.isLoad) {
              this.reload();
            }
          }
        });
      }
      return true;
    } else {
      return false;
    }
  }
  constructor(
    private elementRef: ElementRef,
    private serverProvider: ServerProvider,
    private cdr: ChangeDetectorRef,
    private utilProvider: UtilProvider,
  ) { }
  _prevResizeStatus;
  get pageResizeStatus() {
    if (this._prevResizeStatus != localStorage.getItem("dataTableResizeStatus")) {
      if ($("body").find(this.elementRef.nativeElement)) {
        setTimeout(() => {
          if (this._prevResizeStatus != localStorage.getItem("dataTableResizeStatus")) {
            this._prevResizeStatus = localStorage.getItem("dataTableResizeStatus");
            this.resize();
          }
        });
      }
      return true;
    } else {
      return false;
    }
  }
  resize() {
    this.dataTable.recalculate();
  }
  ngOnChanges(e) { }
  ngOnInit() {
    if (!this.define.isPage) {
      this.isPage = false;
    }

    let columns = [];
    for (let i = 0; i < this.define.columns.length; i++) {
      this.define.columns[i].resizeable = false;
      this.define.columns[i].draggable = false;
      if (this.define.columns[i].visible || typeof this.define.columns[i].visible == "undefined") {
        columns.push(this.define.columns[i]);
        // columns[i] =  this.utilProvider.setObjFull(columns[i],{draggable:false})
      }
    }
    this.columns = columns;
  }
  onSelect({ selected }) {
    this.select.emit(this.selected);
  }
  page(config) {
    this.fetchData.emit(config);
  }
  onPage(event) {
    let config = {
      offset: event.offset,
      limit: event.limit,
      count: 0,
      params: this.queryContext,
      orderDesc_: this.configDefault.orderDesc_,
      order: this.configDefault.order,
      url: this.configDefault.url
    }
    if ($(".datatable-checkbox input")) {
      $(".datatable-checkbox input").prop("checked", false);
    }
    this.define.configDefault = config;
    this.page(config);
  }
  selected = [];
  getSelectedIx() {
    return this.selected[0]['$$index'];
  }
  onSort(event) {
    let dir = {
      asc: 'ASC',
      desc: 'DESC'
    }
    let orderDesc_ = dir[event.sorts[0].dir];
    let order = event.sorts[0].prop;
    let config = {
      params: this.queryContext,
      offset: 0,
      limit: 10,
      orderDesc_: orderDesc_,
      order: order,
      url: this.configDefault.url
    }
    this.configDefault = config;
    this.define.configDefault = config;

    this.fetchData.emit(config);
    this.dataTable.offset = 0;
    this.dataTable.bodyComponent.offset = 0;
  }

  reload() {
    this.fetchData.emit(this.define.configDefault);
  }
}
