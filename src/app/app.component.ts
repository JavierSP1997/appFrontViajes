import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { GuideComponent } from './components/guide/guide.component';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, GuideComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
})
export class AppComponent {}
