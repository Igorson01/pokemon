const checkCollisionWithBoundaries = (rectangle, boundaries) => {
  for (let i = 0; i < boundaries.length; i++) {
    const collision = rectangularCollision({
      rectangle1: rectangle,
      rectangle2: boundaries[i]
    })

    if (collision) {
      return true;
    }
  }
  return false;
}