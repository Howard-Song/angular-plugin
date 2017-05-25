import { CommonModule as NgCommonModule } from '@angular/common';
import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { RouterModule, Routes } from '@angular/router';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';


/**
 * 放置 Component
 */
import { OverlayComponent } from "./../common/components/Overlay";
import { AlertComponent } from "./../common/components/Alert";
import { ToastComponent } from "./../common/components/Toast";
import { LoadingComponent } from "./../common/components/Loading";
import { ConfirmComponent } from "./../common/components/Confirm";
import { ScrollComponent } from "./../common/components/Scroll";
import { StickyTableDirective } from "./../common/components/StickyTable";
import { DataTableComponent } from '../common/components/DataTable';
import { DataTableComponent2 } from '../common/components/DataTable2';
import { ServePage } from '../common/components/ServePage';
import { Editor } from '../common/components/Editor';
import { Echarts } from '../common/components/Echarts';
import { FuncComponent } from '../common/components/Func';
import { FormErrorTips } from '../common/components/FormErrorTips';

/**
 * 表格内部滚动和内部悬浮表头
 */
import { ScrollComponent2 } from "./../common/components/Scroll2";
import { StickyTableDirective2 } from "./../common/components/StickyTable2";

import { BackdropModelComponent, BackdropModelViewComponent } from "./../common/components/BackdropModel";
import { TabComponent } from "./../common/components/Tab";
import { TimepickerDirective } from "./../common/components/Timepicker";
import { PhotoGallary } from "./../common/components/PhotoGallary";
import { WheelZoom } from "./../common/components/WheelZoom";

import { EnumOption } from "./../common/components/EnumOption";
import { TableOption, TableOptionPlus } from "./../common/components/TableOption";
import { AsynList } from "./../common/components/AsynList";
import { AsynTableList } from "./../common/components/AsynTableList";
import { DateRangeEditor } from "./../common/components/DateRange";
import { UniqueValidator } from "./../common/components/FormUniqueCheck";
/**
 * 放置 Provider
 */
import { ServerProvider } from "./../common/providers/ServerProvider";
import { StorageProvider } from "./../common/providers/StorageProvider";
import { UtilProvider } from "./../common/providers/UtilProvider";
import { TraceProvider } from "./../car/providers/TraceProvider";
import { OverlayProvider } from "./../common/providers/OverlayProvider";
import { RouteGuard } from "./../common/providers/RouteGuard";
import { ImValidators } from "./../common/tools/ImValidators";

/**
 * 放置 Pipe
 */
import { DateStringfyProvider, DateStringfy } from "./../common/pipe/DateStringfy";
import { IdToName } from "./../common/pipe/IdToName";
import { Enum } from "./../common/pipe/Enum";
import { TMoney } from "./../common/pipe/TMoney";
import { TInt } from "./../common/pipe/TInt";
import { TDate, TDateTime,TFullDateTime } from "./../common/pipe/TDate";
import { Duration } from "common/pipe/Duration";



@NgModule({
	declarations: [
		AlertComponent,
		ToastComponent,
		LoadingComponent,
		OverlayComponent,
		ConfirmComponent,
		DateStringfy,
		IdToName,
		Enum,
		ScrollComponent,
		StickyTableDirective,
		ScrollComponent2,
		StickyTableDirective2,
		BackdropModelComponent,
		BackdropModelViewComponent,
		TabComponent,
		TimepickerDirective,
		PhotoGallary,
		WheelZoom,
		EnumOption,
		TableOption,
		TableOptionPlus,
		AsynList,
		AsynTableList,
		DateRangeEditor,
		UniqueValidator,
		DataTableComponent,
		DataTableComponent2,
		ServePage,
		FuncComponent,
		TDate,
		TDateTime,
		TFullDateTime,
		TMoney,
		TInt,
		FormErrorTips,
		Duration,
		Editor,
		Echarts,
	],
	imports: [
		NgCommonModule,
		FormsModule,
		ReactiveFormsModule,
		HttpModule,
		NgxDatatableModule,
	],
	entryComponents: [
		AlertComponent,
		ToastComponent,
		LoadingComponent,
		ConfirmComponent,
		BackdropModelViewComponent,
		PhotoGallary,
		WheelZoom,
		EnumOption,
		TableOption,
		TableOptionPlus,
		AsynList,
		AsynTableList,
		DateRangeEditor,
		DataTableComponent,
		DataTableComponent2,
		ServePage,
		Editor,
		Echarts,
	],
	providers: [
		ServerProvider,
		StorageProvider,
		UtilProvider,
		OverlayProvider,
		DateStringfyProvider,
		RouteGuard,
		ImValidators,
	],
	exports: [
		DateStringfy,
		AlertComponent,
		ToastComponent,
		LoadingComponent,
		OverlayComponent,
		ConfirmComponent,
		IdToName,
		Enum,
		ScrollComponent,
		StickyTableDirective,
		ScrollComponent2,
		StickyTableDirective2,
		BackdropModelComponent,
		BackdropModelViewComponent,
		TabComponent,
		TimepickerDirective,
		PhotoGallary,
		WheelZoom,
		EnumOption,
		TableOption,
		TableOptionPlus,
		AsynList,
		AsynTableList,
		DateRangeEditor,
		UniqueValidator,
		DataTableComponent,
		DataTableComponent2,
		ServePage,
		FuncComponent,
		TDate,
		TDateTime,
		TFullDateTime,
		TMoney,
		TInt,
		FormErrorTips,
		Duration,
		Editor,
		Echarts,
	],
	schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class CommonModule { }
