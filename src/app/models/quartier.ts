import { Commune } from "./commune";

export class Quartier {
    constructor(
        public id?: string,
        public name?: string,
        public communeId?: string,
        public commune?: Commune,      
        public population?: number,   
        public lat?: string,
        public lon?: string, 
         ){}
}
