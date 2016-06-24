import { Component } from '@angular/core';
import { REACTIVE_FORM_DIRECTIVES } from '@angular/forms/index';

import { ChartLyricsService, SearchLyricResult, GetLyricResult } from '../shared/index';

/**
 * This class represents the lazy loaded HomeComponent.
 */
@Component({
  moduleId: module.id,
  selector: 'sd-home',
  templateUrl: 'home.component.html',
  styleUrls: ['home.component.css'],
  directives: [REACTIVE_FORM_DIRECTIVES]
})

export class HomeComponent {

  showLyrics: boolean = false;
  selectedSong: GetLyricResult = new GetLyricResult();
  savedSongs: SearchLyricResult[] = [];
  songs: SearchLyricResult[] = [];
  searchText: string;
  errorMessage: string;

  constructor(public chartLyricsService: ChartLyricsService) {}


  searchLyrics(): boolean {
    this.clearSearch();
    
    if(this.searchText.length > 0) {
      this.chartLyricsService.getSongsByLyricText(this.searchText)
                     .subscribe(
                       songs => this.songs = songs,
                       error =>  this.errorMessage = <any>error);
    }
          
    this.searchText = '';
    return false;
  }

  addSong(song: SearchLyricResult) {
    this.savedSongs.push(song);
  }

  clearSearch() {
    this.songs = [];
    this.errorMessage = undefined;
    this.showLyrics = false;
  }

  getLyrics(song: SearchLyricResult) {
    this.showLyrics = true;
    this.chartLyricsService.getLyrics(song.LyricId, song.LyricChecksum)
                .subscribe(
                  lyrics => this.selectedSong = lyrics,
                  error =>  this.errorMessage = <any>error);
    
  }

}
