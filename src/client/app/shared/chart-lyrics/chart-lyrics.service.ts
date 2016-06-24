import { Injectable } from '@angular/core';
import { Http, Response, Headers } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/from';
import 'rxjs/add/operator/map';


export class GetLyricResult {
  TrackId: number;
  LyricChecksum: string;
  LyricId: number;
  LyricSong: string;
  LyricArtist: string;
  LyricUrl: string;
  LyricCovertArtUrl: string;
  LyricRank: number;
  LyricCorrectUrl: string;
  Lyric: string;
}

export class SearchLyricResult
{
  TrackId: number;
  LyricChecksum: string;
  LyricId: number;
  SongUrl: string;
  Artist: string;
  ArtistUrl: string;
  Song: string;
  SongRank: number;
}


/**
 * This class provides the ChartLyricsService service with methods to read names and add names.
 */
@Injectable()
export class ChartLyricsService {

  constructor(private http: Http) {}

  public getSongsByLyricText(lyricText: string): Observable<SearchLyricResult[]> {
    var headers = new Headers();
    headers.append('Accept', 'application/xml');    
    return this.http.get('http://api.chartlyrics.com/apiv1.asmx/SearchLyricText?lyricText='+ lyricText, {headers: headers})
        .map(res => this.searchLyricXmlToJson(res.text())
        .map((value: Array<any>) => {
          let result:Array<SearchLyricResult> = [];  
          if (value) {
            result = value;
          }
          return result;
        }));
    }

 // Changes XML to JSON
  private searchLyricXmlToJson(xmlText: any): any {  
    xmlText = xmlText.replace(/[\n\r]/g, ' ');

    var oParser: DOMParser = new DOMParser();
    var xml: XMLDocument = oParser.parseFromString(xmlText, "text/xml");
    var results: any = xml.getElementsByTagName("SearchLyricResult");
 
    // Create the return object
    var obj:any = [];
    
    for(var i=0; i<results.length; i++) {
      var elems = results.item(i).children;
      var song: any = {};

      for(var j=0; j<elems.length; j++) {
        var elem: any = elems.item(j);
        song[elem["tagName"]] = elem["innerHTML"];
      }
      
      if(song["TrackId"] !== undefined) {
        obj.push(song);
      }      
    }

    return obj;
  }

  public getLyrics(lyricId: number, lyricChecksum: string): Observable<GetLyricResult> {
    var headers = new Headers();
    headers.append('Accept', 'application/xml');    
    return this.http.get('http://api.chartlyrics.com/apiv1.asmx/GetLyric?lyricId='+ lyricId +'&lyricCheckSum='+ lyricChecksum, {headers: headers})
        .map(res => this.getLyricXmlToJson(res.text()));
    }

  // Changes XML to JSON
  private getLyricXmlToJson(xmlText: any): any {  
    xmlText = xmlText.replace(/[\n\r]/g, ' ');

    var oParser: DOMParser = new DOMParser();
    var xml: XMLDocument = oParser.parseFromString(xmlText, "text/xml");
    var results: any = xml.getElementsByTagName("GetLyricResult");
 
    // Create the return object
    var obj:any = {};
    
    for(var i=0; i<results.length; i++) {
      var elems = results.item(i).children;
      var song: any = {};

      for(var j=0; j<elems.length; j++) {
        var elem: any = elems.item(j);
        song[elem["tagName"]] = elem["innerHTML"];
      }
      
      obj = song;    
      obj["Lyric"] = obj["Lyric"].replace(/\s\s/g, '<br />'); 
    }

    return obj;
  }


}

