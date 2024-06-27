import { Champs } from "./champs";

export class Domaine {
    constructor(
        public id?: string,
        public domaine?: string,
        public champs?: Champs[],
        public requis?: Champs[],
        public champsSelected?: Champs[]
         ){}
}
