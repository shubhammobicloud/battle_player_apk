import { Component, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
@Component({
  selector: 'app-pages',
  templateUrl: './pages.component.html',
  styleUrls: ['./pages.component.scss']
})
export class PagesComponent implements OnInit {

  constructor(public translate: TranslateService){
    let lang:any=localStorage.getItem('lang')
    translate.use(lang);
  }
ngOnInit(): void {
}
}
