import Layout from '@/layout'

const accountRouter = {
  path: '/account',
  component: Layout,
  redirect: '/account/index',
  children: [
    {
      path: 'index',
      component: () => import('@/views/account/index'),
      name: 'account',
      meta: { title: '账户信息', icon: 'table', affix: true }
    }
  ]
}

export default accountRouter
