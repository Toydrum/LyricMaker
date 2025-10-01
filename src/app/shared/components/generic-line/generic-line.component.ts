import { Component, EventEmitter, Input, Output } from '@angular/core';


@Component({
  selector: 'app-generic-line',
  standalone: true,
  templateUrl: './generic-line.component.html',
  styleUrl: './generic-line.component.scss'
})
export class GenericLineComponent {
    @Input() lineNumber!: number;

  // Define the property used by ngModel
  @Input() content: string = '';

  // Optional: emit changes so parent can two-way bind [(content)]
  @Output() contentChange = new EventEmitter<string>();
}
