import { Injectable } from '@angular/core';
import { qosUniverseService } from 'src/app/shared/qosUniverseService';
@Injectable({
    providedIn: 'root'
})

export class CouvertureService {
    constructor(private qosUniverseService: qosUniverseService) { }

    getLocalites(){
        return this.qosUniverseService.get('localites?filter={"include": [{"relation": "couvertures"}]}');
    }
    getOneLocaliteCouverture(id){
        return this.qosUniverseService.get('localites/'+id+'?filter={"include": [{"relation": "couvertures"}]}');
    }
}
