module.exports = inside

function inside(str, delim) {
  var rest = str.slice(str.indexOf(delim) + 1)
  return rest.slice(0, rest.indexOf(delim))
}
