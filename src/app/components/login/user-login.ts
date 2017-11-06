export class UserLogin {
    constructor(
        public email: string,
        public pass: string
      ) {  }
}

export class UserRegister extends UserLogin{
    constructor(
        public name_user: string,
        public email: string,
        public pass: string,
        public country: string,
        public area: string,
        public institution: string 
    ){super(email,pass);}
}