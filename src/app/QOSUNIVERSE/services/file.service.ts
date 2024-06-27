import { Injectable } from "@angular/core";
import { HttpHeaders } from '@angular/common/http';
import { qosUniverseService } from "src/app/shared/qosUniverseService";
@Injectable({
  providedIn: "root",
})
export class FileService {
  constructor(private qosUniverseService: qosUniverseService) {}
  upload(files){
    let headers = new HttpHeaders();
    //console.log(files);
    // let options = new RequestOptions({ headers: headers });
    return  this.qosUniverseService.post('files', files,headers)
      .map(response => response.json())
      .catch(error => console.log(error));

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