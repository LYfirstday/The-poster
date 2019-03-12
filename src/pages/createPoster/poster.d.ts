// 海报个元素状态类型定义

// 画布属性
export interface CanvasType {
  background: string
}

// 控制板右边浮动菜单类型
export interface ControlPanelListType {
  imgUrl: string,
  label: string,
  isActive: boolean,
};

// 图片元素属性类型==========================================================
export interface ImgElementType {
  elementType: string,
  id: string,  // 图片外层容器dom元素Id，由elementType + 4位随机数组成
  isChecked: boolean,  // 判断元素是否被选中
  imgUrl: string,  // 图片地址
  elementStyles: ImgElementStyleType,
  outerElementStyles: ImgOuterElementStyleType,
  isAllowEdit: boolean,
  distanceY: number,   // 保存mousedown时的top和left,mousemove时计算两个差值，改变图片元素位置
  distanceX: number,
}

// 图片元素样式类型
export interface ImgElementStyleType {
  height: string,
  width: string,
  top: string,  // 位置属性，对应Y坐标
  left: string,  // 位置属性，对应X坐标
  zIndex: number,
}

// 图片元素外层容器样式类型----外部容器位置确定图片位置
export interface ImgOuterElementStyleType {
  top: string,
  left: string,
  zIndex: number,
  transform: string,  // 旋转角度 rotate()
}

// 文本元素样式类型===========================================================
export interface FontStyleImgType {
  isChecked: boolean,
  alt: string,
  src: string,
  type: string,   // 对应到dom style上的属性名称
  value: string | number,  // style 的值
}

// 包裹文本元素的外部容器样式类型
export interface TextElementOuterType {
  transform: string,  // 旋转角度
  top: string,
  left: string,
  zIndex: number
}

// 文本元素外部容器和文本元素共有的属性类型，但是值可能不一样
export interface TextElementCommomType {
  top: string,
  left: string,
  zIndex: number
}

// 真正文本元素的样式类型
export interface TextElementInnerType {
  fontFamily: string,  // 字体类型
  fontSize: string,  // 字体大小
  fontWeight: number,  // 字体加粗
  textDecoration: string,  // 字体下划线
  fontStyle: string,  // 斜体字体 italic
  textAlign: 'left' | 'center' | 'right',  // 文本位置
  top: string,
  left: string,
  height: string,
  width: string,
  zIndex: number
}

// 整个文本元素样式类型
export interface TextComStyleType {
  textElementOuterType: TextElementOuterType,
  textElementInnerType: TextElementInnerType,
  isChecked: boolean,
  elementType: string,
  id: string,
  isAllowEdit: boolean,
  distanceY: number,
  distanceX: number,
  content: string,  // 文本内容
  fontStyleImgList: FontStyleImgType[],  // 文本元素下方6个按钮属性选择列表
}

