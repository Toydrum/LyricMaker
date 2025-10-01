import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';

export interface LyricsDto {
  text: string;
}

@Injectable({ providedIn: 'root' })
export class LyricsService {
  private http = inject(HttpClient);

  // Construye el DTO a partir de un array de strings (contenido de líneas)
  buildDto(lines: string[], separator: string = '\n'): LyricsDto {
    const joined = lines.map(l => l?.trim() ?? '').join(separator);
    console.log('Built DTO text:', joined);
    return { text: joined };
  }

  // Enviar DTO a un endpoint (ajusta la URL según tu backend)
  submit(dto: LyricsDto) {
    // Placeholder: usa tu URL real
    const url = '/api/lyrics';
    return this.http.post(url, dto);
  }
}
