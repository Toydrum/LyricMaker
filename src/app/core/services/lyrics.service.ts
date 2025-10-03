import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
// 1) Import the environment object. During production builds, this file is replaced
//    by `environment.prod.ts` thanks to the fileReplacements we added in angular.json.
import { environment } from '../../../environments/environment';
// Note: Do NOT import from a root .env file; Angular (browser) doesn't read Node .env files.
// Use the Angular environment files (development/production) configured at build time instead.

export interface LyricsDto {
  text: string;
}

@Injectable({ providedIn: 'root' })
export class LyricsService {
  private http = inject(HttpClient);

  // Construye el DTO a partir de un array de strings (contenido de líneas)
  buildDto(lines: string[], separator: string = '\n'): LyricsDto {
    const joined = lines.map(l => l?.trim() ?? '').join(separator);
    
    return { text: joined };
  }

  // Enviar DTO a un endpoint (ajusta la URL según tu backend)
  submit(dto: LyricsDto) {
    // 2) Build the URL using the environment base URL. Keep the path relative here.
    //    We avoid double slashes by trimming any trailing slash from apiBaseUrl.
  // Normalizamos: quitamos cualquier slash al final y agregamos uno para asegurar
  // que quede exactamente un '/' al final (p.ej., '.../split-syllables/').
  const base = environment.apiBaseUrl.replace(/\/+$/, '') + '/';
 
  const url = `${base}`;
    return this.http.post(url, dto);
  }
}
