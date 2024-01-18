import { Component, OnInit } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.css']
})
export class MenuComponent implements OnInit{
  constructor(private router: Router) {}
  public currentUrl: string = "";

  ngOnInit(): void {
    this.router.events.subscribe((urlEvent: any) => {
      if(urlEvent instanceof NavigationEnd) {
        this.currentUrl = (<NavigationEnd> urlEvent).url; 
      }
    });
  }

}
