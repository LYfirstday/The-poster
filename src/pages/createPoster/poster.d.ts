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

// 图片元素属性类型
export interface ImgElementType {
  elementType: string,
  id: string,  // 图片外层容器dom元素Id，由elementType + 4位随机数组成
  isChecked: boolean,  // 判断元素是否被选中
  imgUrl: string,  // 图片地址
  elementStyles: ImgElementStyleType,
  outerElementStyles: ImgOuterElementStyleType,
  isAllowEdit: boolean
}

// 图片元素样式类型
export interface ImgElementStyleType {
  height: string,
  width: string,
  top: string,  // 位置属性，对应Y坐标
  left: string,  // 位置属性，对应X坐标
  transform: string,  // 旋转角度 rotate()
  zIndex: number,
}

// 图片元素外层容器样式类型----外部容器位置确定图片位置
export interface ImgOuterElementStyleType {
  top: string,
  left: string,
}
