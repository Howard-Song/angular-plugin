import { Component, OnInit, Inject, Input, ViewChild, TemplateRef, Output, EventEmitter } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from "@angular/forms";
import { ActivatedRoute } from '@angular/router';

/**
 * @Title: dmeo
 * @Description: 
 */
@Component({
	templateUrl: "./Demo.html"
})
export class Demo implements OnInit {
	constructor(
		activatedRoute: ActivatedRoute,
	) {
	}
	
	ngOnInit() {
		
	}
	
	
	
}
