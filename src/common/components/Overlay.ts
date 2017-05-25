import { Component, OnInit, ViewChild, ViewContainerRef, Input } from '@angular/core';

import { OverlayProvider } from "./../providers/OverlayProvider";

import { AlertComponent } from "./Alert";
@Component({
	selector: 'common-overlay',
	template: `
		<common-container #common></common-container>
		<model-container #model></model-container>
		<alert-container #alert></alert-container>
		<confirm-container #confirm></confirm-container>
		<toast-container #toast></toast-container>
		<loading-container #loading></loading-container>
	`
})
export class OverlayComponent implements OnInit {
	@ViewChild('alert', { read: ViewContainerRef }) alert: ViewContainerRef;
	@ViewChild('toast', { read: ViewContainerRef }) toast: ViewContainerRef;
	@ViewChild('loading', { read: ViewContainerRef }) loading: ViewContainerRef;
	@ViewChild('confirm', { read: ViewContainerRef }) confirm: ViewContainerRef;
	@ViewChild('common', { read: ViewContainerRef }) common: ViewContainerRef;
	@ViewChild('model', { read: ViewContainerRef }) model: ViewContainerRef;

	@Input("alert") alertAttr;
	@Input("toast") toastAttr;
	@Input("loading") loadingAttr;
	@Input("confirm") confirmAttr;
	@Input("common") commonAttr;
	@Input("model") modelAttr;

	constructor(
		private overlayProvider: OverlayProvider
	) { }

	/**
	 * 实例化所有提示框等覆盖信息层
	 */
	ngOnInit() {
		typeof this.alertAttr != "undefined" && this.overlayProvider.setView(this.alert, "alert");
		typeof this.toastAttr != "undefined" && this.overlayProvider.setView(this.toast, "toast");
		typeof this.loadingAttr != "undefined" && this.overlayProvider.setView(this.loading, "loading");
		typeof this.confirmAttr != "undefined" && this.overlayProvider.setView(this.confirm, "confirm");
		typeof this.modelAttr != "undefined" && (this.overlayProvider.model = this.model);
		typeof this.commonAttr != "undefined" && (this.overlayProvider.common = this.common);
	}
}
