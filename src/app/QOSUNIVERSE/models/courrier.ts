
export class Courrier {
    constructor(
        public id?: string,
        public objet?: string,
        public localite?: string,
        public statut?: string,
        public type?: string,
        public lat?: string,
        public lon?: string,
        public expediteur?: string,
        public date?: Date,
        public date_reception?: Date,
        public date_cloture?: Date,
        public Action?: string
        ){}
}
