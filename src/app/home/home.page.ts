import { Component, Query, ViewChild} from '@angular/core';
import { AlertController, IonReorderGroup, LoadingController, Platform, ToastController } from '@ionic/angular';
import { ItemReorderEventDetail } from '@ionic/angular';
import { TodoService } from '../services/todo.service';
import { Router } from '@angular/router';
import 'hammerjs';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage{
  @ViewChild(IonReorderGroup) reorderGroup: IonReorderGroup;
  isClick = true;
  showCheckbox = false;
  doneTodos = [];
  undoneTodos = [];
  removeItems = [];
  searchLenth = 0;
  searchedTodos = [];
  todoStorage;
  private loading;
  constructor(
    private router: Router,
    private platform: Platform,
    private toast: ToastController,
    private todoService: TodoService,
    private alertControl: AlertController,
    private loadinControl: LoadingController
  ) {
    this.todoStorage = this.todoService.getData();
    this.doneTodos = this.todoService.doneTodos;
    this.undoneTodos = this.todoService.undoneTodos;
  }

  showRadioButton(){
    this.showCheckbox = true;
  }
  exitDeleteTodos($event){
    this.isClick = true;
    this.showCheckbox = false;
  }
  doReorderSeaarchedTodos(ev: Event){
    const event = ev as CustomEvent<ItemReorderEventDetail>;
    return event.detail.complete();
  }
  doReorderUndoneTodos(ev: Event){
    const event = ev as CustomEvent<ItemReorderEventDetail>;

    const pickedTodo = this.undoneTodos[event.detail.from];
     for(let i = 0; i <= this.undoneTodos.length-1; i++){
      if(event.detail.to === i){
        if(event.detail.from < i){
          this.undoneTodos[event.detail.from] = this.undoneTodos[event.detail.from+1];
          this.undoneTodos[event.detail.from+1] = this.undoneTodos[i];
          this.undoneTodos[i] = pickedTodo;
          event.detail.complete();
        }
        else{
          this.undoneTodos[event.detail.from] = this.undoneTodos[event.detail.from-1];
          this.undoneTodos[event.detail.from-1] = this.undoneTodos[i];
          this.undoneTodos[i] = pickedTodo;
          event.detail.complete();
        }
      }
    }
    this.todoService.undoneTodosReorderItems([...this.undoneTodos, ...this.doneTodos]);
  }

  doReorderDoneTodos(ev: Event){
    const event = ev as CustomEvent<ItemReorderEventDetail>;
    const pickedTodo = this.doneTodos[event.detail.from];
    for(let i = 0; i <= this.doneTodos.length-1; i++){
      if(event.detail.to === i){
        if(event.detail.from < i){
          this.doneTodos[event.detail.from] = this.doneTodos[event.detail.from+1];
          this.doneTodos[event.detail.from+1] = this.doneTodos[i];
          this.doneTodos[i] = pickedTodo;
          event.detail.complete();
        }
        else{
          this.doneTodos[event.detail.from] = this.doneTodos[event.detail.from-1];
          this.doneTodos[event.detail.from-1] = this.doneTodos[i];
          this.doneTodos[i] = pickedTodo;
          event.detail.complete();
        }
      }
    }
    this.todoService.doneTodosReorderItems([...this.undoneTodos, ...this.doneTodos]);
  }


  createTodo(){
    this.showLoadingInterface();
    setTimeout(() => {
      this.loading.dismiss();
      }, 800);
    setTimeout(() => {
      this.router.navigate(['todos/create']);
      }, 200);
  }

  viewTodo(id){
    this.showLoadingInterface();
    setTimeout(() => {
      this.loading.dismiss();
      }, 800);
    setTimeout(() => {
      this.router.navigate(['view-todo', id]);
      }, 200);
  }

  async showLoadingInterface(){
    this.loading = await this.loadinControl.create({
      message: 'Loading content ...',
    });
    this.loading.present();
  }
  moveToDone(todo, index){
    this.todoStorage.subscribe(res => {
      res.forEach(el => {
        if(el.id === todo.id){
          el.status = true;
          todo.status = true;
          this.undoneTodos.splice(index, 1);
          this.doneTodos.push(todo);
          this.todoService.todoMoveToDone(res);
        }
      });
    });
  }

  moveToUndone(todo, index){
    this.todoStorage.subscribe(res => {
      res.forEach(el => {
        if(el.id === todo.id){
          el.status = false;
          todo.status = false;
          this.undoneTodos.push(todo);
          this.doneTodos.splice(index, 1);
          this.todoService.todoMoveToUndone(res);
        }
      });
    });
  }

  getChecked(e, todo, index){
    this.isClick = false;
    if(e.detail.checked === true){
      this.removeItems.push(todo);
    }
    if(e.detail.checked === false){
      this.removeItems.forEach((res, x) => {
        if(res.id === todo.id){
          this.removeItems.splice(x, 1);
        }
      });
    }
  }
  async removeTodos(){
    let itemIdentifier = '';
    let itemIdentifier1 = '';
    if(this.removeItems.length < 1){
     this.todoService.rmoveAlertNottification();
    }else{
      if(this.removeItems.length === 1){
        itemIdentifier = 'this';
        itemIdentifier1 = 'this is';
      }else{
        itemIdentifier = 'these';
        itemIdentifier1 = 'these are';
      }
      await this.alertNottification(this.removeItems, itemIdentifier, itemIdentifier1);
    }
  }

  async alertNottification(removeItems, itemIdentifier, itemIdentifier1){
    const alert = await this.alertControl.create({
      cssClass: 'emptyFieldAlert',
      header: 'Warning!',
      message: `Are you sure to delete ${itemIdentifier} todo? Please make an undo if ${itemIdentifier1} important.`,
      buttons: [
        {
          text: 'Confirm',
          role: 'desctructive',
          id: 'btn-confirm',
          handler: async (confirm) => {
            removeItems.forEach(res => {
              if(res.status === false){
                this.undoneTodos.forEach((el, index) => {
                  if(res.id === el.id){
                    this.undoneTodos.splice(index, 1);
                  }
                });
              }
              if(res.status === true){
                this.doneTodos.forEach((el, index) => {
                  if(res.id === el.id){
                    this.doneTodos.splice(index, 1);
                  }
                });
              }
            });
           await this.removeToastNotification(removeItems,[...this.undoneTodos, this.doneTodos]);
          }
        },
        {
          text: 'Cancel',
          role: 'cancel',
          id: 'btn-cancel',
          handler: (cancel) => {
          }
        }
      ]
    });
    alert.present();
  }

  async removeToastNotification(removedTodo, remainingTodo){
    const toast = await this.toast.create({
      message: 'Todo removed successfully!',
      duration: 3000,
      position: 'bottom',
      buttons: [
        {
          icon: 'sync-outline',
          role: 'cancel',
          side: 'end',
          cssClass: 'toast-cancel-remove-todo',
          handler: () =>  {
            removedTodo.forEach(el => {
            if(el.status === false){
              this.undoneTodos.push(el);
            }
              if(el.status === true){
                this.doneTodos.push(el);
              }
            });
            this.todoService.saveTodoAfterOrBeforeRemove([...this.undoneTodos, ...this.doneTodos]);
            this.removeItems=[];
          }
        }
      ]
    });
    toast.present();
    await this.todoService.saveTodoAfterOrBeforeRemove([...this.undoneTodos, ...this.doneTodos]);
    this.removeItems=[];
  }

  async searchTodos(e){
    this.searchLenth = e.target.value.length;
    this.searchedTodos = await this.todoService.searchTodos(e.target.value);
  }

  loadTodos(){
    this.platform.ready().then(() => {
      this.todoStorage.subscribe(res => {
        if(res){
           res.forEach(el => {
             if(el.status === false){
               this.undoneTodos.push(el);
             }else{
                this.doneTodos.push(el);
             }
         });
        }
      });
    });
  }
}
