import { SousDomaine } from "./sousDomaine";

export class Typologie {
    constructor(
        public id?: string,
        public nom?: string,
        public sousDomaineId?: string,
        public sousDomaine?: SousDomaine
         ){}
}
