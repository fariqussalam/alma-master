import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { CoreModule } from './core/core.module';
import { DataService } from './data/data.service';
import { FooterModule } from './footer/footer.module';
import { HeaderModule } from './header/header.module';
import { UiModule } from './ui/ui.module';
import { AuthService } from './services/auth.service';
import { OrderService } from './services/order.service';
// import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http'; 
import { ColorPickerModule } from 'ngx-color-picker';


@NgModule({
  declarations: [
    AppComponent,
  ],
  imports: [
    BrowserModule.withServerTransition({appId: 'serverApp'}),
    FormsModule,
    BrowserAnimationsModule,
    CoreModule,
    AppRoutingModule,
    UiModule,
    HeaderModule,
    FooterModule,
    ColorPickerModule,
    HttpClientModule,
    CommonModule
  ],
  // exports:[
  // CommonModule,
  // ColorPickerModule
  // ],
  providers: [
    AuthService,
    OrderService,
    DataService
  ],
  bootstrap: [AppComponent],
})
export class AppModule {
  //   static forRoot(): ModuleWithProviders {
  //   return {
  //     ngModule: AppModule
  //   };
  // }
}
