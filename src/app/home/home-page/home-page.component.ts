import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home-page',
  templateUrl: './home-page.component.html',
  styleUrls: ['./home-page.component.scss'],
})
export class HomePageComponent implements OnInit {
  inputModel: any;

  constructor(private _router: Router) {
  }

  ngOnInit() {
  }

  chosenItem(item){
    this._router.navigate(['/custom'], { queryParams: { itemType: item } });
  }
}
