import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Storage } from '@ionic/storage-angular';
import { Todo } from '../home/models/todo.model';
import * as cordovaSQLiteDriver from 'localforage-cordovasqlitedriver';
import { BehaviorSubject, from, of } from 'rxjs';
import { filter, switchMap } from 'rxjs/operators';
import { AlertController, Platform, ToastController } from '@ionic/angular';
import { HomePage } from '../home/home.page';

const STORAGE_KEY = 'Todos';
@Injectable({
  providedIn: 'root'
})
export class TodoService {

  todos = [];
  doneTodos = [];
  undoneTodos = [];
private storageReady = new BehaviorSubject(false);

  constructor(
    private router: Router,
    private storage: Storage,
    private toast: ToastController,
    private alertControl: AlertController,
    private platform: Platform,
  ) {
    this.init();
    this.loadTodos();
  }

  async getTodos(){
    return await this.storage.get(STORAGE_KEY) || [];
  }

  // STORAGE DATA
  async init(){
    this.storage.defineDriver(cordovaSQLiteDriver);
    await this.storage.create();
    this.storageReady.next(true);
  }

  loadTodos(){
    this.platform.ready().then(() => {
      this.getData().subscribe(res => {
        if(res){
           res.forEach(el => {
              if(el.status === false){
                this.undoneTodos.push(el);
              }
             if(el.status === true){
                this.doneTodos.push(el);
             }
         });
        }
      });
    });
  }

  getData(){
    return this.storageReady.pipe(
      filter(ready => ready),
      switchMap(_ => from(this.storage.get(STORAGE_KEY) || of([])))
    );
  }

  async addData(todo: Todo){
    const data = await this.storage.get(STORAGE_KEY) || [];
    data.push(todo);
    this.undoneTodos.push(todo);
    this.storage.set(STORAGE_KEY, data);
    this.toastNotification('Todo saved successfully!');
    this.router.navigate(['/home']);
  }

  async updateTodo(todo: Todo){
    const data = await this.storage.get(STORAGE_KEY) || [];
    data.forEach(el => {
      if(el.id === todo.id){
        el.id = todo.id;
        el.title = todo.title;
        el.description = todo.description;
        el.status = todo.status;
      }
    });
    if(todo.status === false){
      this.undoneTodos.forEach((res, index) => {
        if(res.id === todo.id){
         this.undoneTodos[index] = todo;
        }
      });
    }
    if(todo.status === true){
      this.doneTodos.forEach((res, index) => {
        if(res.id === todo.id){
         this.doneTodos[index] = todo;
        }
      });
    }
    this.toastNotification('Todo updated successfully!');
    this.storage.set(STORAGE_KEY, data);
    return this.router.navigate(['/home']);
  }

  async removeData(todos){
    // await this.alertNottification(todos);
  }

  async undoneTodosReorderItems(todos){
    return this.storage.set(STORAGE_KEY, todos);
  }

  async doneTodosReorderItems(todos){
    return this.storage.set(STORAGE_KEY, todos);
  }

  async toastNotification($message){
    const toast = await this.toast.create({
      message: $message,
      duration: 3000,
      position: 'bottom'
    });
    toast.present();
  }
  saveTodoAfterOrBeforeRemove(todo){
    return this.storage.set(STORAGE_KEY, todo);
  }


  async rmoveAlertNottification(){
    const alert = await this.alertControl.create({
      cssClass: 'emptyFieldAlert',
      header: 'Warning!',
      message: 'At least 1 todo is required to proceed!',
      buttons: [
        {
          text: 'Exit',
          role: 'cancel',
          id: 'btn-cancel',
          handler: (cancel) => {
          }
        }
      ]
    });
    alert.present();
  }
  async todoMoveToDone(data){
    await this.storage.set(STORAGE_KEY, data);
  }

  async todoMoveToUndone(data){
    await this.storage.set(STORAGE_KEY, data);
  }

  async searchTodos(value){
    const searchedTodos = [];
    const data = await this.storage.get(STORAGE_KEY) || [];
    data.forEach(res => {
      if(res.title.toLowerCase().includes(value.trim().toLowerCase())){
        searchedTodos.push(res);
      }
    });
    return searchedTodos;
  }
}
