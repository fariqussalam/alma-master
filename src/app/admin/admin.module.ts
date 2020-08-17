import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AdminRoutingModule } from './admin-routing.module';
import { AdminPageComponent } from './admin-page/admin-page.component';
import { UiModule } from '../ui/ui.module';
import { FormsModule } from '@angular/forms';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    AdminRoutingModule,
    UiModule,
  ],
  declarations: [AdminPageComponent]
})
export class AdminModule { }
