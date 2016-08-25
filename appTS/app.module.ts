import { NgModule }      from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule }   from '@angular/forms';

import { AppComponent }  from './app.component';
import { ListComponent }  from './list.component';
import { HttpModule, JsonpModule } from '@angular/http';
import { TodoService }  from './TodoService';

@NgModule({
  imports:      [ BrowserModule, FormsModule, HttpModule, JsonpModule ],
  declarations: [ AppComponent, ListComponent ],
  providers: [ TodoService ],
  bootstrap:    [ AppComponent ]
})
export class AppModule { }
