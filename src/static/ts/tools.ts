export const rotateValueFilter = (val: string): number => {
  let arr = val.split('(');
  let arr2 = arr[1].split(')');
  return parseInt(arr2[0])
}

export const oppositeRotateValueFilter = (val: string): number => {
  let arr = val.split('(');
  let arr2 = arr[1].split(')');
  let value = parseInt(arr2[0]);
  return -(value / 180 * 50 - 50);
}
