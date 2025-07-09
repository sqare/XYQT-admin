import uniqueId from 'lodash.uniqueid';
/**
 * 获取唯一标识
 * @param prefix 前缀
 * @returns {string} 唯一标识
 */
export function unique_Id(prefix?: string): string {
  return uniqueId(prefix);
}
