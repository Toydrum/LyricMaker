import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-button',
  standalone: true,
  templateUrl: './button.component.html',
  styleUrl: './button.component.scss'
})
export class ButtonComponent {
  @Input() disabled = false;
  @Input() sign = "";
  @Output() clicked = new EventEmitter<Event>();

  addLine() {
    this.clicked.emit(new Event('add-line'));
  }
}
