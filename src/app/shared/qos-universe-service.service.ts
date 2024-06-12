import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class QosUniverseService {
  
  serverURL = "http://127.0.0.1:3007/";
  headers = new Headers({
    "content-type": "application/json"
  });
  constructor(private httpClient: HttpClient) { }
  
  download(file:any){
    window.open(this.serverURL+"download/"+file.filename);
  }
  telechargerFichier(file:any){
    window.open(this.serverURL+"download/"+file.filename);
  }
  updateHeaders(){
    this.headers.delete('Authorization');
  }
  basicHeader() {
    this.headers.delete("username");
  }
  
  post(url:string, data:any,options?:any): any {
    url = this.serverURL+ url;
    return this.httpClient.post<any>(url, data,options);
  }

  get(url:string): any {
    url = this.serverURL+ url;
    return this.httpClient.get<any>(url)
  }

  put(url: string,id: string, data: any): any {
    url = this.serverURL+ url + '/'+id;
    return this.httpClient.put<any>(url, data)
  }

  patch(url: string,id: string, data:any): any {
    url = this.serverURL+ url + '/'+id;
    return this.httpClient.patch<any>(url, data)
  }
  delete(url:any,id:any): any {
    url = this.serverURL+ url + '/'+id;
    return this.httpClient.delete<any>(url, id);
  }
  
  postFile(type: any,file: any){
    return this.post('files/'+type,file);
  }
}
