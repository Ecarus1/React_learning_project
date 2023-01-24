
/**
 * Функция возвращает рандомное, целое, положительное число от min до max
 * @param {*} min - минимально возвожное число
 * @param {*} max - максимально возвожное число
 * @returns {integer}
 */
export default function randomInt(min = 1, max = 3) {
  return Math.floor(min + Math.random() * (max + 1 - min));
}