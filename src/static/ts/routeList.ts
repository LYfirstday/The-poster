export interface SideListItem {
  icon: string,
  context: string,
  path: string,
  index: number
}

let sideList: Array<SideListItem>;

export default (userType?: number) => {
  switch (userType) {
    case 0:
      return [];
    default:
      sideList = [
        {
          icon: require('./../imgs/users.png'),
          context: '用户管理',
          path: '/index',
          index: 0
        },
        {
          icon: require('./../imgs/postersManagement.png'),
          context: '海报模板管理',
          path: '/index',
          index: 0
        },
        {
          icon: require('./../imgs/posters.png'),
          context: '新建海报模板',
          path: '/index',
          index: 0
        }
      ];
      return sideList;
  }
}
