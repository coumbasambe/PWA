import { Injectable } from "@angular/core";
import { qosUniverseService } from "src/app/shared/qosUniverseService";
@Injectable({
  providedIn: "root",
})
export class TypologieService {
  constructor(private qosUniverseService: qosUniverseService) {}

  //Requêtes typologie
  getTypologie() {
    return this.qosUniverseService.get('typologies?filter={"include": [{"relation": "sousDomaine"} ]}');
  }
  getOneTypologie(id) {
    return this.qosUniverseService.get("typologies/" + id);
  }
  postTypologie(typologie) {
    return this.qosUniverseService.post("typologies", typologie);
  }

  patchTypologie(id, data) {
    return this.qosUniverseService.patch("typologies", id, data);
  }
  deleteTypologie(id) {
    return this.qosUniverseService.delete("typologies", id);
  }
}
