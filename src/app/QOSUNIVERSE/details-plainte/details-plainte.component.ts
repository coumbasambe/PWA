import { OnDestroy } from '@angular/core';
//import { Statut } from './../statut/statut.component';
declare var require: any;
import {
  Component,
  Input,
  OnInit,
  Output,
  EventEmitter,
} from "@angular/core";
import { trigger, state, style, transition, animate, keyframes } from '@angular/animations';
import { ActivatedRoute } from "@angular/router";
// import { DataTableDirective } from "angular-datatables";
import mapboxgl from "mapbox-gl";
import { Router } from "@angular/router";
import { Subject } from "rxjs";
import { PlainteService } from "../services/plainte.service";
import { DetailPlainteService } from "../services/detail-plaintes.service";
import { DomaineService } from "../services/domaine.service";
import { TypeService } from "../services/type.service";
import { takeUntil } from "rxjs/operators";
import { Plainte } from "../models/plainte";
import { Localisation } from "../models/localisation";
import { RetourClient } from "../models/retourClient";
import { TypologieService } from "../services/typologies.service";
import MapboxGeocoder from '@mapbox/mapbox-gl-geocoder';
import { NotificationService } from "src/app/shared/services/notifications";
import { AgentService } from "../services/agent.service";
import { Domaine } from "../models/domaine";
import { SousDomaine } from "../models/sousDomaine";
import { File } from "../models/file";
import { FileService } from "../services/file.service";
import { FormGroup } from "@angular/forms";
import { Message } from "../models/message";
import { MessageService } from "../services/message.service";
import { AuthService } from "src/app/pages/auth/auth.service";
import { EmailService } from "../services/email.service";
import { Email } from "../models/email";
import { Groupe } from "../models/groupe";
import { Agent } from "../models/agent";
import { Champs } from "../models/champs";
import { DomaineChamps } from "../models/domaineChamps";
import { ConsultedPlainte } from "../models/consultedPlainte";
import { Statut } from "../models/statut";
import { PlainteGroupeService } from "../services/plainte-groupe.service";
import { BaseService } from 'src/app/shared/base.service';
import { Account } from '../models/account';
import { Role } from '../models/role';
import { Priorite } from '../models/priorite';
import { Type } from '../models/type';
import { Origine } from '../models/origine';
import { Typologie } from '../models/typologie';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { ChampsDomainesService } from '../services/champs-domaines.service';
import { Commune } from '../models/commune';
import { Departement } from '../models/departement';
import { RegionService } from '../services/region.service';
import { Region } from '../models/region';
import { DepartementService } from '../services/departement.service';
import { CommuneService } from '../services/commune.service';
import { QuartierService } from '../services/quartier.service';
import { Quartier } from '../models/quartier';
import { Complexite } from '../models/complexite';
import { ComplexiteService } from '../services/complexite.service';


// eslint-disable-next-line import/no-webpack-loader-syntax, import/no-unresolved
mapboxgl.workerClass = require("worker-loader!mapbox-gl/dist/mapbox-gl-csp-worker").default;

@Component({
  selector: "app-details-plainte",
  templateUrl: "details-plainte.component.html",
  styles: [
    `
      .styled-textarea {
        resize: none;
        overflow: auto;
        height: auto;
        min-height: 50%;
        max-height: 100%;
        width: 90%;
        padding: 1em;
        border: 5px solid orange;
        border-radius: 10px;
        box-shadow: 0px 3px 15px rgba(0, 0, 0, 0.2);
        transition: box-shadow 0.3s ease, border-color 0.3s ease;
        
      }
    
      .bt{
        border: 0px;
      }
      .modif{
        text-align: center; 
        font-weight: 100;
        text-decoration: underline orange;
      }

      .styled-textarea:focus {
        outline: none;
        border-color: darkorange;
        box-shadow: 0px 5px 20px rgba(0, 0, 0, 0.3);
      }

      .styled-textarea::placeholder {
        color: #aaa;
      }
      .box{
        background: #DCDCDC;
      }
      .styled-textarea:disabled,
      .styled-textarea[readonly] {
        background: #e9ecef;
        cursor: not-allowed;
        border-color: #aaa;
      }
      .material-symbols-outlined{
        color: white;
      }
      .white{
        background-color: white;
      }
      .span-card{
        margin-left:50px;
        color: black;
      }
      #map {
          position: relative;
          z-index: 2;
          width: 100%;
          height: calc(45vh - 70px);
          margin-top: 10px;
      }
      .alerte{
        font-size: 30px;

      }
      
    `,
  ],
  animations: [
    trigger('textAnimation', [
      state('show', style({ opacity: 1 })),
      transition('void => *', [
        style({ opacity: 0 }),
        animate('1000ms', keyframes([
          style({ opacity: 0, offset: 0 }),
          style({ opacity: 1, offset: 1.0 })
        ]))
      ])
    ])
  ]
})
export class DetailsPlainteComponent implements OnInit {
  dropdownSettings = {};

  selectedRegion: any;
  domaineChamp: DomaineChamps = {};
  domaineChamps: DomaineChamps[] = [];
  alerte: boolean = false;
  afficher: boolean = false;
  champs: Champs[] = [];

  champ: any;
  selectedUser: any;
  emails: any;
  plainte: any = {};
  retourClient: RetourClient = {};
  editRetour: RetourClient = {};
  newPlainte: Plainte = {};
  currentPlainte: Plainte = {};
  currentLocalisation: any = {};
  localisation: Localisation = {};
  statusCheck: any = {};
  localisations: Localisation[] = [];
  domaineChoisi: any = {};
  isCollapsed: boolean = true;
  map: mapboxgl.Map;
  style = 'mapbox://styles/mapbox/streets-v11';
  latitude = 14.688987;
  longitude = -15.099607;
  priorite: Priorite = {};
  type: Type = {};
  origine: Origine = {};
  domaine: Domaine = {};
  sousDomaine: SousDomaine = {};
  typologie: Typologie = {};
  selectedSousDomaine: SousDomaine = {};
  groupePorteurSelected: any;

  listComplexites: Complexite[] = [];
  currentRetourClient: RetourClient = {};
  retourClients: RetourClient[] = [];
  sendGroupes: Agent[] = [];
  sendAgent: Agent;
  jambarsAgent: Account = {};
  accountId: string;
  messag: any;
  email: Email = {};
  files: File[] = [];
  currentDomaine: Domaine = {};
  currentDomaineChamps: any;

