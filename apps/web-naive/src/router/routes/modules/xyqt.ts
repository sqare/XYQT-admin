import type { RouteRecordRaw } from 'vue-router';

import { $t } from '#/locales';

const routes: RouteRecordRaw[] = [
  {
    meta: {
      icon: 'lucide:notebook-pen',
      order: 1,
      title: $t('page.xyqt.title'),
      keepAlive: true,
      authority: ['admin'],
    },
    name: 'xyqt',
    path: '/xyqt',
    children: [
      {
        name: 'Subjects',
        path: '/subjects',
        component: () => import('#/views/xyqt/subjects/index.vue'),
        meta: {
          affixTab: true,
          icon: 'icon-park-solid:category-management',
          title: $t('page.xyqt.subjects'),
        },
      },
      {
        name: 'Version',
        path: '/version',
        component: () => import('#/views/xyqt/version/index.vue'),
        meta: {
          icon: 'mingcute:version-fill',
          title: $t('page.xyqt.version'),
        },
      },
      {
        name: 'Books',
        path: '/books',
        component: () => import('#/views/xyqt/books/index.vue'),
        meta: {
          icon: 'icon-park-solid:book-one',
          title: $t('page.xyqt.books'),
        },
      },
      {
        name: 'Units',
        path: '/units',
        component: () => import('#/views/xyqt/units/index.vue'),
        meta: {
          icon: 'material-symbols:view-module-outline',
          title: $t('page.xyqt.units'),
        },
      },
      {
        name: 'Wordlist',
        path: '/wordlist',
        component: () => import('#/views/xyqt/wordlist/index.vue'),
        meta: {
          icon: 'icon-park-solid:file-word',
          title: $t('page.xyqt.wordlist'),
        },
      },
      {
        name: 'Ecdict',
        path: '/ecdict',
        component: () => import('#/views/xyqt/ecdict/index.vue'),
        meta: {
          icon: 'material-symbols-light:dictionary',
          title: $t('page.xyqt.ecdict'),
        },
      },
    ],
  },
];

export default routes;
