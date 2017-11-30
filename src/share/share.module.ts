import { NgModule } from '@angular/core';
import { CommonModule } from "@angular/common";
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { TransferComponent } from "./components/transfer.component";
import { UtilService } from "./services/util.service";



@NgModule({
  declarations: [
    TransferComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule
  ],
  providers:[
    UtilService
  ],
  exports:[
    TransferComponent
  ]
})
export class ShareModule { }
