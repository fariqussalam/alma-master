import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ColorPickerModule } from 'ngx-color-picker';

import { CustomRoutingModule } from './custom-routing.module';
import { CustomComponent } from './custom-page/custom.component';
import { UiModule } from '../ui/ui.module';
import { FormsModule } from '@angular/forms';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    CustomRoutingModule,
    UiModule,
     ColorPickerModule
  ],
  declarations: [CustomComponent]
})
export class CustomModule { }
