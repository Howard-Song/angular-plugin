import { TemplateRef } from '@angular/core';
export interface Config {
	/**
	 * 表格配置	 
	 */
	gridConfig: GridConfig;
	/**
	 * 需隐藏内容 
	 */
	hiddenControl:any;
}
export interface GridConfig {
	/**
	 * 列配置
	 */
	columns?: Column[];
	/**
	 * 列显示隐藏，内容为列名
	 */
	invisible?:any;
	/**
	 * 列表查询的参数
	 */
	queryConfig:QueryConfig
	
}
export interface Column {
	/**
	 * 表头内容 
	 */
	name: string;
	/**
	 * 表头说明	 
	 */
	title?:string;
	/**
	 * 数据的对象名 
	 */
	prop: string;
	/**
	 * 是否可排序，默认为true
	 */
	sortable?: boolean;
	/**
	 * 最小宽度，默认100
	 */
	minWidth?: number;
	/**
	 * 最大宽度，默认：undefined
	 */
	maxWidth?: number;
	/**
	 * 宽度，默认150
	 */
	width?: number;
	/**
	 * 是否可手动调整大小，默认true
	 */
	resizeable?: boolean;
	/**
	 * 是否可拖动列以重新排序，默认true
	 */
	draggable?: boolean;
	/**
	 * 是否可自动调整大小，默认true
	 */
	canAutoResize?: boolean;
	/**
	 * 表格内容模板
	 */
	cellTemplate?: TemplateRef<any>;
	/**
	 * 表头内容模板
	 */
	headerTemplate?: TemplateRef<any>;
	/**
	 * 只有选择模式为复选框时，表格列是否显示复选框
	 */
	checkboxable?: boolean;
	/**
	 * 只有选择模式为复选框时，表头是否显示复选框
	 */
	headerCheckboxable?: boolean;
	/**
	 * 列可见性，默认为true
	 */
	visible?: boolean;

}
export interface QueryConfig {
	/**
	 * 页码
	 */
	pageindex: number;
	/**
	 * 每页长度,为0不分页 
	 */
	pagesize: number;
	/**
	 * 总数 
	 */
	count: number;
	/**
	 * 查询条件 
	 */
	params: any;
	/**
	 * 排序方式 
	 */
	orderDesc_: string;
	/**
	 * 排序字段 
	 */
	order: string;
	/**
	 * 数据接口 
	 */
	url?: string;

}