// BlogPost Service - API service for BlogPost CRUD operations

import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { EndpointBase } from './endpoint-base.service';
import { ConfigurationService } from './configuration.service';
import {
  BlogPost,
  BlogPostSearchRequest,
  BlogPostSearchResponse,
  BlogPostResponse,
} from '../models/blog-post.model';

@Injectable({
  providedIn: 'root',
})
export class BlogPostService extends EndpointBase {
  private http = inject(HttpClient);
  private configurations = inject(ConfigurationService);

  private get apiUrl() {
    return this.configurations.baseUrl + '/api/blogposts';
  }

  getAll(request: BlogPostSearchRequest): Observable<BlogPostSearchResponse> {
    let params = new HttpParams();

    if (request.title) params = params.set('title', request.title);
    if (request.slug) params = params.set('slug', request.slug);
    if (request.content) params = params.set('content', request.content);
    if (request.isAvailable !== null && request.isAvailable !== undefined) {
      params = params.set('isAvailable', String(request.isAvailable));
    }
    if (request.publishedDateFrom) {
      params = params.set('publishedDateFrom', new Date(request.publishedDateFrom).toISOString());
    }
    if (request.publishedDateTo) {
      params = params.set('publishedDateTo', new Date(request.publishedDateTo).toISOString());
    }
    if (request.pageIndex !== undefined) {
      params = params.set('pageIndex', String(request.pageIndex));
    }
    if (request.pageSize !== undefined) {
      params = params.set('pageSize', String(request.pageSize));
    }
    if (request.sortField) params = params.set('sortField', request.sortField);
    if (request.sortOrder !== undefined) {
      params = params.set('sortOrder', String(request.sortOrder));
    }

    return this.http
      .get<BlogPostSearchResponse>(this.apiUrl, { ...this.requestHeaders, params })
      .pipe(catchError((error) => this.handleError(error, () => this.getAll(request))));
  }

  getById(id: number): Observable<BlogPostResponse> {
    return this.http
      .get<BlogPostResponse>(`${this.apiUrl}/${id}`, this.requestHeaders)
      .pipe(catchError((error) => this.handleError(error, () => this.getById(id))));
  }

  create(formData: FormData): Observable<BlogPostResponse> {
    return this.http
      .post<BlogPostResponse>(this.apiUrl, formData, this.fileUploadRequestHeaders)
      .pipe(catchError((error) => this.handleError(error, () => this.create(formData))));
  }

  update(id: number, formData: FormData): Observable<BlogPostResponse> {
    return this.http
      .put<BlogPostResponse>(`${this.apiUrl}/${id}`, formData, this.fileUploadRequestHeaders)
      .pipe(catchError((error) => this.handleError(error, () => this.update(id, formData))));
  }

  delete(id: number): Observable<BlogPostResponse> {
    return this.http
      .delete<BlogPostResponse>(`${this.apiUrl}/${id}`, this.requestHeaders)
      .pipe(catchError((error) => this.handleError(error, () => this.delete(id))));
  }
}
