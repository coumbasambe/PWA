import { Injectable } from "@angular/core";
import { QosUniverseService } from "src/app/shared/qos-universe-service.service";
@Injectable({
  providedIn: "root",
})
export class TypologieService {
  constructor(private qosUniverseService: QosUniverseService) {}

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
