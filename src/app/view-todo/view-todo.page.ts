import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { LoadingController } from '@ionic/angular';
import { Todo } from '../home/models/todo.model';
import { TodoService } from '../services/todo.service';

@Component({
  selector: 'app-view-todo',
  templateUrl: './view-todo.page.html',
  styleUrls: ['./view-todo.page.scss'],
})
export class ViewTodoPage implements OnInit {

  todo: Todo = {
    id: 0,
    title: '',
    description: '',
    status: false
  };

  private loading;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private todoService: TodoService,
    private loadingControl: LoadingController
  ) {
    this.todo.id =+this.route.snapshot.paramMap.get('id');
    this.todoService.getData().subscribe(res => {
      res.forEach(el => {
        if(el.id === this.todo.id){
          this.todo.title = el.title;
          this.todo.description = el.description;
          this.todo.status = el.status;
        }
      });
    });
  }

  editTodo(){
    this.showLoadingInterface();
    setTimeout(() => {
      this.loading.dismiss();
      }, 800);
    setTimeout(() => {
      this.router.navigate(['update-todo', this.todo.id]);
      }, 200);
  }

  getPreviousPage(){
    this.showLoadingInterface();
    setTimeout(() => {
      this.loading.dismiss();
      }, 800);
    setTimeout(() => {
      this.router.navigate(['']);
      }, 200);
  }

  async showLoadingInterface(){
    this.loading = await this.loadingControl.create({
      message: 'Loading content ...',
    });
    this.loading.present();
  }

  ngOnInit() {
  }

}
