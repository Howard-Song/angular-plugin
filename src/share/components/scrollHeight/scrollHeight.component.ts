import { Component, OnInit, ChangeDetectorRef, AfterViewInit, ElementRef, Input } from '@angular/core';

/**
 * @title ScrollHeight
 */
@Component({
  selector: 'scroll-height',
  templateUrl: 'scrollHeight.component.html',
  styleUrls: ['scrollHeight.component.scss']
})
export class ScrollHeightComponent implements OnInit, AfterViewInit {
  scrollTop;
  timer;
  @Input() relativeHeight = 0;
  // tootip信息内容
  @Input() message = '回到相对高度';
  // tootip 位置
  @Input() tipPosition = 'before';
  constructor(
    private cdf: ChangeDetectorRef,
    private element: ElementRef
  ) {
  }
  ngOnInit() {
  }
  ngAfterViewInit() {
    // 默认判断当前滚动条位置和相对高度作对比
    this.show();
    $(this.element.nativeElement).parent().scroll(() => {
      // 滚动后确定按钮是否显示
      this.show();
    });
  }
  show() {
    let top = $(this.element.nativeElement).parent().scrollTop();
    top > this.relativeHeight || top < this.relativeHeight ? this.scrollTop = true : this.scrollTop = false;
    this.cdf.detectChanges();
  }
  // 点击后滚动到该组件父级滚动高度为this.relativeHeight位置
  goTop() {
    $(this.element.nativeElement).parent().animate({
      scrollTop: this.relativeHeight
    }, 500);
  }

}
