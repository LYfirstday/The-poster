export interface SideListItem {
  iconUrl: string,
  activeIconUrl: string,
  context: string,
  path: string,
  isActive: boolean
}

let sideList: Array<SideListItem>;

// 如果有权限限制，过滤权限菜单
export default (userType?: number) => {
  switch (userType) {
    case 0:
      return [];
    default:
      sideList = [
        {
          iconUrl: require('./../imgs/users.png'),
          activeIconUrl: require('./../imgs/users-active.png'),
          context: '用户管理',
          path: '/index',
          isActive: false
        },
        {
          iconUrl: require('./../imgs/users.png'),
          activeIconUrl: require('./../imgs/users-active.png'),
          context: '管理端用户管理',
          path: '/index',
          isActive: false
        },
        {
          iconUrl: require('./../imgs/activity-img.png'),
          activeIconUrl: require('./../imgs/activity-img-active.png'),
          context: '活动管理',
          path: '/index/activity',
          isActive: false
        },
        {
          iconUrl: require('./../imgs/postersManagement.png'),
          activeIconUrl: require('./../imgs/postersManagement-active.png'),
          context: '海报模板管理',
          path: '/index/posters',
          isActive: false
        },
        {
          iconUrl: require('./../imgs/posters.png'),
          activeIconUrl: require('./../imgs/posters-active.png'),
          context: '新建海报模板',
          path: '/index/create',
          isActive: false
        }
      ];
      return sideList;
  }
}
