import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';

@Component({
  standalone:true,
  imports:[
    CommonModule,
    IonicModule,],
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.scss'],
})
export class MenuComponent  implements OnInit {

  constructor() { }

  ngOnInit() {
    return;
  }

}
