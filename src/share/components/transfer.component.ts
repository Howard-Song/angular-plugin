import { Component, Input, OnInit, Output, EventEmitter, ChangeDetectorRef, ViewChild, ElementRef } from '@angular/core';
import { UtilService } from "../services/util.service";

/**
 * @title Transfer
 */
@Component({
  selector: 'transfer',
  templateUrl: 'transfer.component.html',
  styleUrls: ['transfer.component.scss']
})
export class TransferComponent implements OnInit {
  @Input() left = [];
  @Input() right = [];
  @Output() transferChange = new EventEmitter();
  @ViewChild('leftAllChecked') leftAllChecked: ElementRef;
  @ViewChild('rightAllChecked') rightAllChecked: ElementRef;
  leftValue: string;
  rightValue: string;

  defaultData = {
    left: [],
    right: []
  };
  checked = {
    left: [],
    right: []
  };
  constructor(
    private cdf: ChangeDetectorRef,
    private util: UtilService,
  ) {
  }
  ngOnInit() {
    if (this.left) {
      this.left = this.left.map(data => {
        data['tChecked'] = false;
        data['tHide'] = false;
        return data;
      });
    }
    if (this.right) {
      this.right = this.right.map(data => {
        data['tChecked'] = false;
        data['tHide'] = false;
        return data;
      });
    }
    this.defaultData['left'] = this.util.clone(this.left) || [];
    this.defaultData['right'] = this.util.clone(this.right) || [];
  }
  fromLeft(index, e) {
    if (e.target.checked) {
      this.checked.left.push(index);
      this.left[index].tChecked = true;
    } else {
      this.left[index].tChecked = false;
      this.checked.left.map((data, i) => {
        data == index ? this.checked.left.splice(i, 1) : null;
      });
    }
  }
  fromRight(index, e) {
    if (e.target.checked) {
      this.checked.right.push(index);
      this.right[index].tChecked = true;
    } else {
      this.right[index].tChecked = false;
      this.checked.right.map((data, i) => {
        data == index ? this.checked.right.splice(i, 1) : null;
      });
    }
  }
  checkAllLeft(e) {
    this.checked.left = [];
    if (e.target.checked) {
      for (let i = 0; i < this.left.length; i++) {
        this.checked.left.push(i);
        this.left[i].tChecked = true;
      }
    } else {
      for (let i = 0; i < this.left.length; i++) {
        this.left[i].tChecked = false;
      }
    }
  }
  checkAllRight(e) {
    this.checked.right = [];
    if (e.target.checked) {
      for (let i = 0; i < this.right.length; i++) {
        this.checked.right.push(i);
        this.right[i].tChecked = true;
      }
    } else {
      for (let i = 0; i < this.right.length; i++) {
        this.right[i].tChecked = false;
      }
    }
  }
  leftSearch(e) {
    this.left.map(data => {
      if (e) {
        data.label.indexOf(e.target.value) == -1 ? data.tHide = true : data.tHide = false;
      } else {
        data.tHide = false;
        this.leftValue = '';
      }
    });
  }
  rightSearch(e) {
    this.right.map(data => {
      if (e) {
        data.label.indexOf(e.target.value) == -1 ? data.tHide = true : data.tHide = false;
      } else {
        data.tHide = false;
        this.rightValue = '';
      }
    });
  }
  get restValid() {
    return (this.checked.left.length == 0 && this.checked.right.length == 0) &&
      JSON.stringify(this.left) == JSON.stringify(this.defaultData.left) &&
      JSON.stringify(this.right) == JSON.stringify(this.defaultData.right);
  }
  tansferLeft() {
    let i = 0;
    this.checked.left = this.checked.left.sort();
    this.checked.left.map(item => {
      this.left[item].tChecked = false;
      this.right.push(this.left[item]);
    });
    this.checked.left.map(item => {
      this.left.splice(item - i, 1);
      i++;
    });
    console.log(this.leftAllChecked);
    this.leftAllChecked.nativeElement.checked ? this.leftAllChecked.nativeElement.checked = false : null;

    this.checked.left = [];
    this.cdf.detectChanges();
    this.outPutTransfer('left');
  }
  tansferRight() {
    let j = 0;
    this.checked.right = this.checked.right.sort();
    this.checked.right.map(item => {
      this.right[item].tChecked = false;
      this.left.push(this.right[item]);
    });
    this.checked.right.map(item => {
      this.right.splice(item - j, 1);
      j++;
    });
    this.rightAllChecked.nativeElement.checked ? this.rightAllChecked.nativeElement.checked = false : null;

    this.checked.right = [];
    this.cdf.detectChanges();
    this.outPutTransfer('right');
  }

  reset() {
    this.left = this.util.clone(this.defaultData.left);
    this.right = this.util.clone(this.defaultData.right);
    this.checked.left = [];
    this.checked.right = [];
    this.leftValue = '';
    this.rightValue = '';
    this.cdf.detectChanges();
    this.outPutTransfer('all');
  }
  outPutTransfer(side) {
    let left = this.util.clone(this.left);
    let right = this.util.clone(this.right);

    left = left.map(data => {
      delete data['tChecked'];
      delete data['tHide'];
      return data;
    });
    right = right.map(data => {
      delete data['tChecked'];
      delete data['tHide'];
      return data;
    });
    this.transferChange.emit({
      left: left,
      right: right,
    });
  }
}
