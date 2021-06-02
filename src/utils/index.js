export const IS_DEV =
  window.location.hostname === 'localhost' ||
  window.location.hostname.indexOf('test') > -1

export const getEllipsStr = (str, frontNum, endNum) => {
  if (str) {
    const length = str.length
    if (endNum === 0 && length <= frontNum) {
      return str.substring(0, frontNum)
    }
    return (
      str.substring(0, frontNum) +
      '...' +
      str.substring(length - endNum, length)
    )
  }
  return ''
}
