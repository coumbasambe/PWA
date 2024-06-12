import { Injectable } from "@angular/core";
import { qosUniverseService } from "src/app/shared/qosUniverseService";
@Injectable({
  providedIn: "root",
})
export class DepartementService {
  constructor(private qosUniverseService: qosUniverseService) {}

  getDepartements() {
    return this.qosUniverseService.get('/departement?filter={"include": [{"relation": "region"}]}');
  }
  getOneDepartement(id) {
    return this.qosUniverseService.get( "departement/" + id);
  }
  postDepartement(dept) {
    return this.qosUniverseService.post("/departement", dept);
  }

  patchDepartement(id, data) {
    return this.qosUniverseService.patch("departement", id, data);
  }
  deleteDepartement(id) {
    return this.qosUniverseService.delete("/departement", id);
  }
}
