export const rotateValueFilter = (val: string): number => {
  let arr = val.split('(');
  let arr2 = arr[1].split(')');
  return parseInt(arr2[0])
}
