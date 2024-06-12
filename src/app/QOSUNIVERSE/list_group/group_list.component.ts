import {
  Component,
  Input,
  OnInit,
  QueryList,
  ViewChildren,
} from "@angular/core";
import { Router } from "@angular/router";
import { DataTableDirective } from "angular-datatables";
import { Subject } from "rxjs";
import { PlainteService } from "../services/plainte.service";
import { Plainte } from "../models/plainte";
import { PlainteGroupeService } from "../services/plainte-groupe.service";
import { PlainteGroupe } from "../models/plainteGroupe";
import { AuthService } from "src/app/pages/auth/auth.service";
import { AgentService } from "../services/agent.service";
import { Agent } from "../models/agent";
import * as moment from "moment";

@Component({
  selector: "app-group_list",
  templateUrl: "group_list.component.html",
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
        font-size: 0.995rem;
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
    `,
  ],
})
export class GroupListComponent implements OnInit {
  dtOptions: any = {};
  dtTrigger: Subject<any> = new Subject();
  agent: Agent;

  dtOptionsAutres: any = {};
  dtTriggerAutres: Subject<any> = new Subject();
  plaintesCounts: Plainte[]=[];
  plaintesTotale = 0;
  plaintesPrequalifier = 0;
  plaintesEnCours = '-';
  plaintesCloturees = 0;
  plaintesNonPrevu = '-';
  plaintesEnAttente = '-';
  
  @ViewChildren(DataTableDirective)
  dtElements: QueryList<DataTableDirective>;

  plaintes: Plainte[] = [];
  plainteGroupes: PlainteGroupe[] = [];
  plaintesAssociees: Plainte[]=[];
  plaintesSuivies: Plainte[]=[];

  searching = false;
  ready = false;
  

  constructor(
    private plainteService: PlainteService,
    private plainteGroupeService: PlainteGroupeService,
    private authService: AuthService,
    private agentService: AgentService,
    private router: Router
  ) {
    this.getAgent();
  }

  ngOnInit() { 
    let language = {
      processing: "Traitement en cours...",
      search: "Rechercher&nbsp;:",
      lengthMenu: "Afficher _MENU_ &eacute;l&eacute;ments",
      info: "Affichage des &eacute;lements _START_ &agrave; _END_ sur _TOTAL_ &eacute;l&eacute;ments",
      infoEmpty:
        "Affichage des &eacute;lements 0 &agrave; 0 sur 0 &eacute;l&eacute;ments",
      infoFiltered: "(filtr&eacute; de _MAX_ &eacute;l&eacute;ments au total)",
      infoPostFix: "",
      loadingRecords: "Chargement en cours...",
      zeroRecords: "Aucun &eacute;lement &agrave; afficher",
      emptyTable: "Aucun &eacute;lement disponible dans le tableau",
      paginate: {
        first: "Premier",
        previous: "Pr&eacute;c&eacute;dent",
        next: "Suivant",
        last: "Dernier",
      },
      aria: {
        sortAscending: ": activer pour trier la colonne par ordre croissant",
        sortDescending: ": activer pour trier la colonne par ordre décroissant",
      },
    };
    let buttonsA = [
      {
        extend: "copy",
        text: '<i class="material-icons">file_copy</i> Copier',
        titleAttr: "Copier",
      },
      {
        extend: "excel",
        text: '<i class="material-icons">save_alt</i> Excel',
        titleAttr: "Excel",
        filename: function () {
          return "Plaintes";
        },
      },
    ];
    this.dtOptions = {
      pagingType: "full_numbers",
      columnDefs: [
        {
          targets: [0], 
          type: 'date-us',
          render: function(data, type,row){
            if(type === 'sort'){
              const date = moment(data, 'DD/MM/YYYY HH:mm').format('YYYY-MM-DD HH:mm');
              return date;
            }
            return data;
          }
          
        }
      ],
      sorting: true,
      pageLength: 50,
      language: language,
      order: [[0, "desc"]],
      dom: "Bfrtip",
      // Configure the buttons
      buttons: buttonsA,
    };
    this.dtOptionsAutres = {
      pagingType: "full_numbers",
      columnDefs: [
        {
          targets: [0], 
          type: 'date-us',
          render: function(data, type,row){
            if(type === 'sort'){
              const date = moment(data, 'DD/MM/YYYY HH:mm').format('YYYY-MM-DD HH:mm');
              return date;
            }
            return data;
          }
          
        }
      ],
      sorting: true,
      pageLength: 50,
      language: language,
      order: [[0, "desc"]],
      dom: "Bfrtip",
      // Configure the buttons
      buttons: buttonsA,
    };
   
  }

  getAgent(){
    this.agentService.getAgentByJambarsId(this.authService.getCurrentAccount().id)
    .subscribe(
      (resp:any)=> {
        this.agent = resp[0];
        if (this.agent.groupeId)
          this.getPlainteGroupe(this.agent.groupeId);
      }
    )
  }
  getPlainteGroupe(groupeId){
    this.searching = true;
    this.plainteGroupeService.getPlainteGroupesByGroup(groupeId).subscribe(res=>{
      this.plainteGroupes = res;
      this.plaintesTotale = res.length
      this.plaintesPrequalifier = res.filter((groupePlainte) => groupePlainte.statut.statut === 'NON PRIS EN CHARGE').length;
      this.plaintesCloturees = res.filter((groupePlainte) => groupePlainte.statut.statut === 'TRAITE').length;
      
      this.dtTrigger.next();
      this.dtTriggerAutres.next();
      this.ready = true;
      this.searching = false;
    })
  }
  
  goToPlainteDetails(plainteId: string): void {
    this.router.navigate(["qosUniverse/plainte", plainteId]);
  }

 
}
