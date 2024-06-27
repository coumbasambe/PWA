import { Groupe } from "./groupe";

export class Messagerie {
    constructor(
        public id?: string,
        public email?: string,
        public password?: string,
        public service?: string,
        public port?: number,
        public groupeId?: string,
        public groupe?: Groupe  
         ){}
}
