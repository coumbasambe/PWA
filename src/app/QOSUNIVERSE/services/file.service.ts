import { Injectable } from "@angular/core";
import { Http, Headers, RequestOptions } from '@angular/http';
import { Observable } from 'rxjs/Rx';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import { qosUniverseService } from "src/app/shared/qosUniverseService";
@Injectable({
  providedIn: "root",
})
export class FileService {
  constructor(private qosUniverseService: qosUniverseService) {}
  upload(files){
    let headers = new Headers();
    //console.log(files);
    let options = new RequestOptions({ headers: headers });
    return  this.qosUniverseService.post('files', files,options)
      .map(response => response.json())
      .catch(error => Observable.throw(error));

  }

  download(id,file){
     this.qosUniverseService.get('download/'+id+'_'+file);
    }
    getFiles() {
      return this.qosUniverseService.get('/files');
    }
    getOneFiles(id) {
      return this.qosUniverseService.get("files/" + id);
    }
    deleteFile(id) {
      return this.qosUniverseService.delete("files", id);
    }

    
  
}