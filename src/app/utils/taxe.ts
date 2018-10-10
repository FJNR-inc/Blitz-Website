
export class TaxeUtil {
  static getTPS(amount) {
    return Number((amount * 0.05).toFixed(2));
  }

  static getTVQ(amount) {
    return Number((amount * 0.099750).toFixed(2));
  }
}
