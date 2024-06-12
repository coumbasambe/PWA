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
import { takeUntil } from "rxjs/operators";
import { Plainte } from "../../models/plainte";
import { Domaine } from "../../models/domaine";
import { SousDomaine } from "../../models/sousDomaine";
import { File } from "../../models/file";
import { AuthService } from "src/app/pages/auth/auth.service";
import { PlainteGroupe } from "../../models/plainteGroupe";
import { Groupe } from "../../models/groupe";
import { PlainteService } from "../services/plainte.service";
import { DetailPlainteService } from "../services/detail-plaintes.service";
import { DomaineService } from "../services/domaine.service";
import { TypeService } from "../services/type.service";
import { TypologieService } from "../services/typologies.service";
import { PlainteGroupeService } from "../services/plainte-groupe.service";
import { AgentService } from "../services/agent.service";
import { EmailService } from "../services/email.service";
import { Agent } from "../services/agent";


@Component({
  selector: "app-plainte",
  templateUrl: "plainte.component.html",
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
        padding-bottom: 10px;
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
export class PlainteComponent implements OnInit {
  dtOptions: any = {};
  dtTrigger: Subject<any> = new Subject();
  alerte:number=0;
  emails:any;

  dtOptionsAutres: any = {};
  dtTriggerAutres: Subject<any> = new Subject();

  // @ViewChildren(DataTableDirective)
  // dtElements: QueryList<DataTableDirective>;

  plaintes: Plainte[] = [];

  plainte: Plainte = {};
  searching = false;
  ready = false;
  private unsubscribe$ = new Subject<void>();

  // Intégration des dépendances
  statuts: any[] = [];
  origines: any[] = [];
  domaines: Domaine[]=[];
  sousDomaines: any[] = [];
  priorites: any[] = [];
  types: any[] = [];
  typologies: any[] = [];
  currentPlainte: any = {};
  plaintesPrequalifier: Plainte[]=[];
  plaintesEnCours: Plainte[]=[];
  plaintesCloturees: Plainte[]=[];
  plaintesTraiter: Plainte[]=[];
  plaintesNonPrevu: Plainte[]=[];
  plaintesEnAttente: Plainte[]=[];
  domaineName: Domaine = {};
  selectedDomaine: Domaine = {};
  selectedSousDomaine: SousDomaine = {};
  hasFile: boolean = false;
  plainteGroupes :PlainteGroupe[]=[];
  currentGroup = "";
  groupe: Groupe = {}
  //FILES
  filesEnd :File;
  errors: Array<string> = [];

  @Input() fileExt: string = "XLSX, XLS, PDF, TXT, PNG, JPG, JPEG, DOCX, PPTX, DOC";
  @Input() maxFiles: number = 10;
  @Input() maxSize: number = 150; // 15MB
  profil = "SU";
  agent: Agent;

  constructor(
    private plainteService: PlainteService,
    private detailPlainteService: DetailPlainteService,
    private domaineService: DomaineService,
    private typeService: TypeService,
    private typologieService: TypologieService,
    private plainteGroupeService: PlainteGroupeService,
    private authService: AuthService,
    private agentService: AgentService,
    private emailService: EmailService,
    private router: Router
  ) {
    this.profil = this.authService.accountHasRole(['ROLE_ADMIN','ROLE_QOS_GP_ADMIN']) ? 'ADMIN' : 
    this.authService.accountHasRole(['ROLE_QOS_GP_GROUPE']) ? 'GROUP' : 'SU';
    this.getAgent( res => {
      if (this.profil === "ADMIN"){
        this.currentGroup = "GROUPE - SMC-N/GPC"
      } else if (this.agent && this.agent.groupe){
        this.currentGroup = "GROUPE - "+ this.agent.groupe.nomGroupe
      }
    });
   
  }

  ngOnInit() {
    this.getDomaines();
    this.getPlaintes();
    this.getOrigines();
    this.getTypologies();
    this.getPriorites();
    this.getStatut();
    this.getSousDomaine();
    this.getType();
    this.getPlainteGroupe();
    this.getGroupByGroupName();
    
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
      sorting: true,
      pageLength: 50,
      language: language,
      order: [[0, "asc"]],
      dom: "Bfrtip",
      // Configure the buttons
      buttons: buttonsA,
    };
    this.dtOptionsAutres = {
      pagingType: "full_numbers",
      sorting: true,
      pageLength: 50,
      language: language,
      order: [[0, "asc"]],
      dom: "Bfrtip",
      // Configure the buttons
      buttons: buttonsA,
    };
  }
  
  getPlainteGroupe(){
    this.plainteGroupeService.getPlainteGroupes().subscribe(res=>{
      this.plainteGroupes = res;
    })
  }
  getGroupByGroupName(){
    this.agentService.getGroupeByName('GPADMIN').subscribe(res=>{
      this.groupe = res[0];
    })
  }
  getAgent(cb){
    this.agentService.getAgentByJambarsId(this.authService.getCurrentAccount().id)
    .subscribe(
      (resp:any)=> {
        this.agent = resp[0];
        cb(1)
      }
    )
  }
  postPlainte() {
    this.plainte.dateReception = new Date();
    this.plainte.lu = false;
    this.plainte.plainteNumber = 'T' + Math.random().toString(36).substring(2,9).toUpperCase();
    this.plainte.statutId = this.statuts.find( (s) => s.statut === "NON PRIS EN CHARGE").id;
    this.plainte.expediteur = this.authService.getCurrentAccount().prenom +' '+ 
    this.authService.getCurrentAccount().nom +' <'+this.authService.getCurrentAccount().email+'>';
    this.plainte.expediteurId = this.authService.getCurrentAccount().id;
    if(this.agent){
      if(this.agent.groupe.type === 'USER'){
        this.plainte.groupeAssocieId = this.agent.groupe.id;
        this.plainteService.postPlainte(this.plainte).subscribe((res) => {
          const plainte = res;
          if(this.hasFile){
            this.ajouterFiles(plainte);
          }
          let emailData = {
            title: 'Nouvelle plainte',
            to: this.groupe.email,
            cc: this.agent.groupe.email,
            body: `Une nouvelle plainte "${this.plainte.objet}" vient d\'être reçue.`,
          }
          this.emailService.postEmails(emailData).subscribe(res=>{
          })
          this.reloadCurrentRoute();
        },
        (error) => {
          console.error("Error:", error);
        }
      ); 
      }else{
        this.plainteService.postPlainte(this.plainte).subscribe((res) => {
          const plainte = res;
          if(this.hasFile){
            this.ajouterFiles(plainte);
          }
          let emailData = {
            title: 'Nouvelle plainte',
            to: this.groupe.email,
            cc: this.agent.groupe.email,
            body: `Une nouvelle plainte "${this.plainte.objet}" vient d\'être reçue.`,
          }
          this.emailService.postEmails(emailData).subscribe(res=>{
          })
          this.reloadCurrentRoute();
        },
        (error) => {
          console.error("Error:", error);
        }
      ); 
      }

    }else{
      this.plainteService.postPlainte(this.plainte).subscribe((res) => {
        const plainte = res;
        if(this.hasFile){
          this.ajouterFiles(plainte);
        }
        let emailData = {
          title: 'Nouvelle plainte',
          to: this.groupe.email,
          cc: null,
          body: `Une nouvelle plainte "${this.plainte.objet}" vient d\'être reçue.`,
        }
        this.emailService.postEmails(emailData).subscribe(res=>{
          })
          this.reloadCurrentRoute();
      },
      (error) => {
        console.error("Error:", error);
      }
    ); 
    }
   
  }

  editPlainte(plainte: any) {
    this.currentPlainte = plainte;
  }
  getDomaines(): void {
    this.domaineService
      .getDomaines()
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe((domaines) => {
        this.domaines = domaines;
      });
  }
  updatePlainte() {
    let data = {
      numeroClient: this.currentPlainte.numeroClient,
      expediteur: this.currentPlainte.expediteur,
      localite: this.currentPlainte.localite,
      latitude : this.currentPlainte.latitude,
      longitude : this.currentPlainte.longitude,
      origineId : this.currentPlainte.origineId,
      prioriteId : this.currentPlainte.prioriteId,
      sousDomaineId : this.plainte.sousDomaineId,
      typeId : this.currentPlainte.typeId,
      statutId: this.currentPlainte.statut.statut ==="NON PRIS EN CHARGE" ? this.statuts.find(s => s.statut === "EN COURS").id : this.plainte.statut.id
   }

    this.plainteService.patchPlainte(this.currentPlainte.id, data).subscribe((response) => {
          this.reloadCurrentRoute();
        },
        (error) => {
          // Gérer les erreurs lors de la requête PATCH
          console.error("Erreur lors de la mise à jour de la plainte", error);
        }
      );
  } 

  getPlaintes() {
    this.searching = true;
    this.plainteService.getPlaintes().subscribe((res) => {
          this.plaintes = res;
          this.plaintesEnCours = res.filter((plainte) => plainte.statut.statut === 'EN COURS');
          this.plaintesCloturees = res.filter((plainte) => plainte.statut.statut === 'FERME');
          this.plaintesPrequalifier = res.filter((plainte) => plainte.statut.statut != 'NON PRIS EN CHARGE');
          this.plaintesNonPrevu = res.filter((plainte) => plainte.statut.statut === 'NON PREVU');
          this.plaintesEnAttente = res.filter((plainte) => plainte.statut.statut === 'EN ATTENTE');
          this.plaintesTraiter = res.filter((plainte) => plainte.statut.statut === 'TRAITE');          
                    
          // this.dtTrigger.next();
          // this.dtTriggerAutres.next();
          this.ready = true;
          this.searching = false;
        },
        (error) => {
          this.searching = false;
        }
      ),
      (error) => {
        console.error(error);
      };
  }
  
  rerender(): void {
    // if (this.dtElements) {
    //   this.dtElements.forEach((dtElement: DataTableDirective) => {
    //     if (dtElement && dtElement.dtInstance) {
    //       // dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
    //       //   dtInstance.destroy();
    //       // });
    //     }
    //   });
    // }
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

  //Récuperation des dépendances
  getOrigines(): void {
    this.detailPlainteService.getOrigine().subscribe((origines) => {
          this.origines = origines;
        },
        (error) => {
          console.error(error);
        }
      );
  }

  getPriorites(): void {
    this.detailPlainteService.getPriorite().subscribe((priorites) => {
          this.priorites = priorites;
        },
        (error) => {
          console.error(error);
        }
      );
  }

  getStatut(): void {
    this.detailPlainteService.getStatut().subscribe((statuts) => {
          this.statuts = statuts;
        },
        (error) => {
          console.error(error);
        }
      );
  }

  getSousDomaine(): void {
    this.domaineService.getsousDomaine().subscribe((sousDomaines) => {
          this.sousDomaines = sousDomaines;
        },
        (error) => {
          console.error(error);
        }
      );
  }

  getType(): void {
    this.typeService.getType().subscribe((types) => {
          this.types = types;
        },
        (error) => {
          console.error(error);
        }
      );
  }
  getTypologies(): void {
    this.typologieService.getTypologie().subscribe((typologies) => {
          this.typologies = typologies;
        },
        (error) => {
          console.error(error);
        }
      );
  }
  ngOnDestroy() {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }

  getDomaineById(id){
    this.domaineService.getOneDomaine(id).subscribe((domaine)=>{
      this.domaineName = domaine;
      
    })
  }
  getSousDomainesByDomaine(domaineId): void {
    this.domaineService.getsousDomaine().subscribe((sousDomaines) => {
      this.sousDomaines = sousDomaines.filter(
        (sousDomaine) => sousDomaine.domaineId === domaineId
      );
    });
  }
  getTypologiesBySousDomaineId(sousDomaineId: string): void {
    this.typologieService.getTypologie().subscribe((typologies) => {
      this.typologies = typologies.filter(
        (typologie) => typologie.sousDomaineId === sousDomaineId
      );
    });
  }
  findFile(){
    for(let i=0;i<this.plainte.files.length;i++){
      if(!this.plainte.files[i].nom.includes('Admin')){
        return true;
      }
  }
}
downloadFile(file): any {
  //let file = id+'_'+filename;
  this.plainteService.downloadFile(file);
}

ajouterFiles(plainte){
  this.saveFiles(this.filesEnd,plainte.id);
}

saveFiles(fichiers,id){
  let data: File[] = [];
  if (fichiers.length > 0 && (!this.isValidFiles(fichiers))) {
    //this.uploadStatus.emit(false);
    return;
  }
  if (fichiers.length > 0) {
  for(let i=0; i< fichiers.length;i++){
    let formData: FormData = new FormData();
    let nameFile= fichiers[i].name;
    nameFile=nameFile.replaceAll("_","-");
    nameFile=nameFile.replaceAll(" ","-");
    nameFile=nameFile.replaceAll("é","e");
    nameFile=nameFile.replaceAll("è","e");
    nameFile=nameFile.replaceAll("à","a");
    nameFile=nameFile.replaceAll("ù","u");
    nameFile=nameFile.replaceAll("ç","c");
    formData.append('file', fichiers[i],id+"_Plainte"+nameFile);
    
    this.plainteService.postFile(formData)
      .subscribe(
        success => {
          
        },
        
        error => {
          //this.uploadStatus.emit(true);
          console.log(nameFile +" NOK");
          console.log(error) //false ? 
          //console.log(error.ExceptionMessage);
        })
        //Save File 
        this.postFile(id,nameFile);
          data.push({
            nom: id+"_Plainte"+nameFile,
            plainteId: id
          });
  }
  
  this.reloadCurrentRoute();
}

}
private isValidFiles(files){
  // Check Number of files
  if (files.length > this.maxFiles) {
    this.errors.push("Erreur: Vous pouvez seulement uploader " + this.maxFiles + " fichier(s)");
    return;
  }
  this.isValidFileExtension(files);
  return this.errors.length === 0;
}

private isValidFileExtension(files){
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

postFile(id,files){
  let nameFile=files;
  nameFile=nameFile.replaceAll("_","-");
  nameFile=nameFile.replaceAll(" ","-");
  nameFile=nameFile.replaceAll("é","e");
  nameFile=nameFile.replaceAll("è","e");
  nameFile=nameFile.replaceAll("à","a");
  nameFile=nameFile.replaceAll("ù","u");
  nameFile=nameFile.replaceAll("ç","c");
  let file ={
    plainteId:id,
    filename : id+"_Plainte"+nameFile,
    nom: nameFile,
  }
  this.plainteService.sendFile(file).subscribe(
    (resp : any)=>{
      //this.reloadCurrentRoute();
    }
  )
}
onFileChange(event){
  this.filesEnd = event.target.files;
  this.hasFile = true;
}

}
