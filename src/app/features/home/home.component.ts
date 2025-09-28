import { Component } from '@angular/core';
import { CapitalizePipe } from '../../shared/pipes/capitalize.pipe';
import { HighlightDirective } from '../../shared/directives/highlight.directive';
import { ButtonComponent } from '../../shared/components/button/button.component';
import { LyricPageComponent } from '../components/lyric-page/lyric-page.component';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CapitalizePipe, HighlightDirective, ButtonComponent, LyricPageComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent {
  onClick() {
    // placeholder
  }
}
