import { Injectable } from "@angular/core";
import { qosUniverseService } from "src/app/shared/qosUniverseService";
@Injectable({
  providedIn: "root",
})
export class DetailPlainteService {
  constructor(private qosUniverseService: qosUniverseService) {}

  //Requêtes statut
  getStatut() {
    return this.qosUniverseService.get("/statuts");
  }
  getOneStatut(id) {
    return this.qosUniverseService.get("statuts/" + id);
  }
  postStatut(statut) {
    return this.qosUniverseService.post("/statuts", statut);
  }

  patchStatut(id, data) {
    return this.qosUniverseService.patch("/statuts", id, data);
  }
  deleteStatut(id) {
    return this.qosUniverseService.delete("/statuts", id);
  }

  // Requêtes Origine
  getOrigine() {
    return this.qosUniverseService.get("origines");
  }
  getOneOrigine(id) {
    return this.qosUniverseService.get("origines/" + id);
  }
  postOrigine(origine) {
    return this.qosUniverseService.post("origines", origine);
  }

  patchOrigine(id, data) {
    return this.qosUniverseService.patch("origines", id, data);
  }
  deleteOrigine(id) {
    return this.qosUniverseService.delete("origines", id);
  }

  // Requêtes priorité
  getPriorite() {
    return this.qosUniverseService.get("/priorites");
  }
  getOnePriorites(id) {
    return this.qosUniverseService.get("priorites/" + id);
  }
  postPriorite(priorite) {
    return this.qosUniverseService.post("/priorites", priorite);
  }

  patchPriorite(id, data) {
    return this.qosUniverseService.patch("/priorites", id, data);
  }
  deletePriorite(id) {
    return this.qosUniverseService.delete("/priorites", id);
  }

  // Requêtes retour-client
  getRetourClient() {
    return this.qosUniverseService.get("/retour-clients");
  }
  getOneRetourClient(id) {
    return this.qosUniverseService.get("/retour-clients/" + id);
  }
  postRetourClient(retourClient) {
    return this.qosUniverseService.post("/retour-clients", retourClient);
  }

  patchRetourClient(id, data) {
    return this.qosUniverseService.patch("/retour-clients", id, data);
  }
  deleteRetourClient(id) {
    return this.qosUniverseService.delete("/retour-clients", id);
  }
}
