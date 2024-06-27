import { Plainte } from "./plainte";

export class Email {
    constructor(
        public title?: string,
        public to?: string,
        public cc?: string,
        public body?: string,
               
         ){}
}
