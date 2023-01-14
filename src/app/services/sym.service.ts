import { Injectable, OnInit } from '@angular/core';
import { HttpClient, HttpClientModule, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { cl, rootFileUrl, stringToJson } from 'src/app/globUtils';
import { Observable } from 'rxjs';
import { of } from 'rxjs';
import { map } from 'rxjs/operators';
import { FileTransfer, FileUploadOptions } from '@ionic-native/file-transfer/ngx';
import { HTTP } from '@ionic-native/http/ngx';
import { Storage } from '@ionic/storage';
import { Authentication } from '../glob.module';
// import 'rxjs/add/observable/throw';
// import 'rxjs/add/operator/catch';
// import {Observable}              from 'rxjs/Observable';
// import 'rxjs/add/observable/throw';
//import 'rxjs/Rx';  // use this line if you want to be lazy, otherwise:
// import 'rxjs/add/operator/map';
// import 'rxjs/add/operator/do';  // debug
// import 'rxjs/add/operator/catch';
import {  throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

export enum searchType{
  all='',
  user=''
};

@Injectable({
  providedIn: 'root'
})
export class SymService {
  url = rootFileUrl+'api.lovedonez';
  apiKey = '';
  token: any;

  constructor(
    private http: HttpClient,
    private fileTransfer: FileTransfer,
    private easyHTTP: HTTP,
    private storage: Storage,
    private authentication: Authentication,
    ) {

  }

  getData(): Observable<any>{
    let body = {};
    let headers = new HttpHeaders();

    headers.append('Content-Type', 'application/json')
    headers.append('token', this.token)
    return this.http.post(`${this.url}`, JSON.stringify(body), {headers: headers}).pipe(
      map(results => results)
    );
  }

  easyService(body, token = 'xx.yy.zz'): Observable<any>{

    // this.authentication.getToken().then(res=>{
    // })
    let headers = new HttpHeaders();
    // let headers = new Headers();
    // headers =
    // cl(['token', this.token])
    headers.append('Content-Type', 'application/x-www-form-urlencoded');
    headers.append('Accept', 'application/json');
    // headers.append('token', token);
    return this.http.post(`${this.url}`, body, {
      headers: new HttpHeaders().set('token', token),
    }).pipe(
      map(results => {
        // cl('🐱‍👤',results)
        return results
      })
    ).pipe(
      catchError(this.handleError)
      );
  }

  // public handleError(error) {
  //   console.error(error);
  //   return Observable.throw(error.json().error || 'Server error');
  // }

  upload(body, callback){
    let options: FileUploadOptions = {
      fileKey: 'file',
      fileName: body['fileName'],
      chunkedMode: false,
      mimeType: body['fileType'],
      headers: {}

   }
    this.fileTransfer.create().upload(body['localFilePath'], this.url, options).then((result) => {
      callback(result);
    })
  }




  async download(body) {
    return new Promise<Object>((async resolve => {

      // cl(body)

      await this.easyHTTP.downloadFile(body.serverUrl, {}, {}, body.localUrl).then((result) => {
          // console.log('download complete: ' + result);
          if(result != undefined){
            resolve(body.localUrl);
          }
        }).catch((error) => {
          resolve(error);
      })

      // this.fileTransfer.create().download(body.serverUrl, body.localUrl, true, {headers: {'Connection': 'close'}}).then((entry) => {
      //   console.log('download complete: ' + entry.toURL());
      //   resolve(entry.toURL());
      // }, (error) => {
      //   cl(error)
      //   // handle error
      // });
    }))
}
handleError(error: HttpErrorResponse) {
  cl(error)
  let errorMessage = 'Unknown error!';
  if (error.error instanceof ErrorEvent) {
    // Client-side errors
    errorMessage = `Error: ${error.error.message}`;
  } else {
    // Server-side errors
    errorMessage = `Error Code: ${error.status}\nMessage: ${error.message}`;
  }

  // if(error.error['response'] === "failed_to_authenticate"){
  //   cl(error.error['response'])
  //   return error.error['response'];
  // }
  // window.alert(errorMessage);
  return throwError(error.error['response']);
}

async logout(){
  this.authentication.logout();
}
// async getToken(callback) {

// }
}
