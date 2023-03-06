import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable, map, catchError, EMPTY } from 'rxjs';
import { Character, ResponseInfoResults } from '../interfaces/character';

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  private readonly http = inject(HttpClient);

  filterCharacter(name: string): Observable<Character[]> {
    const API = `https://rickandmortyapi.com/api/character/?name=${name}`;
    return this.http.get<ResponseInfoResults>(API).pipe(
      map((res: ResponseInfoResults) => res?.results),
      catchError(() => EMPTY)
    );
  }
}
