import { Injectable } from "@angular/core";
import { qosUniverseService } from "src/app/shared/qosUniverseService";
@Injectable({
  providedIn: "root",
})
export class AgentService {
  constructor(private qosUniverseService: qosUniverseService) {}

  //Requêtes agent
  getAgent() {
    return this.qosUniverseService.get('/agents?filter={"include": [{"relation": "groupe"} ]}');
  }
  getAgentByGroupe(groupeId){
    return this.qosUniverseService.get('/agents?filter={"where":{"groupeId":"'+groupeId+'"},"include": [{"relation": "groupe"} ]}');
  }
  getAgentByJambarsId(id){
    return this.qosUniverseService.get('/agents?filter={"where":{"jambarsId":"'+id+'"},"include": [{"relation": "groupe"} ]}');
  }
  getOneAgent(id) {
    return this.qosUniverseService.get(
      "plaintes/" + id + '?filter={"include": [{"relation": "groupe"} ]}'
    );
  }
  postAgent(agent) {
    return this.qosUniverseService.post("/agents", agent);
  }

  patchAgent(id, data) {
    return this.qosUniverseService.patch("agents", id, data);
  }
  deleteAgent(id) {
    return this.qosUniverseService.delete("/agents", id);
  }

  //Requêtes groupe
  getGroupe() {
    return this.qosUniverseService.get("/groupes");
  }
  getOneGroupe(id) {
    return this.qosUniverseService.get(
      "groupes/" + id 
    );
  }
  getGroupeByName(name){
    return this.qosUniverseService.get('/groupes?filter={"where":{"nomGroupe":"'+name+'"}}');
  }
  postGroupe(groupes) {
    return this.qosUniverseService.post("/groupes", groupes);
  }

  patchGroupe(id, data) {
    return this.qosUniverseService.patch("/groupes", id, data);
  }
  deleteGroupe(id) {
    return this.qosUniverseService.delete("/groupes", id);
  }
}
