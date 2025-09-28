import { Component } from '@angular/core';
import { CapitalizePipe } from '../../shared/pipes/capitalize.pipe';
import { HighlightDirective } from '../../shared/directives/highlight.directive';
import { ButtonComponent } from '../../shared/components/button/button.component';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CapitalizePipe, HighlightDirective, ButtonComponent],
  template: `
    <section>
      <h2 appHighlight="#ffe6a7">{{ 'home' | capitalize }}</h2>
      <p>Bienvenido a LyricMaker.</p>
      <app-button (clicked)="onClick()">Click me</app-button>
    </section>
  `,
})
export class HomeComponent {
  onClick() {
    // placeholder
  }
}
