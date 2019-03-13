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
