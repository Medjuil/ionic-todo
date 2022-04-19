import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ViewTodoPage } from './view-todo.page';

const routes: Routes = [
  {
    path: '',
    component: ViewTodoPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ViewTodoPageRoutingModule {}
