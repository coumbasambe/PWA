import { Injectable } from "@angular/core";
import { qosUniverseService } from "src/app/shared/qosUniverseService";
@Injectable({
  providedIn: "root",
})
export class ComplexiteService {
  constructor(private qosUniverseService: qosUniverseService) {}

  //Requêtes Complexite
  getComplexites() {
    return this.qosUniverseService.get("complexites");
  }
  
  getOneComplexite(id) {
    return this.qosUniverseService.get("complexites/" + id);
  }
  postComplexite(complexite) {
    return this.qosUniverseService.post("complexites", complexite);
  }

  patchComplexite(id, data) {
    return this.qosUniverseService.patch("complexites", id, data);
  }
  deleteComplexite(id) {
    return this.qosUniverseService.delete("complexites", id);
  }
}
