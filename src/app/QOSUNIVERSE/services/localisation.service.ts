import { Injectable } from "@angular/core";
import { qosUniverseService } from "src/app/shared/qosUniverseService";
@Injectable({
  providedIn: "root",
})
export class PlainteService {
  constructor(private qosUniverseService: qosUniverseService) {}

  //Requêtes localisation
  getLocalisation() {
    return this.qosUniverseService.get("/localisations");
  }
  postLocalisation(localisation) {
    return this.qosUniverseService.post("/localisations", localisation);
  }

  patchLocalisation(id, data) {
    return this.qosUniverseService.patch("/localisations", id, data);
  }
  deleteLocalisation(id) {
    return this.qosUniverseService.delete("/localisations", id);
  }
}
