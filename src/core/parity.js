/**
 * Represents the parity of a permutation. Can be even, odd, or all.
 * For methods involving parity, an instance of this class will be flipped in
 * sign many times, with an operation only being performed when the parity is
 * either even or all.
 */
export default class Parity {
  /**
   * Constructor for the Parity class.
   *
   * @param type The type of parity of the permutation: either "even", "odd" or
   * "all".
   */
  constructor(type) {
    if(typeof type === 'string') {
      if(type === 'even')
        this.parity = true;
      else if(type === 'odd')
        this.parity = false;
    }
    else 
      this.parity = type;
  }

  /**
   * Flips an even permutation to an odd permutation and viceversa.
   *
   * @returns Itself.
   */
  flip() {
    this.parity = (this.parity === undefined ? undefined : !this.parity);
    return this;
  }

  /**
   * Checks whether the permutation type is even or all.
   */
  check() {
    return this.parity !== false;
  }

  clone() {
    return new Parity(this.parity);
  }
}