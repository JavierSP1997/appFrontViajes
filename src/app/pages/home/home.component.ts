import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { FinderComponent } from '../../components/finder/finder.component';

@Component({
  selector: 'app-home',
  imports: [RouterLink, FinderComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css',
})
export class HomeComponent {}
