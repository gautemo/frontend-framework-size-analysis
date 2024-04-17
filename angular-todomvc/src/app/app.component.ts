import { Component } from '@angular/core';
import { TodoComponent } from './todo/todo.component';


@Component({
  selector: 'app-root',
  standalone: true,
  templateUrl: './app.component.html',
  imports: [TodoComponent]
})
export class AppComponent {
}