  domaines: any[] = [];
  domaineName: Domaine = {};
  sousDomaineChoose: SousDomaine = {};
  selectedDomaine: Domaine = {};

  //FILES
  filesEnd: File[] = [];
  plainteFiles: File;
  errors: Array<string> = [];
  success: Array<string> = [];

  // Les listes d'options pour les sélecteurs
  accounts: Account[] = [];
  roles: Role[] = [];
  adminId: string;
  messages: Message[] = [];
  message: Message = {};
  editMessage: Message = {};
  currentGroupe: Groupe = {};
  origines: any[] = [];
  plainteId;
  statuts: any[] = [];
  statutsFilter: Statut[] = [];
  selectedStatut: Statut = {};
  consultedPlainte: ConsultedPlainte = {};
  user: any[] = [{ nom: '', prenom: '' }]
  sousDomaines: any[] = [];
  typologiesByIdSD: any[] = [];
  priorites: any[] = [];
  types: any[] = [];
  typologies: any[] = [];
  agents: any[] = [];
  groupes: any[] = [];
  groupeUsers: any[] = [];
  jambarsAgents: any[] = [];
  plainteToSolder;
  dtOptions: any = {};
  dtTrigger: Subject<any> = new Subject();
  // @ViewChildren(DataTableDirective)
  // dtElements: QueryList<DataTableDirective>;
  dragAreaClass: string = "dragarea";
  //files;
  searching = false;
  ready = false;
  today = new Date();
  @Input() projectId: number = 0;
  @Input() sectionId: number = 0;
  @Input() fileExt: string = "XLSX, XLS, PDF, TXT,PNG, JPG, JPEG, DOCX, PPTX, DOC";
  @Input() maxFiles: number = 10;
  @Input() maxSize: number = 150; // 5MB
  @Output() uploadStatus = new EventEmitter();
  itemFormValidations: FormGroup;
  isPlaintePorteur = false;
  profil = "SU";
  agent: Agent;
  text = "Bonjour, Je suis XamXamAI ou 2XAI.\n \
  Je suis l'IA en conception qui vous aidera à mieux traiter les plaintes.\n \
  Je me connecterai à plusieurs sources de données pour vous permettre une analyse factuelle et rapide.";
  animatedText = '';
  textState: string = 'show';
  champsFilterDomaines: any[];
  listCommunes: Commune[];
  listDepartements: Departement[];
  listRegions: Region[];
  departements: Departement[];
  communes: Commune[] = [];
  selectedCommune: Commune = {};
  quartier: Quartier = {};
  quartiers: Quartier[] = [];
  listQuartiers: Quartier[] = [];
  listGroupes: any[];
  sites: any[];
  toDay = new Date();
  constructor(
    private plainteService: PlainteService,
    private notificationService: NotificationService,
    private route: ActivatedRoute,
    private detailPlainteService: DetailPlainteService,
    private typologieService: TypologieService,
    private domaineService: DomaineService,
    private champDomService: ChampsDomainesService,
    private groureService: AgentService,
    private regionService: RegionService,
    private departementService: DepartementService,
    private communeService: CommuneService,
    private typeService: TypeService,
    private messageService: MessageService,
    private plainteGroupeService: PlainteGroupeService,
    private agentService: AgentService,
    public fileService: FileService,
    private router: Router,
    private emailService: EmailService,
    private authService: AuthService,
    private baseService: BaseService,
    private sanitizer: DomSanitizer,
    private quartierService: QuartierService,
    private complexiteService: ComplexiteService,
  ) {
    this.plainteId = this.route.snapshot.paramMap.get('id');
    this.accountId = this.authService.getCurrentAccount().id;
    this.profil = this.authService.accountHasRole(['ROLE_ADMIN', 'ROLE_QOS_GP_ADMIN']) ? 'ADMIN' :
      this.authService.accountHasRole(['ROLE_QOS_GP_GROUPE']) ? 'GROUP' : 'SU';
  }

  ngOnInit() {
    this.getDomaines();
    this.getPlainte();
    this.getGroupes();
    this.showMap();
    this.getFilesByPlainteId(this.plainteId);
    this.getStatutsFilter();
    this.animateText();
    this.getDp();
    this.getAllCommunes();
    this.getAllQuartiers()
    this.getComplexites()
    this.getSites()
    this.dropdownSettings = {
      singleSelection: true,
      idField: "nomSite",
      textField: "nomSite",
      limitSelection: 1,
      closeDropDownOnSelection: true,
      noDataAvailablePlaceholderText: "Chargement ...",
      // selectAllText: "Séléctionner tout",
      // unSelectAllText: "Tout désélectionner",
      itemsShowLimit: 1,
      allowSearchFilter: true,
    };

    // let language = {
    //   processing: "Traitement en cours...",
    //   search: "Rechercher&nbsp;:",
    //   lengthMenu: "Afficher _MENU_ &eacute;l&eacute;ments",
    //   info: "Affichage des &eacute;lements _START_ &agrave; _END_ sur _TOTAL_ &eacute;l&eacute;ments",
    //   infoEmpty:
    //     "Affichage des &eacute;lements 0 &agrave; 0 sur 0 &eacute;l&eacute;ments",
    //   infoFiltered: "(filtr&eacute; de _MAX_ &eacute;l&eacute;ments au total)",
    //   infoPostFix: "",
    //   loadingRecords: "Chargement en cours...",
    //   zeroRecords: "Aucun &eacute;lement &agrave; afficher",
    //   emptyTable: "Aucun &eacute;lement disponible dans le tableau",
    //   paginate: {
    //     first: "Premier",
    //     previous: "Pr&eacute;c&eacute;dent",
    //     next: "Suivant",
    //     last: "Dernier",
    //   },
    //   aria: {
    //     sortAscending: ": activer pour trier la colonne par ordre croissant",
    //     sortDescending: ": activer pour trier la colonne par ordre décroissant",
    //   },
    // };
    // let buttonsA = [
    //   {
    //     extend: "copy",
    //     text: '<i class="material-icons">file_copy</i> Copier',
    //     titleAttr: "Copier",
    //   },
    //   {
    //     extend: "excel",
    //     text: '<i class="material-icons">save_alt</i> Excel',
    //     titleAttr: "Excel",
    //     filename: function () {
    //       return "Couvertures " + this.localite.quartier_village;
    //     },
    //   },
    // ];

    // this.dtOptions = {
    //   pagingType: "full_numbers",
    //   pageLength: 50,
    //   order: [[0, "desc"]],
    //   language: language,
    //   dom: "Bfrtip",
    //   // Configure the buttons
    //   buttons: buttonsA,
    // };
    this.getOrigines();
    this.getPriorites();
    this.getStatuts();
    this.getSousDomaines();
    this.getTypes();
    this.getTypologies();
    this.getGPCAgents();
    this.getRegions();
  }


