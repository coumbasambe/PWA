import {
  Component,
  ViewChild,
  OnInit,
  QueryList,
  ViewChildren,
  Input,
} from "@angular/core";
import { Router } from "@angular/router";
import { Subject } from "rxjs";
import { PlainteService } from "../services/plainte.service";
import { Plainte } from "../models/plainte";
import { AuthService } from "src/app/pages/auth/auth.service";
// import * as io from 'socket.io-client';
import { NotificationService } from "src/app/shared/services/notifications";
import { AgentService } from "../services/agent.service";
import { BaseService } from "src/app/shared/base.service";
import { MessageService } from "../services/message.service";
import { EmailService } from "../services/email.service";
import { takeUntil } from "rxjs/operators";
import * as moment from "moment";
import { qosUniverseService } from "src/app/shared/qosUniverseService";
declare const $: any;

@Component({
  selector: "app-admin_list",
  templateUrl: "admin_list.component.html",
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
      .read {
        font-weight: bold;
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
export class AdminListComponent implements OnInit {
  dtOptions: any = {};
  dtTrigger: Subject<any> = new Subject();

  dtOptionsAutres: any = {};
  dtOptionsSU: any = {};
  dtTriggerAutres: Subject<any> = new Subject();
  plaintesSuivies: Plainte[] = [];
  plaintesBacklog: Plainte[] = [];
  plaintesTotale;
  plaintesPrequalifier;
  plaintesQualifier: Plainte[] = [];
  plaintesEnCours;
  plaintesCloturees;
  plaintesNonPrevu;
  plaintesEnAttente;
  plaintesTraiter;

  // @ViewChildren(DataTableDirective)
  // dtElements: QueryList<DataTableDirective>;
  private unsubscribe$ = new Subject<void>();

  plaintes: Plainte[] = [];
  selectedPlaintes: Plainte[] = [];
  agents: any[];

  searchingKpi = false;
  readyKpi = false;

  searching = false;
  ready = false;
  private socket: any;
  profil: string = "SU";
  plainteToDelete: Plainte;
  superAdminProfil = false;
  @ViewChild('formPeriode') formPeriode: any;
  periodeForm: any = {};
  plainteKpi: any = {};
  plaintesOuvert: Plainte[] = [];
  plaintesNonQualifier: Plainte[];

  constructor(
    private plainteService: PlainteService,
    private authService: AuthService,
    private agentService: AgentService,
    private baseService: BaseService,
    private messageService: MessageService,
    private emailService: EmailService,
    private router: Router,
    private notificationService: NotificationService
  ) {
    this.superAdminProfil = this.authService.accountHasRole(['ROLE_ADMIN', 'ROLE_QOS_SS_ADMIN'])
    this.profil = this.authService.accountHasRole(['ROLE_ADMIN', 'ROLE_QOS_GP_ADMIN']) ? 'ADMIN' :
      this.authService.accountHasRole(['ROLE_QOS_GP_GROUPE']) ? 'GROUP' : 'SU';
    // this.socket = io('https://apis.jambars.orange-sonatel.com');
    // this.socket.on('message', (data) => {
    //   this.notificationService.showNotification(
    //     "top",
    //     "right",
    //     "success",
    //     "Nouvelle plainte reçue",
    //     "Expéditeur: " + data.expediteur + " <br/>Objet: " + data.objet)
    //   this.getNewPlainte(data.id)

    // });

  }

  ngOnInit() {
      this.getGPCAgents();
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
    let buttonsATLP = [
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
      {
        text: '<i class="material-icons">save_alt</i> Toutes les Plaintes',
        titleAttr: "Toutes les Plaintes",
        action: function () {
          console.log('click')
          const qosUniverse = new qosUniverseService();
          qosUniverse.extractPlaintesFile('extract-plaintes-file')
          // window.open("http://127.0.0.1:3007/download/extract-plaintes-file");
        },
      },
    ];
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
          render: function (data, type, row) {
            if (type === 'sort') {
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
    this.dtOptionsSU = {
      pagingType: "full_numbers",
      columnDefs: [
        {
          targets: [this.superAdminProfil ? 1 : 0],
          type: 'date-us',
          render: function (data, type, row) {
            if (type === 'sort') {
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
      order: [[this.superAdminProfil ? 1 : 0, "desc"]],
      dom: "Bfrtip",
      // Configure the buttons
      buttons: buttonsATLP,
    };
    this.dtOptionsAutres = {
      pagingType: "full_numbers",
      columnDefs: [
        {
          targets: [1],
          type: 'date-us',
          render: function (data, type, row) {
            if (type === 'sort') {
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
      order: [[1, "desc"]],
      dom: "Bfrtip",
      // Configure the buttons
      buttons: buttonsA,
    };
    // this.searchingKpi = true;
    Promise.all([
      this.searchingKpi = true,
      this.getPlainteKpi(),
      new Promise(resolve => this.getPlaintesSuivies(resolve)),
      new Promise(resolve => this.getPlaintesBacklog(resolve)),
      new Promise(resolve => this.getPlaintesNonQualifier(resolve))
    ]).then(()=>{
          this.readyKpi = true;
          this.searchingKpi = false;
          // this.dtTrigger.next()
          // this.dtTriggerAutres.next()
    }).catch(error=>{
      this.searchingKpi = false;
      console.log(error)
    })
  }

  private reinitializeDataTable(id:string): void {
    // Destroy existing DataTable instance
    const table = $('#'+id).DataTable();
    if (table) {
      table.clear().destroy();
    }
    // Reinitialize DataTable after a short delay to ensure Angular has updated the view
    setTimeout(() => {
      $('#'+id).DataTable(this.dtOptions);
    }, 100);
  }
  private reinitializeNPECDataTable(): void {
    // Destroy existing DataTable instance
    const table = $('#npecAdmin-table').DataTable();
    if (table) {
      table.clear().destroy();
    }
    // Reinitialize DataTable after a short delay to ensure Angular has updated the view
    setTimeout(() => {
      $('#npecAdmin-table').DataTable(this.dtOptionsSU);
    }, 100);
  }
  private reinitializeSUDataTable(): void {
    // Destroy existing DataTable instance
    const table = $('#tlpAdmin-table').DataTable();
    if (table) {
      table.clear().destroy();
    }
    // Reinitialize DataTable after a short delay to ensure Angular has updated the view
    setTimeout(() => {
      $('#tlpAdmin-table').DataTable(this.dtOptionsSU);
    }, 100);
  }

  getNewPlainte(id) {
    this.plainteService.getOnePlainte(id).subscribe(
      plainte => {
        if (this.plaintes && this.plaintes.length > 0) this.plaintes.push(plainte)
        this.plaintesNonQualifier.push(plainte)
        this.plainteKpi.plaintesTotale++;
        this.plainteKpi.plaintesPrequalifier++;
        this.rerender();
        // this.dtTrigger.next();
        // this.dtTriggerAutres.next();
        // this.filterPlaintes();
      }
    )
  }

  async getPlainteKpi() {
    return this.plainteService.getPlainteKpi().pipe(takeUntil(this.unsubscribe$))
      .subscribe(
        (data) => {
          this.plainteKpi = data;
          return data
        },
        (error) => {
          console.log(error);
        }
      );
  }

  async getPlaintesSuivies(cb) {
    return this.plainteService.getPlaintesSuiviesByGpcId(this.authService.getCurrentAccount().id)
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe(res => {
        this.plaintesSuivies = res;
        this.reinitializeDataTable('suiviesAdmin-table')
        return cb(1);
      });
  }

  async getPlaintesBacklog(cb) {
    return this.plainteService.getPlaintesBacklogByUserId(this.authService.getCurrentAccount().id)
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe(res => {
        this.plaintesBacklog = res;
        this.reinitializeDataTable('monbacklog-table')
        return cb(1)
      })
  }

  async getPlaintesNonQualifier(cb) {
    return this.plainteService.getPlaintesNonQualifier().pipe(takeUntil(this.unsubscribe$))
      .subscribe(res => {
        this.plaintesNonQualifier = res;
        this.reinitializeNPECDataTable()
        return cb(1)
      })
  }

  filterPlaintes() {
    this.plainteKpi.plaintesTotale = this.plaintes.length
    this.plainteKpi.plaintesEnCours = this.plaintes.filter((plainte) => plainte.statut.statut === 'EN COURS' || plainte.statut.statut === 'TRANSFERE' || plainte.statut.statut === 'REJETE').length;
    this.plainteKpi.plaintesCloturees = this.plaintes.filter((plainte) => plainte.statut.statut === 'FERME').length;
    this.plainteKpi.plaintesPrequalifier = this.plaintes.filter((plainte) => plainte.statut.statut === 'NON PRIS EN CHARGE').length;
    this.plainteKpi.plaintesQualifier = this.plaintes.filter((plainte) => plainte.statut.statut != 'NON PRIS EN CHARGE').length;
    this.plainteKpi.plaintesNonPrevu = this.plaintes.filter((plainte) => plainte.statut.statut === 'NON PREVU').length;
    this.plainteKpi.plaintesEnAttente = this.plaintes.filter((plainte) => plainte.statut.statut === 'EN ATTENTE').length;
    this.plainteKpi.plaintesTraiter = this.plaintes.filter((plainte) => plainte.statut.statut === 'TRAITE' || plainte.statut.statut === 'NON PREVU').length;
    this.plaintesNonQualifier =  this.plaintes.filter((plainte) => plainte.statut.statut === 'NON PRIS EN CHARGE');
    this.plainteKpi.plaintesPrequalifier = (this.plaintesNonQualifier.length || 0);
    this.plaintesSuivies = this.plaintes.filter((plainte) => plainte.gpcId === this.authService.getCurrentAccount().id && plainte.statut.statut != 'FERME');
    this.plaintesBacklog = this.plaintes.filter((plainte) => plainte.affecterA === this.authService.getCurrentAccount().id && plainte.statut.statut === 'NON PRIS EN CHARGE');
    // this.dtTrigger.next();
    // this.dtTriggerAutres.next();
    this.reinitializeDataTable('ouvertAdmin-table')
  }

  resetForm() {
    this.formPeriode.resetForm();
    this.ready = false;
    this.plaintes = [];
    this.rerender();

    Promise.all([
      this.searchingKpi = true,
      this.getPlainteKpi(),
      new Promise(resolve => this.getPlaintesSuivies(resolve)),
      new Promise(resolve => this.getPlaintesBacklog(resolve)),
      new Promise(resolve => this.getPlaintesNonQualifier(resolve))
    ]).then(()=>{
          this.readyKpi = true;
          this.searchingKpi = false;
          // this.dtTrigger.next()
          // this.dtTriggerAutres.next()
    }).catch(error=>{
      this.searchingKpi = false;
      console.log(error)
    })
    // this.getPlaintes();
  }

  onPeriodeChosed() {
    this.searching = true;
    this.ready = false;
    this.searchingKpi = true,
    this.readyKpi = false;
    // this.plaintes = [];
    this.rerender();
    this.plainteService.getPlaintesPeriode(this.periodeForm.dateDebut, this.periodeForm.dateFin)
      .subscribe(res => {
        this.plaintes = res;
        this.ready = true;
        this.searching = false;
        this.readyKpi = true;
        this.searchingKpi = false;
        this.filterPlaintes();
      },
        (error) => {
          this.searching = false;
          console.error(error);
        }
      )
  }

  getPlaintes() {
    if (!this.searching && (!this.plaintes || this.plaintes.length === 0)) {
      this.rerender()
      this.searching = true;
      this.plainteService.getPlaintes().subscribe((res) => {
        this.plaintes = res;
        this.filterPlaintes();
        this.ready = true;
        this.searching = false;
        this.reinitializeSUDataTable()
      },
        (error) => {
          this.searching = false;
          console.error(error);
        });
    }

  }
  getJambarsUserById(id, cb) {
    this.baseService.get('/Accounts?filter={"where":{"id":"' + id + '"}}', true)
      .subscribe(
        res => {
          return cb(res[0]);
        },
        err => {
          return cb(null)
        }
      )
  }

  getGPCAgents() {
    this.agentService.getGroupeByName('GPADMIN').subscribe(
      res => {
        if (res && res[0].id) {
          this.agentService.getAgentByGroupe(res[0].id)
            .subscribe(
              (resp: any) => {
                this.agents = resp;
                this.agents.forEach(ag => {
                  this.getJambarsUserById(ag.jambarsId, res => {
                    ag.jambarsInfos = res;
                  })
                });
              }
            )
        }
      }
    )
  }

  goToPlainteDetails(plainteId: string): void {
    this.router.navigate(["qosUniverse/plainte", plainteId]);
  }
  reloadCurrentRoute(): void {
    const currentUrl = this.router.url;
    this.router.navigateByUrl("/", { skipLocationChange: true }).then(() => {
      this.router.navigate([currentUrl]);
    });
  }
  rerender(): void {
    // if (this.dtElements) {
    //   this.dtElements.forEach((dtElement: DataTableDirective) => {
    //     if (dtElement && dtElement.dtInstance)
    //       dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
    //         dtInstance.destroy();
    //       });
    //   });
    // }

  }

  selectedPlainte(plainte: Plainte): void {
    if (this.isSelected(plainte)) {
      this.selectedPlaintes = this.selectedPlaintes.filter(
        (p) => p.id !== plainte.id
      );
    } else {
      this.selectedPlaintes.push(plainte);
    }
  }

  isSelected(plainte: Plainte): boolean {
    return this.selectedPlaintes.some((p) => p.id === plainte.id);
  }
  dispatcherPlaintes(agent) {
    this.selectedPlaintes.forEach(p => {
      console.log(p)
      this.dispatcherPlainte(agent, p);
    });
    this.reloadCurrentRoute();
  }
  dispatcherPlainte(agent, plainte) {
    let data = {
      affecterA: agent.jambarsInfos.id,
      porteur: agent.jambarsInfos.prenom + ' ' + agent.jambarsInfos.nom,
      affecterPar: this.authService.getDe(),
      lu: true,
    }
    let message = {
      plainteId: plainte.id,
      message: 'Plainte affectée à ' + agent.jambarsInfos.prenom + ' ' + agent.jambarsInfos.nom + ' ' + (agent.jambarsInfos.email) + ' par '
        + this.authService.getCurrentAccount().prenom + ' ' + this.authService.getCurrentAccount().nom,
      de: 'SYS',
      date: new Date(),
      type: 'SYSTEM'
    }
    this.plainteService.patchPlainte(plainte.id, data).subscribe(res => { })
    this.messageService.postMessage(message).subscribe(res => {
      let emailData = {
        title: 'Affectation d\'une plainte',
        to: agent.jambarsInfos.email,
        cc: agent.groupe.email,
        body: 'Une nouvelle plainte "' + plainte.objet + '" vous a été affectéé par ' + this.authService.getDe() + ' dans QOS UNIVERSE.',
      }
      this.emailService.postEmails(emailData).subscribe(res => {
      })
    })
  }

  setIdPlainteToDelete(plainte) {
    this.plainteToDelete = plainte;
  }

  deletedPlainte() {
    this.plainteService.deletePlainte(this.plainteToDelete.id).subscribe(res => {
      this.reloadCurrentRoute();
    },
      err => { console.log(err) })
  }
}
