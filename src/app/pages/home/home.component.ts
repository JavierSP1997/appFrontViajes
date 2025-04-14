import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { GuideComponent } from "../../conponents/guide/guide.component";

@Component({
  selector: 'app-home',
  imports: [RouterLink, GuideComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent {

}
