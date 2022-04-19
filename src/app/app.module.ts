import { NgModule } from '@angular/core';
import { RouteReuseStrategy } from '@angular/router';

import { IonicModule, IonicRouteStrategy } from '@ionic/angular';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { IonicStorageModule } from '@ionic/storage-angular';
import { Drivers } from '@ionic/storage';
import * as cordovaSQLiteDriver from 'localforage-cordovasqlitedriver';
import { BrowserModule, HammerModule} from '@angular/platform-browser';
import { HammerGestureConfig, HAMMER_GESTURE_CONFIG } from '@angular/platform-browser';
import * as Hammer from 'hammerjs';


export class HammerCustomEventHandler extends HammerGestureConfig {
  overrides = {
    swipe : {
      direction: Hammer.DIRECTION_ALL
    }
  };
}

@NgModule({
  declarations: [AppComponent],
  entryComponents: [],
  imports: [
    BrowserModule,
    IonicModule.forRoot(),
    AppRoutingModule,
    IonicStorageModule.forRoot({
      name: 'todo_database',
      // eslint-disable-next-line no-underscore-dangle
      driverOrder: [cordovaSQLiteDriver._driver, Drivers.IndexedDB, Drivers.LocalStorage]
    }),
    HammerModule
  ],
  providers: [
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy },
    {provide: HAMMER_GESTURE_CONFIG, useClass: HammerCustomEventHandler }
  ],
  bootstrap: [AppComponent],
})

export class AppModule {}
