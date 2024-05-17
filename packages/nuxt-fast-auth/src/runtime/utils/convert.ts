/**
 * 序列化
 * @param value 值
 * @returns 序列化后的字符串
 */
export function serialize<T>(value: T): string {
  return value === undefined ? "undefined" : JSON.stringify(value);
}

/**
 * 反序列化
 * @param value 字符串
 * @returns 反序列化后的值
 */
export function deserialize(value: string): any {
  return value === "undefined" ? undefined : JSON.parse(value);
}
