import Layout from '@/layout'

const subjectRouter = {
  path: '/subject',
  component: Layout,
  redirect: '/subject/index',
  children: [
    {
      path: 'index',
      component: () => import('@/views/subject/index'),
      name: 'subject',
      meta: { title: '课程', icon: 'table', affix: true }
    }
  ]
}

export default subjectRouter