  modifierPlainte() {
    let data = {
      quartierId: this.plainte.quartierId,
      origineId: this.plainte.origineId,
      categorie: this.plainte.categorie,
      prioriteId: this.plainte.prioriteId,
      engagement: this.plainte.engagement,
      sousDomaineId: this.plainte.sousDomaineId,
      numeroClient: this.plainte.numeroClient,
      typeId: this.plainte.typeId,
      typologieId: this.plainte.typologieId,
      latitude: this.plainte.latitude,
      longitude: this.plainte.longitude,
      complexiteId: this.plainte.complexiteId,
      groupeAssocieId: this.plainte.groupeAssocieId,
      dateReactivation: this.plainte.dateReactivation,
      actions: this.plainte.actions,
      site: this.plainte.categorie === "RESEAU" ? this.plainte.site : undefined,
      cause: this.plainte.cause,
      groupePorteurId: this.plainte.groupePorteurId,
      delai: this.plainte.delai,
      retourClient:this.plainte.retourClient
    };
    this.plainteService.patchPlainte(this.plainte.id, data)
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe(
        (data) => {
          this.reloadCurrentRoute();
          this.notificationService.showNotification(
            "top",
            "right",
            "success",
            "Mise à jour",
            "Plainte modifier avec succés")
        },
        (error) => {
          console.log(error);
        }
      );;
  }

  getComplexites() {
    this.complexiteService.getComplexites().subscribe(res => {
      this.listComplexites = res;
    })
  }

  selectedSite(item) {
    this.plainte.site = item.nomSite;
  }

