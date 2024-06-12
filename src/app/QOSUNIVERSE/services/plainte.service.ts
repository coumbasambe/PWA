import { HttpHeaders } from "@angular/common/http";
import { Injectable } from "@angular/core";
// import { Observable } from "rxjs-compat";
import { BaseService } from "src/app/shared/base.service";
import { QosUniverseService } from "src/app/shared/qos-universe-service.service";
@Injectable({
  providedIn: "root",
})
export class PlainteService {

  constructor(private qosUniverseService: QosUniverseService, private baseService: BaseService) { }
  // 'https://apis.jambars.orange-sonatel.com/qosuniverse/plainte-groupes?filter={"where":{"groupeId":"6581c57b9e3a404b7fc09c9e"},"include": [{"relation": "plainte","scope": {"include": [{"relation":"origine"},{"relation":"priorite"},{"relation":"sousDomaine"},{"relation":"type"}]}},{"relation": "statut"},{"relation": "groupe"}]}'

  // Requêtes plaintes
  getPlaintes() {
    return this.qosUniverseService.get('/plaintes?filter={"order":["dateReception DESC"],"include": [{"relation": "statut"},{"relation": "origine"},{"relation": "type"},{"relation": "priorite"},{"relation": "typologie"},  {"relation": "sousDomaine","scope": {"include": [{"relation":"domaine"}]}}  ]}');
  }

  getPlainteKpi(){
    return this.qosUniverseService.get('plaintes-kpi');
  }

  getPlaintesSuiviesByGpcId(gpcId:string){
    return this.qosUniverseService.get('plaintes-suivies/'+gpcId);
  }

  getPlaintesBacklogByUserId(userId: string) {
    return this.qosUniverseService.get('plaintes-backlog/'+userId)
  }

  getPlaintesNonQualifier() {
    return this.qosUniverseService.get('plaintes-non-qualifier');
  }
  
  getPlaintesPeriode(dateDebut, dateFin) {
    return this.qosUniverseService.get('/plaintes?filter={"where":{"and": [{"dateReception": {"gte": "' + dateDebut + '" }},{"dateReception": {"lte": "' + dateFin + '"}}]},"order":["dateReception DESC"],"include": [{"relation": "statut"},{"relation": "origine"},{"relation": "type"},{"relation": "priorite"},{"relation": "typologie"},  {"relation": "sousDomaine","scope": {"include": [{"relation":"domaine"}]}}]}')
  }

  getUserPlaintes(userId) {
    return this.qosUniverseService.get('/plaintes?filter={"where": { "expediteurId": "' + userId + '"},"include": [{"relation": "statut"},{"relation": "origine"},{"relation": "type"},{"relation": "priorite"},{"relation": "typologie"},  {"relation": "sousDomaine","scope": {"include": [{"relation":"domaine"}]}}  ]}');
  }
  getGroupPlaintes(groupId) {
    return this.qosUniverseService.get('/plaintes?filter={"where": { "groupeAssocieId": "' + groupId + '"},"include": [{"relation": "statut"},{"relation": "origine"},{"relation": "type"},{"relation": "priorite"},{"relation": "typologie"},  {"relation": "sousDomaine","scope": {"include": [{"relation":"domaine"}]}}  ]}');
  }
  getOnePlainte(id) {
    return this.qosUniverseService.get(`plaintes/${id}?filter={"include": [{"relation":"messages", "scope": {"order":["date DESC"], "include": [{"relation": "agent"}]}},{"relation": "quartier","scope":{"include":[{"relation":"commune","scope":{"include":[{"relation":"departement","scope":{"include":[{"relation":"region"}]}}]}}]}},{"relation": "statut"},{"relation": "sousDomaine","scope": {"include": [{"relation":"domaine"}]}}  ]}`);
    // return this.qosUniverseService.get(`plaintes/${id}?filter={"include": [{"relation":"messages", "scope": {"order":["date DESC"], "include": [{"relation": "agent"}]}},{"relation": "quartier","scope":{"include":[{"relation":"commune","scope":{"include":[{"relation":"departement","scope":{"include":[{"relation":"region"}]}}]}}]}},{"relation": "statut"},{"relation": "origine"},{"relation": "type"},{"relation": "priorite"},{"relation": "typologie"},  {"relation": "sousDomaine","scope": {"include": [{"relation":"domaine"}]}}  ]}`);
  }

  deletePlainte(id) {
    return this.qosUniverseService.delete("plaintes", id);
  }
  postPlainte(plainte) {
    return this.qosUniverseService.post("plaintes", plainte);
  }
  patchPlainte(id, data) {
    return this.qosUniverseService.patch("plaintes", id, data);
  }
  // plaintesCount(): Observable<number> {
  //   return this.qosUniverseService.get("plaintes/count");
  // }
  updatePlainte(id, data) {
    return this.qosUniverseService.patch("plaintes", id, data);
  }
  solderPlainte(plainte) {
    return this.qosUniverseService.patch("plaintes", plainte.id, plainte);
  }

  postFile(file) {
    const requestOptions = { headers: new HttpHeaders({ 'Content-Type': 'multipart/form-data' }) };
    return this.qosUniverseService.postFile(requestOptions, file);
  }
  sendFile(file) {
    //const requestOptions = { headers: new HttpHeaders({ 'Content-Type': 'multipart/form-data' }) };
    return this.qosUniverseService.post('files', file);
  }
  downloadFile(file) {
    this.qosUniverseService.download(file);
  }
  // Requêtes retour-client
  getRetourClient() {
    return this.qosUniverseService.get("retour-clients");
  }
  getOneRetourClient(id) {
    return this.qosUniverseService.get("retour-clients/" + id);
  }

  getRetourClientPlainte(plainteId) {
    return this.qosUniverseService.get(`retour-clients/${plainteId}`);
  }
  deleteRetourClient(id) {
    return this.qosUniverseService.delete("retour-clients", id);
  }
  postRetourClient(retourClient) {
    return this.qosUniverseService.post("retour-clients", retourClient);
  }
  patchRetourClient(id, data) {
    return this.qosUniverseService.patch("retour-clients", id, data);
  }

  //Requêtes Localisation
  getLocalisation() {
    return this.qosUniverseService.get("localisations");
  }
  getOneLocalisation(id) {
    return this.qosUniverseService.get("localisations/" + id);
  }

  getLocalisationPlainte(plainteId) {
    return this.qosUniverseService.get(`localisations/${plainteId}`);
  }

  deleteLocalisation(id) {
    return this.qosUniverseService.delete("localisations", id);
  }

  postLocalisation(localisation) {
    return this.qosUniverseService.post("localisations", localisation);
  }

  patchLocalisation(id, data) {
    return this.qosUniverseService.patch("localisations", id, data);
  }

  // Requêtes non gérées
  postAction(action) {
    return this.qosUniverseService.post("actions", action);
  }

  postAvancement(avancement) {
    return this.qosUniverseService.post("avancements", avancement);
  }

  updateAction(action) {
    return this.qosUniverseService.patch("actions", action.id, action);
  }

  postpieceJointe(id, data) {
    return this.qosUniverseService.post(
      "/plaintes/" + id + "/piece-jointes",
      data
    );
  }
}
