import { Injectable } from "@angular/core";
import { qosUniverseService } from "src/app/shared/qosUniverseService";
@Injectable({
  providedIn: "root",
})
export class TypeService {
  constructor(private qosUniverseService: qosUniverseService) {}

  //Requêtes type
  getType() {
    return this.qosUniverseService.get("types");
  }
  getOneType(id) {
    return this.qosUniverseService.get("types/" + id);
  }
  postType(type) {
    return this.qosUniverseService.post("types", type);
  }

  patchType(id, data) {
    return this.qosUniverseService.patch("types", id, data);
  }
  deleteType(id) {
    return this.qosUniverseService.delete("types", id);
  }
}
