import { Component, OnInit, ElementRef, ViewChild, Input, OnChanges, SimpleChanges } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { BaseComponent } from "./../../app/app.base/BaseComponent";


@Component({
	selector: 'wheel-zoom',
	template: `
	<div class="move-bar"> 
		<div #zoom class="zoom-info">
			<div #zoom>
			</div>
			<div class="zoom-btn">
				<i class="icon-mirrow" title="镜像" (click)="rotate()"></i>
				<i class="icon-refres" title="向右转" (click)="right()"></i>
			</div>
		</div>
	</div>
	`,
	styles: [
		`
		.move-bar{
			position:absolute;
		}
		.zoom-info{
			position:absolute;
			cursor:move;
		}
		.zoom-btn{
			background-color: #f4f4f4;
			border-radius: 0px 0px 0px 5px;
			margin-left:235px;
			z-index:999;
			width: 100px;
			height:25px;
    		position: absolute;
		}
		.icon-mirrow{
			width: 25px;
    		height: 25px;
			margin-left: 6px;
			line-height: 25px;
    		display: inline-block;
			background-size: 20px 20px;
          	background-repeat: no-repeat;
			background-position: center;
         	background-image: url("assets/image/member/ic_mirror image.png");
			cursor:pointer;
		}
		.icon-mirrow:hover{
			width:25px;
			height:25px;
			border:1px #ccc solid;
			background-color:#666;
		}
		.icon-refres{
			width: 25px;
    		height: 25px;
    		display: inline-block;
			background-size: 20px 20px;
          	background-repeat: no-repeat;
			background-position: center;
         	background-image: url("assets/image/member/ic_refres.png");
			cursor:pointer;
		}
		.icon-refres:hover{
			width:25px;
			height:25px;
			border:1px #ccc solid;
			background-color:#666;
		}
		.zoom-info button{
			color:#000;
		}
		.zoom{
			z-index:-100;
		}

		`
	]
})
export class WheelZoom extends BaseComponent implements OnInit {
	@ViewChild("zoom") zoom: ElementRef;
	@Input() imageUrl;
	setImageUrl(config) {
		this.imageUrl = config;
	}
	get _imageUrl() {
		this.load();
		return this.imageUrl;
	}
	index: number = 0;
	rotateIndex = 0;
	constructor(
		activatedRoute: ActivatedRoute,
		private elementRef: ElementRef,
		private domSanitizer: DomSanitizer,
	) {
		super(activatedRoute);
	}
	options;
	it;

	ngOnInit() {
		// (<any>window).wheelzoom($(this.zoom.nativeElement).find("img"));
			this.load();
	}
	ngOnChanges(changes: SimpleChanges) {
		if (this.imageUrl.indexOf("http") != -1) {
			$(this.zoom.nativeElement).parent().find("img").remove();
			this.load();
		}
	}
	load() {
		let container = $(this.zoom.nativeElement)[0];
		let src = this.imageUrl;
		this.options = {
			mode: "css3",
			// onPreLoad: function () { container.style.backgroundImage = "url('http://images.cnblogs.com/cnblogs_com/cloudgamer/169629/o_loading.gif')"; },
			onLoad: function () { container.style.backgroundImage = ""; },
			onError: function (err) { container.style.backgroundImage = "";  }
		},
			this.it = new ImageTrans(container, this.options);
		this.it.load(src);
	}
	right() {
		// this.index = (this.index + 90) % 360;
		// $(this.imageRef.nativeElement).css("transform", "rotate(" + this.index + "deg)");
		this.it.right();
	}
	rotate() {
		// this.rotateIndex = (this.rotateIndex + 180) % 360;
		// $(this.rotateRef.nativeElement).css("transform", "rotateY(" + this.rotateIndex + "deg)");
		this.it.horizontal();

	}

}
