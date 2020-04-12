import UserLayout from '@/layouts/UserLayout';
import Login from '@/pages/Login';
import Register from '@/pages/Register';
import BasicLayout from '@/layouts/BasicLayout';
import Solution from '@/pages/Solution';
import Analysis from '@/pages/Analysis';
import Monitor from '@/pages/Monitor';
import Workplace from '@/pages/Workplace';
import TableListPage from '@/pages/ProjectManage/ProjectList';
import ProjectTaskList from '@/pages/ProjectTaskManage/ProjectTaskList';
import ProjectAdd from '@/pages/ProjectManage/ProjectAdd';
import UserList from '@/pages/UserManage/UserList';
import UserAdd from '@/pages/UserManage/UserAdd';
import DocumentList from '@/pages/Document/DocumentList';
import DocumentAdd from '@/pages/Document/DocumentAdd';
import DocumentPreview from '@/pages/Document/DocumentPreview';
import PreviewLayout from '@/layouts/PreviewLayout';


const routerConfig = [
  {
    path: '/user',
    component: UserLayout,
    children: [
      {
        path: '/login',
        component: Login,
      },
      {
        path: '/register',
        component: Register,
      },
      {
        path: '/',
        redirect: '/user/login',
      },
    ],
  },
  {
    path: '/preview',
    component: PreviewLayout,
    children: [
      {
        path: '/list/detailDocument',
        component: DocumentPreview,
      },
    ],
  },
  {
    path: '/',
    component: BasicLayout,
    children: [
      {
        path: '/solution',
        component: Solution,
      },
      {
        path: '/dashboard/analysis',
        component: Analysis,
      },
      {
        path: '/dashboard/monitor',
        component: Monitor,
      },
      {
        path: '/dashboard/workplace',
        component: Workplace,
      },
      {
        path: '/list/table',
        component: TableListPage,
      },
      {
        path: '/list/project-add-update',
        component: ProjectAdd,
      },
      {
        path: '/list/task',
        component: ProjectTaskList,
      },
      {
        path: '/list/user',
        component: UserList,
      },
      {
        path: '/list/addUser',
        component: UserAdd,
      },
      {
        path: '/list/auth',
        component: ProjectTaskList,
      },
      {
        path: '/list/document',
        component: DocumentList,
      },
      {
        path: '/list/addDocument',
        component: DocumentAdd,
      },
      {
        path: '/',
        redirect: '/dashboard/analysis',
      },
    ],
  },
];
export default routerConfig;
