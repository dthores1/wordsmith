// n*(n+1) base, plus 20 bonus per letter beyond 5.
// 3=12, 4=20, 5=30, 6=62, 7=96, 8=132.
export function scoreForWord(length) {
  const bonus = length < 5 ? 0 : (length - 5) * 20;
  return length * (length + 1) + bonus;
}
