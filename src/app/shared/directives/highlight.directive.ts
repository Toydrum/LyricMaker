import { Directive, ElementRef, Input, OnInit } from '@angular/core';

@Directive({ selector: '[appHighlight]', standalone: true })
export class HighlightDirective implements OnInit {
  @Input('appHighlight') color = 'yellow';
  constructor(private el: ElementRef) {}
  ngOnInit(): void {
    (this.el.nativeElement as HTMLElement).style.backgroundColor = this.color;
  }
}
