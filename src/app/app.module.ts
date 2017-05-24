import { BrowserModule } from '@angular/platform-browser';
import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { RouterModule, Routes, RouteReuseStrategy } from '@angular/Router';
import { CommonModule as NgCommonModule } from '@angular/common';


import { AppComponent } from './app.component';
import { WheelZoomComponent } from './../wheelZoom/views/WheelZoomComponent';

import { WheelZoomModule } from "./../wheelZoom/WheelZoomModule"
/**
 * 路由配置
 */
const routes: Routes = [
  { path: "", component: WheelZoomComponent },
  { path: "wheelZoom", loadChildren: "wheelZoom/WheelZoomModule#WheelZoomModule" },

];
@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpModule,
    WheelZoomModule,
    RouterModule.forRoot(routes, {
      useHash: true
    })
  ],
  providers: [],
  bootstrap: [AppComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class AppModule { }
