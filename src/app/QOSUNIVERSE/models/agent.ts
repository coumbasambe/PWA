import { Groupe } from "./groupe";

export class Agent {
    constructor(
        public id?: string,
        public jambarsId?: string,
        public jambarsInfos?: any,
        public groupeId?: string,
        public groupe?: Groupe
        
         ){}
}
