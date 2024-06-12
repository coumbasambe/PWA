import {
  Component,
  Input,
  OnInit,
} from "@angular/core";

@Component({
  selector: "app-plainte_kpi",
  templateUrl: "plainte_kpi.component.html",
  styles: [
    `
      .table > thead > tr > th {
        border-bottom-width: 1px;
        font-size: 0.825rem;
        font-weight: bold;
        color: #ef6c00;
        /* background-color: #ef6c00 */
      }
      .breadcrumb-dark{
        background-color: black;
        }
   
      .black-card {
        background-color: black;
        }
  
      .table > tbody > tr > td {
      }
      .card {
        box-shadow: none;
      }
      .black-card {
        background-color: black;
      }
      .nav-tabs .nav-item .nav-link.active {
        background-color: rgba(239, 108, 0, 1);
      }
      .card-title {
        font-size: xxx-large;
      }
      .card.card-stats .card-header .card-category:not([class*="text-"]) {
        color: black;
        font-size: 17px;
      }
      .big-text {
        font-size: 70px;
        font-weight:800;
        color: #ff6600;
      }
      .small-text {
        font-size: 30px;
        font-weight:500;
        color: white;
        margin-top:-20px;
      }
    .nav-tabs .nav-item .nav-link, .nav-tabs .nav-item .nav-link:hover, .nav-tabs .nav-item .nav-link:focus {
        font-size: 15px;
    }
    .card-kpi {
      background-color :  #ff8c00;
    }

    .card [class*="card-header-"] .card-icon {
      background-color: #000;
    }
    .card .card-header.card-header-icon .card-title{
      color: black;
    }

    `,
  ],
})
export class PlainteKPIComponent implements OnInit {
  
  @Input() plaintesTotale = 0
  @Input() plaintesEnCours = 0
  @Input() plaintesCloturees = 0
  @Input() plaintesTraiter = 0
  @Input() plaintesPrequalifier = 0
  @Input() plaintesNonPrevu = 0
  @Input() plaintesEnAttente = 0

  constructor(
  ) {
  }

  ngOnInit() {
  
  }
}