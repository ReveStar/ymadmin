import request from '@/utils/request'

export function fetchSubjectList() {
  return request({
    url: '/subject/info',
    method: 'get'
  })
}

export function searchSubjects(data) {
  return request({
    url: '/subject/info',
    method: 'get',
    params: data
  })
}

export function createSubject(data) {
  return request({
    url: '/subject/add',
    method: 'post',
    data
  })
}

export function deleteSubject(data) {
  return request({
    url: '/subject/delete',
    method: 'post',
    data
  })
}

export function updateSubject(data) {
  return request(
    {
      url: '/subject/update',
      method: 'post',
      data
    }
  )
}
