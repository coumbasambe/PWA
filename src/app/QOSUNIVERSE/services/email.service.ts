import { Injectable } from "@angular/core";
import { QosUniverseService } from "src/app/shared/qos-universe-service.service";
@Injectable({
  providedIn: "root",
})
export class EmailService {
  constructor(private qosUniverseService: QosUniverseService) {}
  postEmails(email) {
    return this.qosUniverseService.post('/qos-send-email',email);
  }
}
