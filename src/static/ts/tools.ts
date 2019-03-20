// 将transform中的rotate(xxdeg) xx 分割出来
export const rotateValueFilter = (val: string): string => {
  let arr = val.split('(');
  let arr2 = arr[1].split(')');
  return `${parseInt(arr2[0])}`;
}

// 将transform中的rotate(xxdeg) xx 分割出来,转换成Slider组件上对应的数值
export const oppositeRotateValueFilter = (val: string): number => {
  let arr = val.split('(');
  let arr2 = arr[1].split(')');
  let value = parseInt(arr2[0]);
  return -(value / 180 * 50 - 50);
}

// 简单的对象深拷贝
export function deepCopy<T>(obj: T): T {
  return JSON.parse(JSON.stringify(obj));
}

// 生成元素id
export function getElementDomId(type: string): string {
  let randomNumber = Math.floor(Math.random() * 8999) + 1000;
  return `${type}_${randomNumber}`
}
