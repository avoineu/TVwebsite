import Model from './Model.js';

export default class Database extends Model {

  static table = "TV.télé";
  static primary = ["idtv"];
}
