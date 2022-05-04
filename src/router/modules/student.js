import Layout from '@/layout'

const studentRouter = {
  path: '/student',
  component: Layout,
  redirect: '/student/index',
  children: [
    {
      path: 'index',
      component: () => import('@/views/student/index'),
      name: 'student',
      meta: { title: '学生信息', icon: 'table', affix: true }
    }
  ]
}

export default studentRouter
