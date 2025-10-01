import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GenericLineComponent } from '../../../shared/components/generic-line/generic-line.component';

import {
  FormGroup,
  FormControl,
  FormArray,
  Validators,
  FormBuilder,
  ReactiveFormsModule,
} from '@angular/forms';
import { Line } from '../../../shared/types/common';
import { LyricsService } from '../../../core/services/lyrics.service';

type LineForm = FormGroup<{
  lineNumber: FormControl<number>;
  content: FormControl<string>;
}>;
@Component({
  selector: 'app-lyric-page',
  imports: [CommonModule, ReactiveFormsModule, GenericLineComponent],
  templateUrl: './lyric-page.component.html',
  styleUrl: './lyric-page.component.scss',
})
export class LyricPageComponent {
  private fb = inject(FormBuilder);
  private lyrics = inject(LyricsService);
  // Form principal con FormArray de líneas
  form = this.fb.nonNullable.group({
    lines: this.fb.array<LineForm>([]),
  });

  // Atajo tipado
  get lines(): FormArray<LineForm> {
    return this.form.controls.lines;
  }

  // Crea un grupo de línea tipado
  private createLineGroup(
    line: Partial<Line> & Pick<Line, 'lineNumber'>
  ): LineForm {
    return this.fb.nonNullable.group({
      lineNumber: this.fb.nonNullable.control(line.lineNumber),
      content: this.fb.nonNullable.control(line.content ?? '', [
        Validators.required,
        Validators.minLength(1),
      ]),
    });
  }

  // Inicialización opcional
  ngOnInit() {
    const initial: Line[] = [{ lineNumber: 1, content: '' }];
    initial.forEach((l) => this.lines.push(this.createLineGroup(l)));
  }

  addLine() {
    const nextNumber = this.lines.length + 1;
    this.lines.push(
      this.createLineGroup({ lineNumber: nextNumber, content: '' })
    );
  }

  removeLine(index: number) {
    this.lines.removeAt(index);
    // Reindexar lineNumber (opcional)
    this.lines.controls.forEach((g, i) =>
      g.controls.lineNumber.setValue(i + 1, { emitEvent: false })
    );
  }

  onContentChange(index: number, value: string) {
    const group = this.lines.at(index);
    group.controls.content.setValue(value);
  }

  onSubmit() {
    if (this.form.invalid) return;
    const value: { lines: Line[] } = this.form.getRawValue();
    const contents = value.lines.map(l => l.content);
    const dto = this.lyrics.buildDto(contents, '\n');
    // Enviar al backend (placeholder URL)
    this.lyrics.submit(dto).subscribe({
      next: (res) => console.log('Submitted DTO:', dto, 'Response:', res),
      error: (err) => console.error('Submit failed:', err)
    });
  }
}
