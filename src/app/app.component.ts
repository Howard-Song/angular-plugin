import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  left = [{ label: 'left1', test: 1 }, { label: 'left2', test: 2 }, { label: 'left3', test: 3 }, { label: 'left4', test: 4 }, { label: 'left5', test: 5 }, { label: 'left6', test: 6 }];
  right = [{ label: 'right1' }, { label: 'right2' }, { label: 'right3' }, { label: 'right4' }, { label: 'right5' }, { label: 'right6' }];

  transferChange(e) {
    console.log(e);
  }
}
