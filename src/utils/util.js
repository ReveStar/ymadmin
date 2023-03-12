export function InStrList(l, s) {
  for (var i = 0; i < l.length; i++) {
    if (l[i] === s) {
      return true
    }
  }
  return false
}
