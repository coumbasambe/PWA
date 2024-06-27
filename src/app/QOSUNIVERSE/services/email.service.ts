import { Injectable } from "@angular/core";
import { qosUniverseService } from "src/app/shared/qosUniverseService";
@Injectable({
  providedIn: "root",
})
export class EmailService {
  constructor(private qosUniverseService: qosUniverseService) {}
  postEmails(email) {
    return this.qosUniverseService.post('/qos-send-email',email);
  }
}
