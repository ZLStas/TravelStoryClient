import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders, HttpParams} from '@angular/common/http';
import {Observable, of} from 'rxjs';
import {catchError} from 'rxjs/operators';

import {Like} from "../models/Like";

const httpOptions = {
  headers: new HttpHeaders({'Content-Type': 'application/json'})
};

@Injectable({providedIn: 'root'})
export class LikeService {
  baseUrl = 'http://localhost:8080/api';
  private likesUrl = 'likes';

  constructor(
    private http: HttpClient) {
  }

  /** GET likes from the server */
  getLikes(travelStoryId: number, mediaId: number): Observable<Like[]> {
    // let params = new HttpParams();
    // params.append('travelStoryId', travelStoryId.toString());
    // params.append('mediaId', mediaId.toString());
    return this.http.get<Like[]>(`${this.baseUrl}/${this.likesUrl}&?` +`travelStoryId=` + `${travelStoryId}` + `?mediaId=` + mediaId)
      .pipe(
        catchError(this.handleError('getLikes', []))
      );
  }

  /** POST: add a new like to the server */
  addLike(logedUserId: number, like: Like, travelStoryId: number, mediaId: number): Observable<Like> {
    return this.http.post<Like>(`${this.baseUrl}/${this.likesUrl}/${logedUserId}/${travelStoryId}/${mediaId}`, like, httpOptions).pipe(
      catchError(this.handleError<Like>('addLike'))
    );
  }

  /** DELETE: delete the like from the server */
  deleteLike(like: Like | number): Observable<Like> {
    const id = typeof like === 'number' ? like : like.id;
    const url = `${this.baseUrl}/${this.likesUrl}/${id}`;

    return this.http.delete<Like>(url, httpOptions).pipe(
      catchError(this.handleError<Like>('deleteLike'))
    );
  }

  /**
   * @param operation - name of the operation that failed
   * @param result - optional value to return as the observable result
   */
  private handleError<T>(operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {
      console.error(error);
      return of(result as T);
    };
  }


}
