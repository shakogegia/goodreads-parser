function number<T = null>(
  value: string,
  defaultValue?: T,
  parser: (string: string, radix?: number) => number = parseInt
): number | T {
  const _value = parser(value.replace(/[^\d.]/g, ''), 10)
  if (isNaN(_value)) {
    return defaultValue || null
  }

  return _value
}

export function int<T = null>(value: string, defaultValue?: T): number | T {
  return number(value, defaultValue, parseInt)
}

export function float<T = null>(value: string, defaultValue?: T): number | T {
  return number(value, defaultValue, parseFloat)
}

String.prototype.toInt = function toInt() {
  return int(String(this))
}

String.prototype.toFloat = function toFloat() {
  return float(String(this))
}
