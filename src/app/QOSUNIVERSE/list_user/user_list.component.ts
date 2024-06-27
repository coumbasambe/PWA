import {
  Component,
  Input,
  OnInit,
  QueryList,
  ViewChildren,
} from "@angular/core";
import { Router } from "@angular/router";
// import { DataTableDirective } from "angular-datatables";
import { Subject } from "rxjs";
import { PlainteService } from "../services/plainte.service";
import { Plainte } from "../models/plainte";
import { AuthService } from "src/app/pages/auth/auth.service";
import { AgentService } from "../services/agent.service";
import { Agent } from "../models/agent";
import * as moment from "moment";

declare const $: any;

@Component({
  selector: "app-user_list",
  templateUrl: "user_list.component.html",
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
export class UserListComponent implements OnInit {
  dtOptions: any = {};
  dtTrigger: Subject<any> = new Subject();
  dtOptionsAutre: any = {};
  dtTriggerAutre: Subject<any> = new Subject();

  plaintesCounts: Plainte[]=[];

  plaintesTotale;
  plaintesPrequalifier;
  plaintesEnCours;
  plaintesCloturees;
  plaintesNonPrevu;
  plaintesEnAttente;
  plaintesTraiter;
  
  // @ViewChildren(DataTableDirective)
  // dtElements: QueryList<DataTableDirective>;

  plaintes: Plainte[] = [];
  plaintesGroupe: Plainte[] = [];
  userId;
  agent: Agent = {};

  searching = false;
  ready = false;
  currentUserGroup;

  constructor(
    private plainteService: PlainteService,
    private authService: AuthService,
    private agentService: AgentService,
    private router: Router
  ) {
    this.userId = this.authService.getCurrentAccount().id;
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
    this.dtOptionsAutre = {
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
        if (this.agent){
          this.currentUserGroup = this.agent.groupe;
          this.getPlaintesWithGroup(this.currentUserGroup)
        } else {
          this.getPlaintes();
        }      
      }
    )
  }

  getPlaintesWithGroup(groupe){
    this.searching = true;
    this.plainteService.getGroupPlaintes(groupe.id).subscribe((res) => {
          this.plaintes = res.filter((plainte) => plainte.expediteurId === this.authService.getCurrentAccount().id);
          this.plaintesGroupe = res;
          this.plaintesTotale = res.length
          this.plaintesEnCours = res.filter((plainte) => plainte.statut.statut === 'EN COURS' || plainte.statut.statut === 'TRANSFERE' ).length;
          this.plaintesCloturees = res.filter((plainte) => plainte.statut.statut === 'FERME').length;
          this.plaintesPrequalifier = res.filter((plainte) => plainte.statut.statut === 'NON PRIS EN CHARGE').length;
          this.plaintesNonPrevu = res.filter((plainte) => plainte.statut.statut === 'NON PREVU').length;
          this.plaintesEnAttente = res.filter((plainte) => plainte.statut.statut === 'EN ATTENTE').length;
          this.plaintesTraiter = res.filter((plainte) => plainte.statut.statut === 'TRAITE').length;

          this.dtTriggerAutre.next(null);
          this.dtTrigger.next(null);
          this.ready = true;
          this.searching = false;
          this.reinitializePlainteDataTable()
        },
        (error) => {
          this.searching = false;
        }
      ),
      (error) => {
        console.error(error);
      };
  }
  getPlaintes() {
    this.searching = true;
    this.plainteService.getUserPlaintes(this.userId).subscribe((res) => {
          this.plaintes = res;
          this.plaintesTotale = res.length
          this.plaintesEnCours = res.filter((plainte) => plainte.statut.statut === 'EN COURS' || plainte.statut.statut === 'TRANSFERE' ).length;
          this.plaintesCloturees = res.filter((plainte) => plainte.statut.statut === 'FERME').length;
          this.plaintesPrequalifier = res.filter((plainte) => plainte.statut.statut === 'NON PRIS EN CHARGE').length;
          this.plaintesNonPrevu = res.filter((plainte) => plainte.statut.statut === 'NON PREVU').length;
          this.plaintesEnAttente = res.filter((plainte) => plainte.statut.statut === 'EN ATTENTE').length;
          this.dtTrigger.next(null);
          this.ready = true;
          this.searching = false;
          this.reinitializeMesPlainteDataTable()
        },
        (error) => {
          this.searching = false;
        }
      ),
      (error) => {
        console.error(error);
      };
  }

  goToPlainteDetails(plainteId: string): void {
    this.router.navigate(["qosUniverse/plainte", plainteId]);
  }

  private reinitializeMesPlainteDataTable(): void {
    // Destroy existing DataTable instance
    const table = $('#mesPlaintes-table').DataTable();
    if (table) {
      table.clear().destroy();
    }
    // Reinitialize DataTable after a short delay to ensure Angular has updated the view
    setTimeout(() => {
      $('#mesPlaintes-table').DataTable(this.dtOptions);
    }, 100);
  }
  private reinitializePlainteDataTable(): void {
    // Destroy existing DataTable instance
    const table = $('plaintes-table').DataTable();
    if (table) {
      table.clear().destroy();
    }
    // Reinitialize DataTable after a short delay to ensure Angular has updated the view
    setTimeout(() => {
      $('#plaintes-table').DataTable(this.dtOptions);
    }, 100);
  }
 
}
