import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { PrimitiveControlComponent } from './primitive-control/primitive-control.component';
import { ShadowComponent } from './shadow/shadow.component';

@NgModule({
  declarations: [
    AppComponent,
    PrimitiveControlComponent,
    ShadowComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
