import { Plainte } from "./plainte";

export class ConsultedPlainte {
    constructor(
        public id?: string,
        public userId?: string,
        public nom?: string,
        public prenom?: string,
        public plainteId?: string,
        public plainte?: Plainte,
         ){}
}
