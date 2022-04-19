import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Todo } from '../home/models/todo.model';
import { TodoService } from '../services/todo.service';
import { AlertController, LoadingController, Platform, ToastController } from '@ionic/angular';
import { HomePage } from '../home/home.page';
@Component({
  selector: 'app-todos',
  templateUrl: './todos.page.html',
  styleUrls: ['./todos.page.scss'],
})
export class TodosPage implements OnInit {
  todo = {
    id: 0,
    title: '',
    description: '',
    status: false
  };
  private loading;

  constructor(
    private router: Router,
    private todoService: TodoService,
    private alertControl: AlertController,
    private loadingControl: LoadingController

  ) { }

  getPreviousPage(){
    this.showLoadingInterface();
    setTimeout(() => {
      this.loading.dismiss();
      }, 800);
    setTimeout(() => {
      this.router.navigate(['']);
      }, 200);
  }

  addTodo(){
   this.todoService.getData().subscribe(res => {
      const length = !res || res.length < 1? 1 : Math.max.apply(Math, res.map((o) => o.id))+1;
      if(this.todo.title.length !== 0 && this.todo.title.trim() && this.todo.description.length !== 0 && this.todo.description.trim()){
        this.showLoadingInterface();
        setTimeout(() => {
          this.loading.dismiss();
          }, 800);
        setTimeout(() => {
          this.todoService.addData(new Todo(length, this.todo.title,this.todo.description, false));
          this.todo.title = '';
          this.todo.description = '';
          }, 200);
      }else{
        this.showInvalidInputAlert();
      }
        // this.todoService.addData(new Todo(length, `Todo ${length}`,`Todo ${length} description`, false));
        // const x = new HomePage(this.todoService, this.router, this.platform);
        // x.loadTodos();
      //  x.loadTodos();
    });
  }

  async showInvalidInputAlert(){
    const alert = await this.alertControl.create({
      cssClass: 'alertHeader emptyFieldAlert',
      header: 'Notice!',
      message: 'Please input the required field!',
      buttons: [{
        text: 'Exit',
        role: 'Cancel',
        handler: () => {}
      }]
    });
    alert.present();
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