  deselectSite() {
    this.plainte.site = undefined;
  }
  getGPCAgents() {
    this.agentService.getGroupeByName('GPADMIN').subscribe(
      res => {
        if (res[0] && res[0].id) {
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
  animateText() {
    const characters = this.text.split('');
    let currentIndex = 0;

    const intervalId = setInterval(() => {
      if (currentIndex < characters.length) {
        this.animatedText += characters[currentIndex++];
      } else {
        clearInterval(intervalId);
      }
    }, 25);
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

  selectPlainte(plainte: any) {
    this.currentPlainte = { ...plainte };
    // if (plainte.domaineId) {
    //   this.selectedDomaine = plainte.domaine;
    //   this.getSousDomainesByDomaine(plainte.domaineId);
    // }
    if (plainte.sousDomaineId) {
      this.selectedSousDomaine = plainte.sousDomaineId;
    }
  }
  getDp() {
    this.departementService.getDepartements().subscribe((dep) => {
      this.departements = dep;
    })
  }
  getAllCommunes() {
    this.communeService.getCommunes().subscribe((com) => {
      this.communes = com;
    })
  }

  getAllQuartiers() {
    this.quartierService.getAllQuartier().subscribe(quartiers => {
      this.quartiers = quartiers;
      if (this.plainte.communeId) {
        this.getQuartiers(this.plainte.communeId);
      }

    })
  }

  getGroupePorteur() {
    return this.listGroupes.find(g => g.id === this.plainte.groupePorteurId);

  }

  getQuartiers(communeId) {
    this.listQuartiers = this.quartiers.filter(quar => quar.communeId === communeId);
  }

  getGroupes() {
    this.groureService
      .getGroupe()
      .subscribe((res) => {
        this.listGroupes = res;
        this.groupes = res.filter(g => g.nomGroupe != "GPADMIN" && g.type != 'USER');
        this.groupeUsers = res.filter(g => g.type == 'USER');
      })
  }
  dispatcherPlainte(agent) {
    let data = {
      affecterA: agent.jambarsInfos.id,
      porteur: agent.jambarsInfos.prenom + ' ' + agent.jambarsInfos.nom,
      affecterPar: this.authService.getDe(),
      lu: true,
    }
    let message = {
      plainteId: this.plainte.id,
      message: 'Plainte affectée à ' + agent.jambarsInfos.prenom + ' ' + agent.jambarsInfos.nom + ' ' + (agent.jambarsInfos.email) + ' par '
        + this.authService.getCurrentAccount().prenom + ' ' + this.authService.getCurrentAccount().nom,
      de: 'SYS',
      date: new Date(),
      type: 'SYSTEM'
    }

    this.plainteService.patchPlainte(this.plainteId, data).subscribe(res => { })
    this.messageService.postMessage(message).subscribe(res => {
      let emailData = {
        title: 'Affectation d\'une plainte',
        to: agent.jambarsInfos.email,
        cc: agent.groupe.email,
        body: 'Une nouvelle plainte "' + this.plainte.objet + '" vous a été affectéé par ' + this.authService.getDe() + ' dans QOS UNIVERSE.',
      }
      this.emailService.postEmails(emailData).subscribe(res => {
      })
      this.reloadCurrentRoute();

    })
  }
  // Ajoutez cette fonction à votre composant
  formatDate(date: Date): string {
    return date.toISOString();
  }
  onDomaineChange(domaineId: number): void {
    this.getSousDomainesByDomaine(domaineId);
  }
  getDomaineById(id) {
    this.domaineService
      .getOneDomaine(id)
      .subscribe((domaine) => {
        this.domaineName = domaine;
      })
    this.getChampsByDomaineId(id)
  }
  onSousDomaineChange(sousDomaineId: string): void {
    this.currentPlainte.sousDomaineId = sousDomaineId;
    const sousDomaine = this.sousDomaines.find((sd) => sd.id === sousDomaineId);
    if (sousDomaine && sousDomaine.domaineId) {
      this.getDomaine(sousDomaine.domaineId);
    }
  }
  getSousDomaineId(sousDomaine) {
    this.domaineService
      .getOneSousDomaine(sousDomaine)
      .subscribe((sd) => {
        this.sousDomaineChoose = sd;
      })
  }

  setSelectedCommune(communeId) {
    this.selectedCommune = this.communes.find(com => com.id === communeId)
  }

  upMessageCoordonnees() {
    let data = {
      latitude: this.plainte.latitude,
      longitude: this.plainte.longitude
    }
    this.plainteService
      .updatePlainte(this.plainte.id, data)
      .subscribe((res) => {
        this.reloadCurrentRoute()
      })
  }
  postMessage() {
    //this.message.agentId = "64de371a5e198d3114886cde";
    this.message.plainteId = this.plainte.id;
    this.message.date = new Date();
    this.message.type = 'USER';
    // agentId à mettre
    this.message.de = this.authService.getDe();
    this.messageService.postMessage(this.message).subscribe((data) => {
      this.reloadCurrentRoute();
    })

  }
  onEditMessage(message): void {
    this.editMessage = { ...message };
  }
  getCurrentGroupe(groupe) {
    this.currentGroupe = { ...groupe };
  }
  rejeterPlainte() {
    let jambarsInfo: any;
    this.plainteGroupeService.getActivePlainteGroupe().subscribe(res => {
      let data = {
        plainteId: this.plainte.id,
        date: new Date(),
        message: 'Plainte rejetée par ' + res[0].groupe.nomGroupe + ' (' + this.authService.getDe() + ')' +
          ' pour motif: ' + this.message.message,
        type: 'SYSTEM',
        de: 'SYS',
      }
      this.agentService.getGroupeByName(res[0].groupe.nomGroupe).subscribe(resp => {
        jambarsInfo = resp[0];
      })
      this.plainteGroupeService.deletePlainteGroupe(res[0].id).subscribe(res => { });
      this.plainteService.patchPlainte(this.plainte.id, { statutId: this.statuts.find((s) => s.statut === "REJETE").id, activeGroupe: '' }).subscribe(res => { })
      this.messageService.postMessage(data).subscribe((res) => {
        this.agentService.getAgentByJambarsId(this.plainte.gpcId).subscribe(res => {
          let emailData = {
            title: 'Plainte Rejetée',
            to: res[0].groupe.email,
            cc: jambarsInfo.email,
            body: 'La plainte "' + this.plainte.objet + '" a été rejetée par ' + jambarsInfo.nomGroupe + '(' + this.authService.getDe() + ')' +
              'avec comme motif: ' + this.message.message,
          }
          this.emailService.postEmails(emailData).subscribe(res => {
          })
          this.goBack();
        })
      })
    })

  }
  plainteTraiteeByGroup() {
    this.plainteGroupeService.getPlainteGroupes().subscribe(res => {
      let plainteGroupe = res.find((pg) => pg.plainteId === this.plainte.id && pg.isActive === true);
      let data = {
        plainteId: this.plainte.id,
        date: new Date(),
        message: 'Une plainte a été traitée par ' + plainteGroupe.groupe.nomGroupe + ' (' + this.authService.getDe() + '): ' + this.message.message,
        type: 'SYSTEM',
        de: 'SYS',
      }

      this.plainteGroupeService
        .patchPlainteGroupe(plainteGroupe.id, { isActive: false, statutId: this.statuts.find((s) => s.statut === "TRAITE").id })
        .subscribe(res => { });
      this.plainteService.patchPlainte(this.plainte.id, { statutId: this.statuts.find((s) => s.statut === "TRAITE").id }).subscribe(res => { })
      this.messageService.postMessage(data).subscribe((res) => {
        this.agentService.getAgentByJambarsId(this.plainte.gpcId).subscribe(res => {
          let emailData = {
            title: 'Plainte Traitée',
            to: res[0].groupe.email,
            cc: plainteGroupe.groupe.email,
            body: 'La plainte "' + this.plainte.objet + '" a été traitée par ' + plainteGroupe.groupe.nomGroupe + ' (' + this.authService.getDe() + '): ' + this.message.message,
          }
          this.emailService.postEmails(emailData).subscribe(res => {
          })
          this.goBack();
        })
      })
    })

  }
  transfererPlainte() {
    let data = {
      plainteId: this.plainte.id,
      date: new Date(),
      message: 'Plainte transférée au groupe ' + this.currentGroupe.nomGroupe +
        ' par ' + this.authService.getDe() + ': ' + this.message.message,
      type: 'SYSTEM',
      de: 'SYS',
    }
    let plainteGroupe = {
      isActive: true,
      date: new Date(),
      plainteId: this.plainte.id,
      statutId: this.statuts.find((s) => s.statut === "NON PRIS EN CHARGE").id,
      groupeId: this.currentGroupe.id
    }
    this.plainteService.patchPlainte(this.plainte.id, { statutId: this.statuts.find((s) => s.statut === "TRANSFERE").id, activeGroupe: this.currentGroupe.nomGroupe })
      .subscribe(res => { })
    this.plainteGroupeService.postPlainteGroupe(plainteGroupe).subscribe(res => { });
    this.messageService.postMessage(data).subscribe((res) => {
      let emailData = {
        title: 'Transfére d\'une plainte',
        to: this.currentGroupe.email,
        cc: this.authService.getCurrentAccount().email,
        body: 'Une nouvelle plainte "' + this.plainte.objet + '" vous a été transférée par ' + this.authService.getDe() + '. Avec le message: ' + this.message.message,
      }

      this.emailService.postEmails(emailData).subscribe(res => {
      })
      this.reloadCurrentRoute();
    })
  }
  recuperPlainte() {
    this.plainteGroupeService.getPlainteGroupes().subscribe(res => {
      let plainteGroupe = res.find((pg) => pg.plainteId === this.plainte.id && pg.isActive === true);
      let data = {
        plainteId: this.plainte.id,
        date: new Date(),
        message: 'Plainte récupérée par ' + this.authService.getDe() + ' ' + this.message.message,
        type: 'SYSTEM',
        de: 'SYS',
      }

      this.plainteService.patchPlainte(this.plainte.id, { statutId: this.statuts.find((s) => s.statut === "EN COURS").id, activeGroupe: '' })
        .subscribe(res => { })
      this.messageService.postMessage(data).subscribe((res) => {
        this.plainteGroupeService.deletePlainteGroupe(plainteGroupe.id).subscribe(res => { });
        let emailData = {
          title: 'Plainte Récupérée',
          to: plainteGroupe.groupe.email,
          cc: null,
          body: 'La plainte "' + this.plainte.objet + '" qui vous a été transférée vient d\'être récupérée par ' + this.authService.getDe(),
        }

        this.emailService.postEmails(emailData).subscribe(res => {
        })
        this.reloadCurrentRoute();
      })
    })
  }

  updatePlainte() {
    let data = {
      quartierId: this.plainte.quartierId,
      origineId: this.plainte.origineId,
      categorie: this.plainte.categorie,
      lu: true,
      prioriteId: this.plainte.prioriteId,
      engagement: this.plainte.engagement,
      sousDomaineId: this.plainte.sousDomaineId,
      numeroClient: this.plainte.numeroClient,
      gpcId: this.authService.getCurrentAccount().id,
      typeId: this.plainte.typeId,
      typologieId: this.plainte.typologieId,
      latitude: this.plainte.latitude,
      longitude: this.plainte.longitude,
      groupeAssocieId: this.plainte.groupeAssocieId,
      complexiteId: this.plainte.complexiteId,
      statutId: this.plainte.statut.statut === "NON PRIS EN CHARGE" ? this.statuts.find(s => s.statut === "EN COURS").id : this.plainte.statut.id
    }
    // Mise à jour de plainte
    this.plainteService.patchPlainte(this.plainte.id, data).subscribe(
      (response) => {
        //update message system
        this.messageService.postMessage({ message: 'Plainte pré-qualififiée par ' + this.authService.getDe(), de: 'SYS', type: 'SYSTEM', date: new Date(), plainteId: this.plainte.id })
          .subscribe((res => {
            this.reloadCurrentRoute();
            this.notificationService.showNotification(
              "top",
              "right",
              "success",
              "Mise à jour",
              "Plainte pré-qualifiée avec succés")
          }))
      },
      (error) => {
        console.error("Erreur lors de pré-qualification de la plainte", error);
      }
    );
  }

  getSites() {
    let today = new Date();
    let selectedMonth = today.getMonth() + 1;
    let selectedYear = today.getFullYear();
    let yearMonthNumber = selectedMonth >= 10 ? parseInt(selectedYear + "" + selectedMonth) : parseInt(selectedYear + "0" + selectedMonth);
    let dM = selectedMonth - 1;
    let dY = selectedYear;
    if (dM == 0) {
      dM = 12;
      dY = dY - 1;
    }
    let dYM = dM >= 10 ? parseInt(dY + "" + dM) : parseInt(dY + "0" + dM);
    this.baseService.get('/Cells/getSites/' + yearMonthNumber + '/' + dYM, false).subscribe(res => {
      this.sites = res.data;
    });
  }

  // Ajoutez les méthodes de récupération ici
  getPlainte() {
    const plainteId = this.route.snapshot.paramMap.get("id");
    if (plainteId) {
      // Récupérer les détails de la plainte à l'aide de l'ID
      this.plainteService.getOnePlainte(plainteId).subscribe(
        (plainte) => {
          this.plainte = plainte;
          this.messages = plainte.messages;
          if (plainte && plainte.quartier) {
            this.plainte.regionId = plainte.quartier.commune.departement.regionId;
            this.plainte.departementId = plainte.quartier.commune.departementId;
            this.plainte.communeId = plainte.quartier.communeId;
          }
          //recupérer l'agent qui porte la plainte.
          if (plainte && plainte.affecterA)
            this.baseService.get('Accounts?filter={"where":{"id":"' + plainte.affecterA + '"}}', true).subscribe(
              res => {
                this.jambarsAgent = res[0]
              }
            )
        },
        (error) => {
          console.error(
            "Erreur lors de la récupération des détails de la plainte",
            error
          );
        }
      );
    }

  }

  // Récupération des dépendances
  getOrigines(): void {
    this.detailPlainteService.getOrigine().subscribe((origines) => {
      this.origines = origines;
    });
  }
  getOnePlainte(id) {
    this.plainteService.getOnePlainte(id).subscribe((res) => {
      this.newPlainte = res;
    })
  }
  getPriorites(): void {
    this.detailPlainteService.getPriorite().subscribe((priorites) => {
      this.priorites = priorites;
    });
  }

  getStatuts(): void {
    this.detailPlainteService.getStatut().subscribe((statuts) => {
      this.statuts = statuts;
    });
  }
  getStatutsFilter(): void {
    this.detailPlainteService.getStatut().subscribe((statuts) => {
      const selectedStatut = ['EN ATTENTE', 'NON PREVU', 'FERME'];
      this.statutsFilter = statuts.filter(s => selectedStatut.includes(s.statut));
    });
  }

  async getSousDomaines() {
    await this.domaineService.getsousDomaine().subscribe((sousDomaines) => {
      this.sousDomaines = sousDomaines;
      if (this.plainte.sousDomaineId) {
        let selecteDom = this.domaines.find((d) => d.id === this.plainte.sousDomaine.domaineId);
        this.selectedDomaine = { ...selecteDom };
        this.getChampsByDomaineId(this.selectedDomaine.id);
        this.getData();
      }
    });
  }

  getTypes(): void {
    this.typeService.getType().subscribe((types) => {
      this.types = types;
    });
  }
  getTypologies(): void {
    this.typologieService.getTypologie().subscribe((typologies) => {
      this.typologies = typologies;

    });
  }
  getDomaines(): void {
    this.domaineService.getDomaines().subscribe((domaines) => {
      this.domaines = domaines;
    });
  }


  private unsubscribe$ = new Subject<void>();
  ngOnDestroy() {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();

  }
  getSousDomainesByDomaine(domaineId: number): void {
    this.domaineService.getsousDomaine().subscribe((sousDomaines) => {
      this.sousDomaines = sousDomaines.filter((sousDomaine) => sousDomaine.domaineId === domaineId);
    });
  }
  getSousDomainesByDomaine2(sousDomaineId: number): void {
    this.typologieService.getTypologie().subscribe((typologie) => {
      this.typologies = typologie.filter((typologie) => typologie.sousDomaineId === sousDomaineId);
    });
  }
  getTypologiesBySousDomaineId(sousDomaineId: string): void {
    this.typologieService.getTypologie().subscribe((typologies) => {
      this.typologies = typologies.filter((typologie) => typologie.sousDomaineId === sousDomaineId);
    });
  }

  getDomaine(id) {
    this.domaineService
      .getOneDomaine(id)
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe(
        (domaine) => {
          this.selectedDomaine = domaine;
        },
        (error) => {
          console.error("Erreur lors de la récupération du domaine", error);
        }
      );
  }
  reloadCurrentRoute(): void {
    const currentUrl = this.router.url;
    this.router.navigateByUrl("/", { skipLocationChange: true }).then(() => {
      this.router.navigate([currentUrl]);
    });
  }
  showCollapse() {
    this.isCollapsed = !this.isCollapsed;
  }
  goBack() {
    this.router.navigate(['/qosUniverse/plaintes'])
  }

  //----------------------------------card-------------------------
  resetPosition() {
    this.updatePlainteCoordinates("", "")
    //location.reload();
  }
  updateLatitude() {
    let data = {
      latitude: this.plainte.latitude.trim()
    }
    if (this.plainte.latitude === "") {
      return;
    } else {
      this.plainteService
        .updatePlainte(this.plainte.id, data)
        .subscribe((res) => { })
    }
  }
  updateLongitude() {
    let data = {
      longitude: this.plainte.longitude
    }
    if (this.plainte.longitude === "") {
      return;
    } else {
      this.plainteService
        .updatePlainte(this.plainte.id, data)
        .subscribe((res) => { })
    }
  }
  showMap() {
    const customMarker = document.createElement('div');
    customMarker.style.backgroundImage = 'url(../../../assets/img/flag.svg)';
    customMarker.style.backgroundSize = 'cover';
    customMarker.style.width = '40px';
    customMarker.style.height = '41px';
    //map
    mapboxgl.accessToken = "pk.eyJ1IjoibWNpc3MiLCJhIjoiY2w5ZnR4ZjVvMGp6dTNucnFwaW51dW1veSJ9.QKLe5EHtREISWKRHYd6zIw";
    this.map = new mapboxgl.Map({
      container: 'map',
      style: this.style,
      zoom: this.plainte.longitude ? 7.77 : 5.77,
      center: [this.plainte.latitude ? this.plainte.longitude : -14.6274768, this.plainte.latitude ? this.plainte.latitude : 14.7674414]
    });
    const coordinatesGeocoder = function (query) {
      // Match anything which looks like
      // decimal degrees coordinate pair.
      const matches = query.match(
        /^[ ]*(?:Lat: )?(-?\d+\.?\d*)[, ]+(?:Lng: )?(-?\d+\.?\d*)[ ]*$/i
      );
      if (!matches) {
        return null;
      }

      function coordinateFeature(lng, lat) {
        return {
          center: [lng, lat],
          geometry: {
            type: 'Point',
            coordinates: [lng, lat]
          },
          place_name: 'Lat: ' + lat + ' Lng: ' + lng,
          place_type: ['coordinate'],
          properties: {},
          type: 'Feature'
        };
      }

      const coord1 = Number(matches[1]);
      const coord2 = Number(matches[2]);
      const geocodes = [];

      if (coord1 < -90 || coord1 > 90) {
        // must be lng, lat
        geocodes.push(coordinateFeature(coord1, coord2));
      }

      if (coord2 < -90 || coord2 > 90) {
        // must be lat, lng
        geocodes.push(coordinateFeature(coord2, coord1));
      }

      if (geocodes.length === 0) {
        // else could be either lng, lat or lat, lng
        geocodes.push(coordinateFeature(coord1, coord2));
        geocodes.push(coordinateFeature(coord2, coord1));
      }

      return geocodes;
    };

    // Add the control to the map.
    this.map.addControl(
      new MapboxGeocoder({
        accessToken: mapboxgl.accessToken,
        localGeocoder: coordinatesGeocoder,
        countries: 'sn',
        mapboxgl: mapboxgl,
        reverseGeocode: true
      })
    );
    this.map.addControl(new mapboxgl.NavigationControl());
    this.map.addControl(new mapboxgl.FullscreenControl({ container: document.querySelector('map') }));
    const marker = new mapboxgl.Marker({
      draggable: true,
      element: customMarker
    })
      .setLngLat([this.plainte.longitude ? this.plainte.latitude : -14.6274768, this.plainte.latitude ? this.plainte.latitude : 14.7674414])
      .addTo(this.map);


    marker.on('dragend', onDragEnd.bind(this));
    this.map.on('click', update_marker.bind(this));

    function onDragEnd() {
      const lngLat = marker.getLngLat();
      this.updatePlainteCoordinates(lngLat.lat, lngLat.lng)
    }

    function update_marker(event) {
      var coordinates = event.lngLat;
      marker.setLngLat(coordinates).addTo(this.map);
      this.updatePlainteCoordinates(coordinates.lat, coordinates.lng)
    }
  }
  updatePlainteCoordinates(latitude, longitude) {
    let data = {
      latitude: String(latitude),
      longitude: String(longitude)
    }
    this.plainteService.updatePlainte(this.plainte.id, data).subscribe(res => {
      //this.reloadCurrentRoute();
      this.plainte.latitude = latitude;
      this.plainte.longitude = longitude;
    })
  }
  gotoMap() {
    this.router.navigate(["qosUniverse/map", this.plainte.latitude, this.plainte.longitude]);
  }
  //---UPLOAD FILES----------------------------------
  findFile() {
    for (let i = 0; i < this.plainte.files.length; i++) {
      if (!this.plainte.files[i].nom.includes('Plainte')) {
        return true;
      }
    }
  }
  downloadFile(file): any {
    //let file = id+'_'+filename;
    this.plainteService.downloadFile(file);
  }

  ajouterFiles() {
    this.saveFiles(this.filesEnd, this.plainte.id);
  }

  saveFiles(fichiers, id) {
    let data: File[] = [];
    if (fichiers.length > 0 && (!this.isValidFiles(fichiers))) {
      //this.uploadStatus.emit(false);
      return;
    }
    if (fichiers.length > 0) {
      for (let i = 0; i < fichiers.length; i++) {
        let formData: FormData = new FormData();
        let nameFile = fichiers[i].name;
        nameFile = nameFile.replaceAll("_", "-");
        nameFile = nameFile.replaceAll(" ", "-");
        nameFile = nameFile.replaceAll("é", "e");
        nameFile = nameFile.replaceAll("è", "e");
        nameFile = nameFile.replaceAll("à", "a");
        nameFile = nameFile.replaceAll("ù", "u");
        nameFile = nameFile.replaceAll("ç", "c");
        formData.append('file', fichiers[i], id + "_Plainte" + nameFile);

        this.plainteService.postFile(formData).subscribe(success => { },
          error => {
            //this.uploadStatus.emit(true);
            console.log(error) //false ? 
            //console.log(error.ExceptionMessage);
          })
        //Save File 
        this.postFile(id, nameFile);
        data.push({
          nom: id + "_Plainte" + nameFile,
          plainteId: id
        });
      }

      this.reloadCurrentRoute();
    }

  }
  private isValidFiles(files) {
    // Check Number of files
    if (files.length > this.maxFiles) {
      this.errors.push("Erreur: Vous pouvez seulement uploader " + this.maxFiles + " fichier(s)");
      return;
    }
    this.isValidFileExtension(files);
    return this.errors.length === 0;
  }

  private isValidFileExtension(files) {
    // Make array of file extensions
    var extensions = (this.fileExt.split(','))
      .map(function (x) { return x.toLocaleUpperCase().trim() });
    for (var i = 0; i < files.length; i++) {
      // Get file extension
      var ext = files[i].name.toUpperCase().split('.').pop() || files[i].name;
      // Check the extension exists
      var exists = extensions.includes(ext);
      if (!exists) {
        this.errors.push("Le fichier envoyé n'est pas au bon format: " + files[i].name);
      }
      // Check file size
      this.isValidFileSize(files[i]);
    }
  }

  private isValidFileSize(file) {
    var fileSizeinMB = file.size / (1024 * 1000);
    var size = Math.round(fileSizeinMB * 100) / 100; // convert upto 2 decimal place
    if (size > this.maxSize)
      this.errors.push("Erreur (Taille fichier): " + file.name + ": dépasse la limite de " + this.maxSize + "MB ( " + size + "MB )");
  }

  postFile(id, files) {
    let nameFile = files;
    nameFile = nameFile.replaceAll("_", "-");
    nameFile = nameFile.replaceAll(" ", "-");
    nameFile = nameFile.replaceAll("é", "e");
    nameFile = nameFile.replaceAll("è", "e");
    nameFile = nameFile.replaceAll("à", "a");
    nameFile = nameFile.replaceAll("ù", "u");
    nameFile = nameFile.replaceAll("ç", "c");
    let file = {
      plainteId: id,
      filename: id + "_Plainte" + nameFile,
      nom: nameFile,
    }
    this.plainteService.sendFile(file).subscribe(
      (resp: any) => {
        //this.reloadCurrentRoute();
      }
    )
  }
  onFileChange(event) {
    this.filesEnd = event.target.files;
  }

  getFilesByPlainteId(id) {
    this.fileService.getFiles().subscribe((data) => {
      this.plainteFiles = data.filter((file) => file.plainteId === id);
    })
  }


  fermerPlainte() {
    // this.retourClient.plainteId = this.plainte.id;
    if (this.selectedStatut.statut === 'EN ATTENTE') {
      let data1 = {
        statutId: this.selectedStatut.id,
        dateReactivation: this.plainte.dateReactivation,
        actions: this.plainte.actions,
        // groupePorteurId: this.plainte.groupePorteurId,
        // delai: this.plainte.delai,
      }
      this.plainteService.patchPlainte(this.plainteId, data1).subscribe((res) => {
        let message = {
          plainteId: this.plainte.id,
          message: 'Plainte mise en attente par ' + this.authService.getDe() + ' jusqu\'au ' + this.formatDate(this.plainte.dateReactivation),
          de: 'SYS',
          date: new Date(),
          type: 'SYSTEM'
        }
        this.messageService.postMessage(message).subscribe(res => {
          this.agentService.getAgentByJambarsId(this.plainte.gpcId).subscribe(res => {
            let emailData = {
              title: 'Plainte mise en attente',
              to: this.plainte.expediteur,
              cc: res.length > 0 ? res[0].groupe.email || '' : '',
              body: 'La plainte "' + this.plainte.objet + '" est mise en attente par ' + this.authService.getDe() + ' jusqu\'au ' + this.formatDate(this.plainte.dateReactivation),
            }
            this.emailService.postEmails(emailData).subscribe(res => { })
            this.reloadCurrentRoute();
          })
        })

      })
    } else if (this.selectedStatut.statut === 'NON PREVU') {
      let data2 = {
        dateCloture: new Date(),
        statutId: this.selectedStatut.id,
        actions: this.plainte.actions,
        groupePorteurId: this.plainte.groupePorteurId,
        delai: this.plainte.delai,
      }
      this.plainteService.patchPlainte(this.plainteId, data2).subscribe((res) => {
        let message = {
          plainteId: this.plainte.id,
          message: 'Traitement plainte non prévu. ' + this.authService.getDe(),
          de: 'SYS',
          date: new Date(),
          type: 'SYSTEM'
        }
        this.messageService.postMessage(message).subscribe(res => {
          this.agentService.getAgentByJambarsId(this.plainte.gpcId).subscribe(res => {
            let emailData = {
              title: 'Traitement non prévu',
              to: this.plainte.expediteur,
              cc: res.length > 0 ? res[0].groupe.email || '' : '',
              body: 'Le traitement de la plainte "' + this.plainte.objet + '" n\'est pas prévu. ' + this.authService.getDe(),
            }
            this.emailService.postEmails(emailData).subscribe(res => { })
            this.reloadCurrentRoute();
          })
        })

      })
    } else {
      let data = {
        dateCloture: new Date(),
        statutId: this.selectedStatut.id,
        actions: this.plainte.actions,
        site: this.plainte.categorie === "RESEAU" ? this.plainte.site : undefined,
        cause: this.plainte.cause
      }

      this.plainteService.patchPlainte(this.plainteId, { ...data, retourClient: this.plainte.retourClient ? this.plainte.retourClient : undefined }).subscribe(() => {
        let message = {
          plainteId: this.plainte.id,
          message: 'Plainte clôturée ' + new Date() + ' par ' + this.authService.getDe(),
          de: 'SYS',
          date: new Date(),
          type: 'SYSTEM'
        }
        this.messageService.postMessage(message).subscribe(res => { })
        this.agentService.getAgentByJambarsId(this.plainte.gpcId).subscribe(res => {
          let emailData = {
            title: 'Plainte Clôturée',
            to: this.plainte.expediteur,
            cc: res.length > 0 ? res[0].groupe.email || '' : '',
            body: 'La plainte "' + this.plainte.objet + '" vient d\'être clôturée.',
          }
          this.emailService.postEmails(emailData).subscribe(res => { })
          this.reloadCurrentRoute();
        })
        // if (this.plainte.retourClient) {
        //   this.plainteService.patchPlainte(this.plainteId, { retourClient: this.plainte.retourClient }).subscribe((res) => {
        //     this.agentService.getAgentByJambarsId(this.plainte.gpcId).subscribe(res => {
        //       let emailData = {
        //         title: 'Plainte Clôturée',
        //         to: this.plainte.expediteur,
        //         cc: res.length > 0 ? res[0].groupe.email || '': '',
        //         body: 'La plainte "' + this.plainte.objet + '" vient d\'être clôturée.',
        //       }
        //       this.emailService.postEmails(emailData).subscribe(res => {
        //       })
        //       this.reloadCurrentRoute();
        //     })
        //   })
        // } else {
        //   this.agentService.getAgentByJambarsId(this.plainte.gpcId).subscribe(res => {
        //     let emailData = {
        //       title: 'Plainte Clôturée',
        //       to: this.plainte.expediteur,
        //       cc: res.length > 0 ? res[0].groupe.email || '': '',
        //       body: 'La plainte "' + this.plainte.objet + '" vient d\'être clôturée.',
        //     }
        //     this.emailService.postEmails(emailData).subscribe(res => {
        //     })
        //     this.reloadCurrentRoute();
        //   })
        // }
      })
    }
  }

  reOuvrirPlainte() {
    let data = {
      statutId: this.statuts.find(s => s.statut === "EN COURS").id,
    }
    let message = {
      plainteId: this.plainte.id,
      message: 'Plainte Réouverte ' + new Date() + ' par ' + this.authService.getDe(),
      de: 'SYS',
      date: new Date(),
      type: 'SYSTEM'
    }
    this.plainteService.patchPlainte(this.plainteId, data).subscribe((res) => { })
    this.messageService.postMessage(message).subscribe(res => {
      let emailData = {
        title: 'Traitement Plainte',
        to: this.plainte.expediteur,
        cc: this.authService.getCurrentAccount().email,
        body: 'La plainte "' + this.plainte.objet + '" a été réouverte par "' + this.authService.getDe() + '". Le traitement est de nouveau en cours.',
      }
      this.emailService.postEmails(emailData).subscribe(res => {
      })
      this.reloadCurrentRoute();

    })
  }
  onSubmitPriorite() {
    this.detailPlainteService
      .postPriorite(this.priorite)
      .subscribe(
        (data) => {
          this.getPriorites();
        },
        (error) => {
          console.log(error);
        }
      );
  }

  onSubmitType(): void {
    this.typeService
      .postType(this.type)
      .subscribe((res) => {
        this.getTypes();

      });
  }

  onSubmitQuartier(): void {
    this.quartier.communeId = this.selectedCommune.id;
    this.quartier.name = this.quartier.name.toUpperCase().trim();
    this.quartier.population = this.quartier.population ? this.quartier.population : 0;
    this.quartierService.postQuartier(this.quartier).subscribe(async _ => {
      await this.getAllQuartiers();
    })
  }
  onSubmitOrigine() {
    this.detailPlainteService
      .postOrigine(this.origine).subscribe((data) => {
        this.getOrigines();
      },
        (error) => {
          console.log(error);
        }
      );
  }
  onSubmitDomaine(): void {
    if (!this.domaine) return;

    this.domaineService.postDomaine(this.domaine).subscribe((res) => {
      this.getDomaines();
    });

  }
  onSubmitSousDomaine() {
    let data = {
      sousDomaine: this.sousDomaine.sousDomaine,
      domaineId: this.domaineName.id
    }
    this.domaineService
      .postSousDomaine(data)
      .subscribe((res) => {
        this.domaineService.getsousDomaine().subscribe((sousDomaines) => {
          this.sousDomaines = sousDomaines.filter((sousDomaine) => sousDomaine.domaineId === this.domaineName.id);
        });
      });
  }
  getOneSousDomaine(id) {
    this.domaineService.getOneSousDomaine(id).subscribe(res => {
      this.sousDomaineChoose = res;
    })
  }

  onSubmitTypologie() {
    let data = {
      nom: this.typologie.nom,
      sousDomaineId: this.sousDomaineChoose.id
    }
    this.typologieService.postTypologie(data).subscribe(res => {
      this.getTypologiesBySousDomaineId(this.sousDomaineChoose.id);
    })
  }
  deleteFile(id) {
    this.fileService.deleteFile(id).subscribe(res => {
      this.reloadCurrentRoute();
    })
  }

  convertHtml(content): SafeHtml {
    return this.sanitizer.bypassSecurityTrustHtml(content);
  }
  getChampsByDomaineId(domaineId) {
    this.champDomService
      .getChampsDomaines()
      .subscribe((res) => {
        this.champsFilterDomaines = res.filter((dom) => dom.domaineId === domaineId);
      })
  }

  getCommunes(departementId) {
    this.listCommunes = this.communes.filter((c) => c.departement.id === departementId);
    this.listQuartiers = []
  }
  getDepartement(regionId) {
    this.listDepartements = this.departements.filter((d) => d.region.id === regionId);

  }
  getData() {
    if (this.plainte && this.plainte.quartier) {
      this.getDepartement(this.plainte.quartier.commune.departement.regionId);
      this.getCommunes(this.plainte.quartier.commune.departementId)
    }
  }
  getRegions() {
    this.regionService.getRegions().subscribe((res) => {
      this.listRegions = res;
    })
  }
  champsFilterDomainesHas(data: string) {
    if (this.champsFilterDomaines && this.champsFilterDomaines.length > 0) {
      return this.champsFilterDomaines.some((cfd) => cfd.champs.label.toLowerCase() === data);
    }
    return false;
  }

  isChampsFilterDomaineRequered(label: string) {
    if (this.champsFilterDomaines && this.champsFilterDomaines.length > 0) {
      let cfd = this.champsFilterDomaines.find(cfd => cfd.champs.label.toLowerCase() === label);
      if (cfd && cfd.required) return true;
    }

    return false;
  }

  newListCommune() {
    this.listCommunes = [];
    this.listQuartiers = []
  }

  setLatLon(quartierId: string) {
    const quartier = this.listQuartiers.find(reg => reg.id === quartierId);
    this.plainte.latitude = quartier.lat;
    this.plainte.longitude = quartier.lon;
  }

}
