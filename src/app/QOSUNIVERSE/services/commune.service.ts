import { Injectable } from "@angular/core";
import { qosUniverseService } from "src/app/shared/qosUniverseService";
@Injectable({
  providedIn: "root",
})
export class CommuneService {
  constructor(private qosUniverseService: qosUniverseService) {}

  getCommunes() {
    return this.qosUniverseService.get('/commune?filter={"include": [{"relation": "departement"}]}');
  }
  getOneCommune(id) {
    return this.qosUniverseService.get( "commune/" + id);
  }
  postCommune(commune) {
    return this.qosUniverseService.post("/commune", commune);
  }

  patchCommune(id, data) {
    return this.qosUniverseService.patch("commune", id, data);
  }
  deleteCommune(id) {
    return this.qosUniverseService.delete("/commune", id);
  }
}
