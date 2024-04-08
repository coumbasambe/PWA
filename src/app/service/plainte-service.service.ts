import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http'
import { QosUniverseServiceService } from '../qos-universe-service.service';

@Injectable({
  providedIn: 'root'
})
export class PlainteServiceService {

 constructor(private qosuniverseService:QosUniverseServiceService){ }
 getPlaintes(){
  return this.qosuniverseService.get("plaintes")
 }
 
}
