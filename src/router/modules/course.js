import Layout from '@/layout'

const courseRouter = {
  path: '/course',
  component: Layout,
  redirect: '/course/index',
  children: [
    {
      path: 'index',
      component: () => import('@/views/course/index'),
      name: 'course',
      meta: { title: '课表安排', icon: 'table', affix: true }
    }
  ]
}

export default courseRouter
