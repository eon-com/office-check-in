export class AppUser {
  id: string;
  areas?: { id: string, name: string }[];
  bookings?: { [key: string]: string };
  /* tslint:disable:variable-name */
  email?: string;
  first_name?: string;
  last_name?: string;
  dataPrivacyAccepted = false;

  /* tslint:enable:variable-name */

  static deserialize(object: { [key: string]: any }): AppUser {
    const data = object.data && typeof object.data === 'function' ? object.data() : object;
    const user = new AppUser();

    user.id = object.id;
    user.first_name = data.first_name || '';
    user.last_name = data.last_name || '';
    user.email = data.email || object.email;
    user.dataPrivacyAccepted = data.dataPrivacyAccepted || false;

    if (data.areas) {
      const keys = Object.keys(data.areas);
      user.areas = keys.map(key => {
        return {
          id: key,
          name: data.areas[key],
        };
      }).sort(
        (a, b) => {
          if (a.name < b.name) {
            return -1;
          }
          if (a.name > b.name) {
            return 1;
          }
          return 0;
        },
      );
    } else {
      user.areas = [];
    }

    user.bookings = data.bookings;

    return user;
  }

  public hasValidFullName(): boolean {
    return this.first_name?.length > 0 && this.last_name?.length > 0;
  }

  public get printName() {
    if (this.first_name?.length > 0 && this.last_name?.length > 0) {
      return `${this.first_name} ${this.last_name}`;
    } else if (this.first_name?.length > 0) {
      return this.first_name;
    }
  }

  public toString(): string {
    if (this.first_name?.length > 0 && this.last_name?.length > 0) {
      return `${this.first_name} ${this.last_name}`;
    } else if (this.first_name?.length > 0) {
      return this.first_name;
    } else if (this.email?.length > 0) {
      return this.email;
    } else {
      return 'Anonymous';
    }
  }
}
