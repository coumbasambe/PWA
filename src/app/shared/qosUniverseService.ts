import { Injectable } from '@angular/core';
import { HttpClient,HttpHeaders  } from '@angular/common/http';
// import 'rxjs/add/operator/map';
// import 'rxjs/add/operator/catch';
// import { Observable } from 'rxjs/Observable';
import { environment } from 'src/environments/environment';
@Injectable()
export class qosUniverseService {
 //prod
//  serverURL = "https://apis.jambars.orange-sonatel.com/qosuniverse/";
  //local
  
  serverURL = "http://127.0.0.1:3007/";
  headers = new Headers({
    "content-type": "application/json"
  });
  constructor(private httpClient?: HttpClient) { }
  
  download(file){
    window.open(this.serverURL+"download/"+file.filename);
  }
  telechargerFichier(file){
    window.open(this.serverURL+"download/"+file.filename);
  }
  extractPlaintesFile(filename){
    window.open(this.serverURL+"download/"+filename);
  }
  updateHeaders(){
    this.headers.delete('Authorization');
  }
  basicHeader() {
    this.headers.delete("username");
  }
  
  post(url, data,options?): any {
    url = this.serverURL+ url;
    return this.httpClient.post<any>(url, data,options);
  }

  get(url): any {
    url = this.serverURL+ url;
    return this.httpClient.get<any>(url)
  }

  put(url,id, data): any {
    url = this.serverURL+ url + '/'+id;
    return this.httpClient.put<any>(url, data)
  }

  patch(url,id, data): any {
    url = this.serverURL+ url + '/'+id;
    return this.httpClient.patch<any>(url, data)
  }
  delete(url,id): any {
    url = this.serverURL+ url + '/'+id;
    return this.httpClient.delete<any>(url, id)
  }
  
  postFile(type,file){
    return this.post('files/'+type,file);
  }

}
