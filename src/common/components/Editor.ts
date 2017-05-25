import { Component, TemplateRef, ViewChild, OnInit, Input, Output, EventEmitter, ElementRef, } from '@angular/core';
import { FormGroupDirective } from '@angular/forms';
import { Config } from "./../../app/app.config"

import { ServerProvider } from "./../../common/providers/ServerProvider";
import { UtilProvider } from "./../../common/providers/UtilProvider";
import { SysCommonProvider } from "../../sys/providers/SysCommonProvider";

@Component({
  selector: 'editor',
  template: `
   <div #editor class="editor-content">
     <p>请输入内容...</p>
   </div>
  `,
  styles: [
    `
    .editor-content{
      height:400px;
    }
    `]
})

export class Editor implements OnInit {
  constructor(
    private elementRef: ElementRef,
    private serverProvider: ServerProvider,
    private utilProvider: UtilProvider,
    private sysCommonProvider: SysCommonProvider,
    private fGD: FormGroupDirective,
  ) {
  }
  @ViewChild("editor") editor: ElementRef;
  @ViewChild("content") content: ElementRef;
  @Input("formValue") formControlName;
  _editValue;
  @Input("editValue") set editValue(data) {
    // 初始化编辑器的内容
    if (data || 　data == "") {
      this.editorElment.$txt.html(data);
      this.fGD.control.get(this.formControlName).setValue(this.editorElment.$txt.html());
    }

  };
  get editValue() {
    return this._editValue;
  }
  editorElment;
  ngOnInit() {
    var editor = new wangEditor(this.editor.nativeElement);
    // 配置 onchange 事件
    let thisEditor = this;
    editor.onchange = function () {
      // 编辑区域内容变化时，实时打印出当前内容
      thisEditor.fGD.control.get(thisEditor.formControlName).setValue(this.$txt.html());
    };
    editor.config.uploadImgUrl = Config.ServerHost + '/m/sys/common/upload';
    editor.config.zindex = 20000;
    editor.config.pasteFilter = false;
    editor.config.printLog = false;
    editor.create();
    // 上传图片
    editor.config.uploadImgFns.onload = function (resultText, xhr) {
      // resultText 服务器端返回的text
      // xhr 是 xmlHttpRequest 对象，IE8、9中不支持

      // 上传图片时，已经将图片的名字存在 editor.uploadImgOriginalName
      let path = JSON.parse(resultText).data.path;

      // 如果 resultText 是图片的url地址，可以这样插入图片：
      editor.command(null, 'insertHtml', '<img src="' + Config.FSHost + path + '" style="max-width:100%;"/>');
      // 如果不想要 img 的 max-width 样式，也可以这样插入：
      // editor.command(null, 'InsertImage', resultText);
    };
    this.editorElment = editor;
  }
}
