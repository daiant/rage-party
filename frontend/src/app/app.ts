import {Component, OnInit} from '@angular/core';
import {RouterOutlet} from "@angular/router";

@Component({
  selector: 'app-root',
  template: '<router-outlet></router-outlet>',
  imports: [
    RouterOutlet
  ],
  styles: ['host {display: contents}']
})
class App implements OnInit{

  ngOnInit() {
    const doc = (<any>window).document;
    const playerApiScript = doc.createElement('script');
    playerApiScript.type = 'text/javascript';
    playerApiScript.src = 'https://www.youtube.com/iframe_api';
    doc.body.appendChild(playerApiScript);
  }
}

export default App
