import Layout from '@/layout'

const teacherRouter = {
  path: '/teacher',
  component: Layout,
  redirect: '/teacher/index',
  children: [
    {
      path: 'index',
      component: () => import('@/views/teacher/index'),
      name: 'teacher',
      meta: { title: '教师信息', icon: 'table', affix: true }
    }
  ]
}

export default teacherRouter
