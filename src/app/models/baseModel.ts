/**
 * Base model with default methods for all the application's models
 */

export default class BaseModel {

  constructor(data: Object = {}) {
    for (const name in data) {
      if ( data.hasOwnProperty(name) ) {
        this[name] = data[name];
      }
    }
  }

  getProperties() {
    const props: { [key: string]: any } = {};
    for (const name in this) {
      if ( this.hasOwnProperty(name) ) {
        props[name] = this[name];
      }
    }
    return props;
  }

}
