import { Injectable } from "@angular/core";
import { qosUniverseService } from "src/app/shared/qosUniverseService";
@Injectable({
  providedIn: "root",
})
export class RegionService {
  constructor(private qosUniverseService: qosUniverseService) {}

  getRegions() {
    return this.qosUniverseService.get('/region');
  }
  getOneRegion(id) {
    return this.qosUniverseService.get( "region/" + id);
  }
  postRegion(region) {
    return this.qosUniverseService.post("/region", region);
  }

  patchRegion(id, data) {
    return this.qosUniverseService.patch("region", id, data);
  }
  deleteRegion(id) {
    return this.qosUniverseService.delete("/region", id);
  }
}
