import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LoaderComponentComponent } from './loader-component/loader-component.component';
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';


@NgModule({
  declarations: [
    LoaderComponentComponent
  ],
  imports: [
    CommonModule,
    MatProgressSpinnerModule
  ]
})
export class LoaderModule { }
