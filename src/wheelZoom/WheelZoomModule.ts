import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { RouterModule, Routes, RouteReuseStrategy} from '@angular/Router';
import { CommonModule as NgCommonModule } from '@angular/common';


import { WheelZoomComponent } from './../wheelZoom/views/WheelZoomComponent';

/**
 * 路由配置
 */
const routes: Routes = [
	{ path: "", component: WheelZoomComponent },

];
@NgModule({
  declarations: [
    WheelZoomComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpModule
  ],
  providers: [],
  exports: [
		RouterModule,
		WheelZoomComponent
	],
	entryComponents: [
		WheelZoomComponent
	],
})
export class WheelZoomModule { }
