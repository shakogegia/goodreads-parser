/**
 * Extracts a string from `source` that is placed between `start` and `end`. The function
 * considers only one instance of start and before, or the first instance and does not support
 * multiple occurences otherwise. If end string is not found, it will return everything after
 * `start` to the end of the string.
 */
export function stringBetween(source: string, start: string, end: string) {
  if (source.indexOf(start) === -1) {
    return null
  }

  const sourceSplitByStartString = source.split(start)

  // Note: If start string is the very first occurence in source string, the result will be an
  // array where the first item is an empty string and the next item is of interest.

  if (
    sourceSplitByStartString.length === 1 ||
    sourceSplitByStartString[1] === ''
  ) {
    // It means that start is either the entire string or is at the very end of the string, so there
    // is not anything between
    return ''
  }

  const afterStart = sourceSplitByStartString[1]

  // If the after separator is not found, return everything after the start separator to the end
  // of the string
  if (afterStart.indexOf(end) === -1) {
    return afterStart.trim().replace(/\\n/g, '\n')
  }

  const afterStartSplitByEnd = afterStart.split(end)

  if (afterStartSplitByEnd[0] === '') {
    return ''
  }

  return afterStartSplitByEnd[0].trim().replace(/\\n/g, '\n')
}

export function escape(value?: string) {
  return value?.trim().replace(/\\n/g, '\n')
}

String.prototype.between = function between(start: string, end: string) {
  return stringBetween(String(this), start, end)
}

String.prototype.escape = function () {
  return escape(String(this))
}
