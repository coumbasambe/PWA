import { Localisation } from "./localisation";
import { Origine } from "./origine";
import { Priorite } from "./priorite";
import { RetourClient } from "./retourClient";
import { Statut } from "./statut";
import { Type } from "./type";
import { Typologie } from "./typologie";
import { File } from "./file";
import { Quartier } from "./quartier";
import { SousDomaine } from "./sousDomaine";

export class Plainte {
    constructor(
        public id?: string,
        public objet?: string,
        public description?: string,
        public dateReception?: Date,
        public dateCloture?: Date,
        public dateReactivation?: Date,
        public numeroClient?: string,
        public localite?: string,
        public gpcId?: string,
        public affecterA?: string,
        public groupeAssocieId?: string,
        public porteur?: string,
        public affecterPar?: string,
        public retourClient?: string,
        public latitude?: string,
        public longitude?: string,
        public expediteur?: string,
        public expediteurId?:string,
        public plainteNumber?: string,
        public activeGroupe?: string,
        public regionId?: string,
        public lu?: boolean,
        public externalId?: string,
        public departementId?: string,
        public complexiteId?: string,
        public communeId?: string,
        public quartier?: Quartier,
        public quartierId?: string,
        public isConsulted?: string,
        public statutId?: string,
        public statut?: Statut,
        public origineId?: string,
        public origine?: Origine,
        public prioriteId?: string,
        public priorite?: Priorite,
        public sousDomaineId?: string,
        public sousDomaine?: SousDomaine,
        public typeId?: string,
        public categorie?: string,
        public site?: string,
        public actions?: string,
        public cause?: string,
        public groupePorteurId?: string,
        public delai?: Date,
        public type?: Type,
        public typologieId?: string,
        public engagement?: Date,
        public typologie?: Typologie,
        public files?: File[],
        ){}
}
