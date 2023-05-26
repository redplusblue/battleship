class Ship {
  // Length is an array of the coordinates of the ship
  constructor(name, length) {
    this.name = name;
    this.length = length.length;
    this.position = length;
    this.hits = [];
  }

  // hit() method adds the position of the hit to the hits array
  hit(position) {
    this.hits.push(position);
  }

  // isSunk() method returns true if the length of the hits array is equal to the length of the ship
  isSunk() {
    return this.hits.length === this.length;
  }
}

export default Ship;
