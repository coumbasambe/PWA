import { Account } from "src/app/models/account";
import { Agent } from "./agent";
import { Plainte } from "./plainte";

export class Message {
    constructor(
        public id?: string ,
        public message?: string,
        public date?: Date,
        public de?: string,
        public type?: string,
        public agentId?: string,
        public agent?: Account,
        public plainteId?: string,
        public plainte?: Plainte
        ){}
}
