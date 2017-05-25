import { Component, Directive, OnInit, OnDestroy, OnChanges, ChangeDetectorRef, ElementRef, Input, Output, EventEmitter, ViewChild, ViewContainerRef } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { BaseComponent } from "./../../app/app.base/BaseComponent";

@Component({
	template: `
	<div class="photo-gallary">
		<div class="backdrop" (click)="close()"></div>
    	<div class="close-btn" (click)="close()"></div>
		<button class="left-swipe" (click)="left()" title="上一张" *ngIf="urls.length>1"></button>
		<img [src]="imageUrl" #image>
		<button class="right-swipe" (click)="right()" title="下一张" *ngIf="urls.length>1"></button>
	</div>
	`,
	styles: [
		`
		.photo-gallary .backdrop{
			z-index:0;
		}
		.photo-gallary{
			background-color: rgba(0, 0, 0, 0.09);
			position:absolute;
			width:100%;
			height:100%;
			left:0;
			right:0;
		}
		.photo-gallary .left-swipe,
		.photo-gallary .right-swipe{
			display: inline-block;
    		width: 50px;
    		height: 50px;
    		position: absolute;
    		left: 16px;
    		top: 0;
    		bottom: 0;
    		margin: auto;
    		font-size: 26px;
    		line-height: 50px;
    		text-align: center;
    		background-color: rgb(255, 183, 50);
    		color: #fff1f1;
    		border: none;
    		border-radius: 10px;
    		cursor: pointer;
		}
		.photo-gallary .right-swipe{
			right:60px;
			left:auto;
		}
		.photo-gallary .left-swipe:before{
			content:"<";
		}
		.photo-gallary .right-swipe:before{
			content:">";
		}
		`,
		`
		.photo-gallary img{
			position: absolute;
			left: 0;
			right: 0;
			top: 0;
			bottom: 0;
			margin: auto;
			max-height: 90%;
			max-width: 90%;
		}
		.close-btn {
			position: absolute;
			top: 16px;
			right: 16px;
			width: 30px;
			height: 30px;
			cursor: pointer;
			background-repeat: no-repeat;
			background-size: cover;
			background-position: center;
			background-size: contain;
			background-image: url("assets/image/icon_Turn-off.png");
		}
		`
	]
})
export class PhotoGallary extends BaseComponent implements OnInit, OnDestroy {
	@ViewChild("image") imageRef: ElementRef;
	imageUrl: any = "";
	index: number = 0;
	constructor(
		activatedRoute: ActivatedRoute,
		private elementRef: ElementRef,
		private domSanitizer: DomSanitizer,
		private ChangeDetectorRef: ChangeDetectorRef
	) {
		super(activatedRoute);
	}

	urls: {
		url: SafeResourceUrl;
	}[] = [];

	ngOnInit() {
		this.getParams().then(params => {
			if (typeof params == "string") {
				this.urls.push({
					url: this.domSanitizer.bypassSecurityTrustResourceUrl(params)
				});
			} else if (params instanceof Array) {
				params.map(urlInfo => {
					if (typeof urlInfo == "string") {
						this.urls.push({
							url: this.domSanitizer.bypassSecurityTrustResourceUrl(urlInfo)
						});
					}
				})
			}
			this.init();
		});
		this.bind();
	}

	init() {
		this.imageUrl = this.urls[0].url;
		this.index = 0;
	}

	left() {
		let index = this.index - 1;
		if (index < 0) {
			index = this.urls.length - 1;
		}
		this.index = index;
		this.imageUrl = this.urls[this.index].url;
		this.resetzoom();
	}

	right() {
		let index = this.index + 1;
		if (index > this.urls.length - 1) {
			index = 0;
		}
		this.index = index;
		this.imageUrl = this.urls[this.index].url;
		this.resetzoom();
	}

	close() { }

	resetzoom() {
		$(this.imageRef.nativeElement).css("zoom", 1);
	}
	wheelscroll() {
		let that = this;
		return (e) => {
			if (e.originalEvent.wheelDelta > 0) {
				//up
				let zoom: number = parseFloat(<any>$(that.imageRef.nativeElement).css("zoom"));
				$(that.imageRef.nativeElement).css("zoom", zoom - 0.5 || 0.1);
			} else {
				//down
				let zoom: number = parseFloat(<any>$(that.imageRef.nativeElement).css("zoom"));
				let max = $(window).width() / $(that.imageRef.nativeElement).width();
				$(that.imageRef.nativeElement).css("zoom", (zoom + 0.5) > 5 ? 5 : (zoom + 0.5));
			}
		}
	}
	_bindFn: any;
	bind() {
		this._bindFn = this.wheelscroll();
		$(this.imageRef.nativeElement).on("mousewheel", this._bindFn);
	}
	unbind() {
		$(this.imageRef.nativeElement).off("mousewheel", this._bindFn);
	}

	ngOnDestroy() {
		this.unbind();
	}
}
