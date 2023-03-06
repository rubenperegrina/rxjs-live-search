import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { debounceTime, distinctUntilChanged, filter, Observable, Subject, switchMap } from 'rxjs';
import { Character } from './interfaces/character';
import { ApiService } from './services/api.service';

@Component({
  selector: 'app-root',
  template: `
  <div class="flex items-center justify-center">
    <form class="w-11/12 mt-5 mb-5">
      <label for="default-search" class="mb-4 text-sm font-medium text-gray-900 sr-only dark:text-white">Search</label>
      <div class="relative">
        <div class="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
          <svg aria-hidden="true" class="w-5 h-5 text-gray-500 dark:text-gray-400" fill="none" stroke="currentColor"
            viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
          </svg>
        </div>
        <input type="search" id="default-search" (input)="search($event)"
          class="block w-full p-4 pl-10 text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
          placeholder="Search..." required>
        <button type="submit"
          class="text-white absolute right-2.5 bottom-2.5 bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-4 py-2 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">Search</button>
      </div>
    </form>
  </div>

  <div class="grid grid-cols-4 gap-4">
    <div class="p-4 rounded-lg shadow-md" *ngFor="let character of characters$ | async">
      <img [src]="character.image" alt="{{character.name}}" class="object-cover object-center w-full rounded-t-lg">
      <h5 class="mb-2 text-2xl font-bold text-gray-900">
        {{character.name }}
      </h5>
    </div>
  </div>
  `,
  styles: [],
  standalone: true,
  imports: [CommonModule]
})
export class AppComponent {
  searchTerm$ = new Subject<string>();
  characters$!: Observable<Character[]>;
  private apiService = inject(ApiService);

  constructor() {
    this.characters$ = this.searchTerm$.pipe(
      filter((term: string) => term.length >= 3),
      debounceTime(300),
      distinctUntilChanged(),
      switchMap((term: string) => this.apiService.filterCharacter(term))
    );
  }

  search(event: Event): void {
    const element = event.currentTarget as HTMLInputElement;
    this.searchTerm$.next(element.value);
  }
}
