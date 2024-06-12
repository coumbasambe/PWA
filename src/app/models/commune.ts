import { Departement } from "./departement";

export class Commune {
    constructor( 
        public id?: string,
        public name?: string,
        public departementId?: string,
        public departement?:Departement
    ){
    }
}