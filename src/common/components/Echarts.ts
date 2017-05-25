import { Component, TemplateRef, ViewChild, OnInit, Input, Output, EventEmitter, ChangeDetectorRef, ElementRef } from '@angular/core';
import { ServerProvider } from "./../../common/providers/ServerProvider";
import { UtilProvider } from "./../../common/providers/UtilProvider";
@Component({
  selector: 'echarts',
  template: `
  <div #area [ngStyle]="{'width':config.width,'height':config.height}"></div>
  `
})
export class Echarts implements OnInit {

  constructor(
    private elementRef: ElementRef,
    private serverProvider: ServerProvider,
    private utilProvider: UtilProvider,
  ) { }
  _config;
  @ViewChild("area") area: ElementRef;
  @Input() set config(config) {
    if (config) {
      this._config = config;
    }
  };
  get config() {
    return this._config;
  };
  ngOnInit() {

  }
  reload(option) {
    let myChart = echarts.init(this.area.nativeElement);
    myChart.setOption(option);
  }
}
