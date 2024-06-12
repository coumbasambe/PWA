import { Injectable } from '@angular/core';
import { qosUniverseService } from 'src/app/shared/qosUniverseService';
import { Courrier } from '../models/courrier';
@Injectable({
    providedIn: 'root'
})

export class CourrierService {
    constructor(private qosUniverseService: qosUniverseService) { }

    getCourriers(){
        return this.qosUniverseService.get('courriers');
    }
    getOneCourrier(id){
        return this.qosUniverseService.get('courriers/'+id+'?filter={"include": [{"relation": "avancements"}, {"relation": "actions"}, {"relation": "pieceJointes"}]}');
    }
    postAction(action){
        return this.qosUniverseService.post('actions',action);
    }
    postAvancement(avancement){
        return this.qosUniverseService.post('avancements',avancement);
    }
    postCourrier(courrier){
        return this.qosUniverseService.post('courriers',courrier);
    } 
    patchCourrier(courrier){
        return this.qosUniverseService.patch('courriers',courrier.id,courrier);
    }
    deleteCourrier(id){
        return this.qosUniverseService.delete('courriers',id,);
    }
    solderCourrier(id,data){
        return this.qosUniverseService.patch('courriers',id,data);
    }   
    updateAction(action){
        return this.qosUniverseService.patch('actions',action.id,action);
    }
    updateCourrier(id,data){
        return this.qosUniverseService.patch('courriers',id,data);
    }
    postpieceJointe(id,data){
        return this.qosUniverseService.post('/courriers/'+id+'/piece-jointes',data);
    }
}
