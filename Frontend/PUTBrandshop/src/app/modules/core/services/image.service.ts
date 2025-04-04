import { register } from './../../auth/store/auth.actions';
import {
  HttpClient,
  HttpEvent,
  HttpParams,
  HttpResponse,
} from '@angular/common/http';
import { EventEmitter, Injectable } from '@angular/core';
import { Observable, map, of } from 'rxjs';
import { environment } from 'src/environments/environment';
import {
  PostImageResponse,
  Image,
  DeleteImageResponse,
  PostImagesResponse,
  ImageList,
} from '../models/image.model';
import { AngularEditorConfig, UploadResponse } from '@kolkov/angular-editor';
import { DialogImageComponent } from '../../administration/components/administrator/dialog-image/dialog-image.component';
import { MatDialog } from '@angular/material/dialog';

@Injectable({
  providedIn: 'root',
})
export class ImageService {
  private apiUrl = `${environment.apiUrl}/file`;

  config: AngularEditorConfig = {
    editable: true,
    spellcheck: true,
    height: '15rem',
    minHeight: '5rem',
    placeholder: 'Wpisz opis produktu tutaj...',
    translate: 'no',
    defaultParagraphSeparator: 'p',
    defaultFontName: 'Arial',
    sanitize: false,
    toolbarHiddenButtons: [['insertVideo', 'insertImage']],
    customClasses: [
      {
        name: 'quote',
        class: 'quote',
      },
      {
        name: 'redText',
        class: 'redText',
      },
      {
        name: 'titleText',
        class: 'titleText',
        tag: 'h1',
      },
    ],
    uploadWithCredentials: true,
    uploadUrl: '',
    upload: () => {
      return this.addFile();
    },
  };

  constructor(private http: HttpClient, public dialog: MatDialog) {}

  addFile(): Observable<HttpResponse<UploadResponse>> {
    const dialogRef = this.dialog.open(DialogImageComponent, {
      width: '80%',
      enterAnimationDuration: '200ms',
      exitAnimationDuration: '200ms',
    });
    let obs: EventEmitter<HttpResponse<UploadResponse>> = new EventEmitter();
    dialogRef.afterClosed().subscribe((result: Image) => {
      if (result) {
        let resultimg: Image = result;
        const uploadResponse: UploadResponse = {
          imageUrl: resultimg!.url,
        };
        obs.emit(
          new HttpResponse<UploadResponse>({
            headers: undefined,
            status: 400,
            statusText: undefined,
            url: undefined,
            body: uploadResponse,
          })
        );
      }
    });
    return obs;
  }

  addImage(formData: FormData): Observable<Image> {
    return this.http
      .post<PostImageResponse>(`${this.apiUrl}`, formData, {
        withCredentials: true,
      })
      .pipe(
        map((resp) => {
          return { url: `${this.apiUrl}?uid=${resp.uid}` };
        })
      );
  }

  getImages(pageIndex = 1, itemsPerPage = 15): Observable<ImageList> {
    let params = new HttpParams()
      .append('_page', pageIndex)
      .append('_limit', itemsPerPage);
    return this.http
      .get<PostImagesResponse>(`${this.apiUrl}/get-all`, {
        withCredentials: true,
        observe: 'response',
        params,
      })
      .pipe(
        map((response) => {
          let images: Image[] = [];
          if (response.body) {
            let len = response.body.fileDTOS.length;
            for (let i = 0; i < len; i++) {
              images.push({
                url: `${this.apiUrl}?uid=${response.body.fileDTOS.at(i)?.uid}`,
              });
            }
          }
          if (!response.body) {
            return { images: [], totalCount: 0 };
          } else {
            const totalCount = Number(response.headers.get('X-Total-Count'));
            return { images, totalCount };
          }
        })
      );
  }

  uploadImage(file: File): Observable<HttpEvent<UploadResponse>> {
    const formData = new FormData();
    formData.append('multipartFile', file);
    return this.http
      .post<PostImageResponse>(`${this.apiUrl}`, formData, {
        withCredentials: true,
        observe: 'events',
      })
      .pipe(
        map((event) => {
          if (event instanceof HttpResponse) {
            const response: PostImageResponse = event.body!;
            const uploadResponse: UploadResponse = {
              imageUrl: `${this.apiUrl}?uid=${response.uid}`,
            };
            return new HttpResponse<UploadResponse>({
              ...event,
              headers: event.headers,
              status: event.status,
              statusText: event.statusText,
              url: event.url || undefined,
              body: uploadResponse,
            });
          }
          return event;
        })
      );
  }

  // deleteImage(uid: string): Observable<DeleteImageResponse> {
  //   const params = new HttpParams().append('uid', uid);
  //   return this.http.delete<DeleteImageResponse>(`${this.apiUrl}`, {
  //     params,
  //     withCredentials: true,
  //   });
  // }
}
