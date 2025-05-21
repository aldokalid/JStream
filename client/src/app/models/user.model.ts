/** La clase para instancias de usuario y sesión. */
export class User {
  private birthdate?: Date;
  private username?: string;

  constructor(birthdate?: Date, username?: string) {
    this.birthdate = birthdate;
    this.username = username;
  }

  getBirthdate() {
    return this.birthdate;
  }

  setBirthdate(birthdate: Date) {
    this.birthdate = birthdate;
  }

  getUsername() {
    return this.username;
  }

  setUsername(username: string) {
    this.username = username;
  }
}
