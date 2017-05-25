import { CommonModule as NgCommonModule } from '@angular/common';
import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { RouterModule, Routes } from '@angular/router';

import { Demo } from "./pages/Demo";




/**
 * 放置 Provider
 */

import { DemoProvider } from "./providers/DemoProvider";
/**
 * 公用模块
 */
import { CommonModule } from "common/CommonModule";


/**
 * 路由配置
 */
const routes: Routes = [
	// { path: 'trace/:carId', component: TraceComponent, canActivate: [RouteGuard], canActivateChild: [RouteGuard] },

];


@NgModule({
	declarations: [
		Demo
	],
	imports: [
		CommonModule,
		NgCommonModule,
		FormsModule,
		ReactiveFormsModule,
		HttpModule,
		RouterModule.forChild(routes),
	],
	entryComponents: [
		Demo
	],
	providers: [
		DemoProvider
	],
	exports: [
		RouterModule,
		Demo

	],
	schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class DemoModule { }
