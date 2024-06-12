import { Groupe } from "./groupe";
import { Plainte } from "./plainte";
import { Statut } from "./statut";

export class PlainteGroupe {
    constructor(
        public id?: string,
        public isActive?: boolean,
        public date?: Date,
        public plainteId?: string,
        public plainte?: Plainte,
        public statutId?: string,
        public plainteCount?: number,
        public statut?: Statut,
        public groupeId?: string, 
        public groupe?: Groupe,      
         ){}
}
