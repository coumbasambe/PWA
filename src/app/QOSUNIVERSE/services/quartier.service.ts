import { HttpHeaders } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { BaseService } from "src/app/shared/base.service";
import { qosUniverseService } from "src/app/shared/qosUniverseService";
import { Quartier } from "../models/quartier";
@Injectable({
    providedIn: "root",
})
export class QuartierService {
    constructor(private qosUniverseService: qosUniverseService, private baseService: BaseService) { }

    fecthQuartiers() {
        return this.qosUniverseService.get('/quartiers?filter={"include": [{"relation": "commune", "scope": {"include": [{"relation": "departement", "scope":{"include":[{"relation": "region"}]} }]}}]}');
    }

    getAllQuartier() {
        return this.qosUniverseService.get('/quartiers?filter={"include": [{"relation": "commune"}]}');
    }

    postQuartier(quartier: Quartier) {
        return this.qosUniverseService.post('/quartiers', quartier)
    }

}
