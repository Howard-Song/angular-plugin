import { Component, TemplateRef, ViewChild, OnInit, Input, Output, EventEmitter, ChangeDetectorRef, ElementRef, OnChanges } from '@angular/core';
import { ServerProvider } from "./../../common/providers/ServerProvider";
import { UtilProvider } from "./../../common/providers/UtilProvider";
import { Column } from "./../../common/models/DataTable";
import { DatatableComponent as DTComponent } from '@swimlane/ngx-datatable';

@Component({
  selector: 'data-table2',
  template: `
    <div [class.refresh]="pageRefreshStatus" [class.resize]="pageResizeStatus">
      <ngx-datatable
      #grid
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
        [scrollbarH]="true"
        [url]="url"
        (page)="onPage($event)"
        (select)='onSelect($event)'
        (sort)="onSort($event)">
      </ngx-datatable>
    </div>
  `
})

export class DataTableComponent2 implements OnInit, OnChanges {
  messages = {
    emptyMessage: "无数据",
    totalMessage: ""
  }
  @ViewChild("grid") grid: DTComponent;
  _config;
  @Input() set config(config) {
    if (config) {
      this.gridReload();
      this._config = config;
    }
  };
  get config() {
    return this._config;
  };
  @Input() rows;
  @Input() count;
  @Input() queryContext;

  columns;
  offset;
  limit;
  isLoad = false;
  isPage = true;
  @Output() fetchData: EventEmitter<any> = new EventEmitter();
  @Output() select: EventEmitter<any> = new EventEmitter();

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
    this.grid.recalculate();
  }
  ngOnChanges(e) { }
  ngOnInit() {
    if (!this._config.gridConfig.queryConfig.isPage) {
      this.isPage = false;
    }

    let columns = [];
    for (let i = 0; i < this._config.gridConfig.columns.length; i++) {
      if (this._config.gridConfig.columns[i].visible || typeof this._config.gridConfig.columns[i].visible == "undefined") {
        columns.push(this._config.gridConfig.columns[i]);
        // columns[i] =  this.utilProvider.setObjFull(columns[i],{draggable:false})
      }
    }
    this.columns = columns;
    this.offset = this._config.gridConfig.queryConfig.offset;
    this.limit = this._config.gridConfig.queryConfig.limit;
    this._config.gridConfig.queryConfig.params = this.queryContext;
    this.fetchData.emit(this._config.gridConfig.queryConfig);
  }
  onSelect({ selected }) {
    this.select.emit(this.selected);
  }
  gridReload() {
    this.grid.offset = 0;
    this.grid.bodyComponent.offset = 0;
  }
  page(config) {
    this.fetchData.emit(config);
  }
  onPage(event) {
    let config = {
      offset: event.offset,
      limit: event.limit,
      count: 0,
      params: this._config.gridConfig.queryConfig.params,
      orderDesc_: this.config.gridConfig.queryConfig.orderDesc_,
      order: this.config.gridConfig.queryConfig.order,
      url: this.config.gridConfig.queryConfig.url
    }
    if ($(".datatable-checkbox input")) {
      $(".datatable-checkbox input").prop("checked", false);
    }
    this.config.gridConfig.queryConfig = config;
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
      params: this._config.gridConfig.queryConfig.params,
      offset: 0,
      limit: 10,
      orderDesc_: orderDesc_,
      order: order,
      url: this.config.gridConfig.queryConfig.url
    }
    this.config.gridConfig.queryConfig = config;

    this.fetchData.emit(config);
    this.gridReload();

  }

  reload() {
    this.fetchData.emit(this.config.gridConfig.queryConfig);
  }
}
