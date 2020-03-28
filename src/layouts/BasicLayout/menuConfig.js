const headerMenuConfig = [];
const asideMenuConfig = [
  {
    name: '数据页面',
    path: '/',
    icon: 'chart-pie',
    children: [
      {
        name: '分析页面',
        path: '/dashboard/analysis',
      },
      {
        name: '监控页面',
        path: '/dashboard/monitor',
      },
      {
        name: '工作台',
        path: '/dashboard/workplace',
      },
    ],
  },
  {
    name: '项目管理',
    path: '/',
    icon: 'chart-bar',
    children: [
      {
        name: '项目管理',
        path: '/list/table',
      },
    ],
  },
  {
    name: '计划管理',
    path: '/',
    icon: 'calendar',
    children: [
      {
        name: '项目计划',
        path: '/list/task',
      },
    ],
  },
  {
    name: '设置页面',
    path: '/',
    icon: 'set',
    children: [
      {
        name: '系统设置',
        path: '/settings',
      },
      {
        name: '个人设置',
        path: '/person',
      },
    ],
  },
  {
    name: '登录&注册',
    path: '/',
    icon: 'account',
    children: [
      {
        name: '登录',
        path: '/user/login',
      },
      {
        name: '注册',
        path: '/user/register',
      },
    ],
  },
];
export {headerMenuConfig, asideMenuConfig};
