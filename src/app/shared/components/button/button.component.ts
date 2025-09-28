import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-button',
  standalone: true,
  template: `<button type="button" [disabled]="disabled" (click)="clicked.emit($event)" class="btn">
    <ng-content></ng-content>
  </button>`,
  styles: [`.btn{padding:.5rem 1rem;border-radius:.5rem;border:1px solid #ccc;cursor:pointer}`]
})
export class ButtonComponent {
  @Input() disabled = false;
  @Output() clicked = new EventEmitter<Event>();
}
