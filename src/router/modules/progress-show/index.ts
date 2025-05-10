/* Layout */
// import Layout from '@/layouts/index.vue'
// import AppMain from '@/layouts/components/AppMain/index.vue'
import type { AppRouteRecordRaw } from '@/router/type';

const taskPage: Array<AppRouteRecordRaw> = [
  {
    path: '/progressshow',
    name: 'RtProgressShow',
    component: () => import('@/views/progress-show/index.vue'),
    meta: {
      title: '进度展示',
      icon: 'iEL-home-filled',
      position: 3,
    },
  },
];

export default taskPage;
