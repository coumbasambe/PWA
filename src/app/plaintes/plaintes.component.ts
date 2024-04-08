import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { PlainteServiceService } from '../service/plainte-service.service';

@Component({
  selector: 'app-plaintes',
  templateUrl: './plaintes.component.html',
  styleUrls: ['./plaintes.component.css']
})
export class PlaintesComponent implements OnInit {
  plaintes:any = [];

  constructor(private router: Router, private plainteService:PlainteServiceService) {  }
  ngOnInit(): void {
    this.getPlaintes()
  }
  goToPlainte() {
    this.router.navigate(["detailPlainte"])   
  }

  getPlaintes(){
    this.plainteService.getPlaintes().subscribe((res : any)=>{
      this.plaintes = res;
    })
  }
}
