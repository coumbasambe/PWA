
export class Action {
    constructor(
        public id?: string,
        public libelle?: string,
        public porteur?: string,
        public etat?: string,
        public date?: Date,
        public courrierId?: string
        ){}
}
