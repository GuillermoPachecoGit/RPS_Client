export class User {
    constructor(
        public id: string,
        public name: string,
        public old_pass: string,
        public new_pass: string,
        public confirm_pass: string,
        public email: string,
        public institution: string,
        public area: string,
        public last_name: string,
        public nick: string
    ) {
        
    }
}