import { BrowserModule } from '@angular/platform-browser';
import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { RouterModule, Routes, RouteReuseStrategy } from '@angular/Router';
import { CommonModule as NgCommonModule } from '@angular/common';

import { RouteGuard, CustomReuseStrategy } from "./../common/providers/RouteGuard";

import { AppComponent } from './app.component';
import { Demo } from './../demo/pages/Demo';

import { DemoModule } from './../demo/DemoModule';
import { CommonModule } from './../common/CommonModule';

/**
 * 路由配置
 */
const routes: Routes = [
  { path: "", component: Demo },

];
@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpModule,
    DemoModule,
    CommonModule,
    RouterModule.forRoot(routes, {
      useHash: true
    })
  ],
  providers: [
    /**
     * 是否将页面缓存
     */
    { provide: RouteReuseStrategy, useClass: CustomReuseStrategy },
  ],
  bootstrap: [AppComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class AppModule { }
