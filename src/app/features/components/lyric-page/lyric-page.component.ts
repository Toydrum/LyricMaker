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
      next: (res) => {
        console.log('Submitted DTO:', dto, 'Response:', res);
        // Mapear la respuesta del backend a un modelo de vista para pintar sílabas
        this.analysis = this.mapResponseToAnalysis(res);
      },
      error: (err) => console.error('Submit failed:', err)
    });
  }

  // ===== Resultado de análisis (vista) =====
  // Modelo de vista: cada línea con sus palabras y sílabas y total por línea
  analysis: Array<{ words: Array<{ text: string; syllables: string[] }>; total: number }> | undefined;

  // Recibe la respuesta del backend y la normaliza a "analysis"
  private mapResponseToAnalysis(res: any) {
    // Soportamos varias formas comunes. Ajusta aquí si tu backend usa otra estructura.
    // Forma preferida: { lines: [{ words: [{ text: string, syllables: string[] }] }] }
    let rawLines: any[] = [];

    if (Array.isArray(res)) {
      rawLines = res;
    } else if (Array.isArray(res?.lines)) {
      rawLines = res.lines;
    } else if (Array.isArray(res?.items)) {
      // Caso de backend: items = array de líneas; cada línea = array de tokens { type, token/text, syllables }
      const items: any[] = res.items;
      const countsPerLine: number[] | undefined = Array.isArray(res?.counts?.syllables_per_line)
        ? res.counts.syllables_per_line
        : undefined;

      const mappedFromItems = items.map((lineTokens: any[], idx: number) => {
        const words = (Array.isArray(lineTokens) ? lineTokens : [])
          .filter((t) => {
            const type = String(t?.type ?? '').toLowerCase();
            // Excluir puntuación; incluir words y numbers
            return type !== 'punct' && type !== 'punct_open' && type !== 'punct_close';
          })
          .map((t) => {
            const text = String(t?.token ?? t?.text ?? '');
            const syl = t?.syllables;
            const syllables: string[] = Array.isArray(syl) ? syl.map((s: any) => String(s)) : (text ? [text] : []);
            return { text, syllables };
          });

        // Si el backend provee el total por línea, úsalo; si no, calculamos.
        const total = countsPerLine?.[idx] ?? words.reduce((sum, w) => sum + (w.syllables?.length ?? 0), 0);
        return { words, total };
      });

      return mappedFromItems;
    } else if (typeof res?.data === 'string' || typeof res?.text === 'string' || typeof res === 'string') {
      // Fallback: si viene texto plano, segmentamos por líneas y palabras y tratamos cada palabra como 1 "sílaba"
      const text: string = String(res?.data ?? res?.text ?? res ?? '');
      return text.split(/\r?\n/).map((line) => {
        const words = line.trim()
          ? line.trim().split(/\s+/).map((w) => ({ text: w, syllables: [w] }))
          : [];
        const total = words.reduce((sum, w) => sum + w.syllables.length, 0);
        return { words, total };
      });
    } else if (Array.isArray(res?.data)) {
      rawLines = res.data;
    }

    const mapped = rawLines.map((line: any) => {
      // Si la línea ya es string
      if (typeof line === 'string') {
        const words = line.trim()
          ? line.trim().split(/\s+/).map((w) => ({ text: w, syllables: [w] }))
          : [];
        const total = words.reduce((sum, w) => sum + w.syllables.length, 0);
        return { words, total };
      }

      // Si la línea tiene palabras con sílabas
      const wordArr: any[] = Array.isArray(line?.words) ? line.words : [];
      const words = wordArr.map((w: any) => {
        const text = String(w?.text ?? w?.word ?? '');
        const sylls = w?.syllables ?? w?.syl ?? w?.segments ?? [];
        const syllables: string[] = Array.isArray(sylls) ? sylls.map((s: any) => String(s)) : [];
        return { text, syllables };
      });

      const total = words.reduce((sum, w) => sum + (w.syllables?.length ?? 0), 0);
      return { words, total };
    });

    return mapped;
  }

  // Eliminar una línea del resultado de análisis por índice
  removeAnalysisLine(index: number) {
    if (!Array.isArray(this.analysis)) return;
    this.analysis = this.analysis.filter((_, i) => i !== index);
  }
}
