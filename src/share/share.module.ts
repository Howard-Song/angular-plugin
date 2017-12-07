import { NgModule } from '@angular/core';
import { CommonModule } from "@angular/common";
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import {
  MatButtonModule,
  MatTooltipModule,
  MatIconModule
} from '@angular/material';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { UtilService } from "./services/util.service";
import { TransferComponent } from "./components/transfer/transfer.component";
import { ScrollHeightComponent } from "./components/scrollHeight/scrollHeight.component";



@NgModule({
  declarations: [
    TransferComponent,
    ScrollHeightComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    MatButtonModule,
    MatTooltipModule,
    MatIconModule,
    BrowserAnimationsModule,
    ReactiveFormsModule
  ],
  providers:[
    UtilService
  ],
  exports:[
    TransferComponent,
    ScrollHeightComponent
  ]
})
export class ShareModule { }
