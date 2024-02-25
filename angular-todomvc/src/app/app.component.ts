import { Component, effect, signal, computed } from '@angular/core';
import { TodoComponent } from './todo/todo.component';


@Component({
  selector: 'app-root',
  standalone: true,
  templateUrl: './app.component.html',
  imports: [TodoComponent]
})
export class AppComponent {
  a = signal(0)
  b = computed(() => 2)

  constructor(){
    effect(() => console.log('hi'))
  }
}
