import { Champs } from "./champs";
import { Domaine } from "./domaine";

export class DomaineChamps {
    constructor(
        public id?: string,
        public domaineId?: string,
        public champs?: Champs,
        public champsId?: string,
        public domaine?: Domaine,
         ){}
}
