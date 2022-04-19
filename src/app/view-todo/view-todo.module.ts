import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ViewTodoPageRoutingModule } from './view-todo-routing.module';

import { ViewTodoPage } from './view-todo.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ViewTodoPageRoutingModule
  ],
  declarations: [ViewTodoPage]
})
export class ViewTodoPageModule {}
