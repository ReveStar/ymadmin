import Layout from '@/layout'

const orderRouter = {
  path: '/order',
  component: Layout,
  redirect: '/order/index',
  children: [
    {
      path: 'index',
      component: () => import('@/views/order/index'),
      name: 'order',
      meta: { title: '报名订单', icon: 'table', affix: true }
    }
  ]
}

export default orderRouter
