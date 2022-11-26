<template>
  <div class="app-container">
    <div class="filter-container">
      <el-input v-model="listQuery.student" placeholder="学生" style="width: 200px;" class="filter-item" @keyup.enter.native="handleFilter" />
      <el-input v-model="listQuery.teacher" placeholder="教练" style="width: 200px;" class="filter-item" @keyup.enter.native="handleFilter" />
      <el-select v-model="listQuery.status" placeholder="课程状态" clearable class="filter-item" style="width: 130px">
        <el-option v-for="item in courseStatusOptions" :key="item" :label="item" :value="item" />
      </el-select>
      <el-date-picker
        v-model="listQuery.timeRange"
        style="width: 400px;"
        class="filter-item"
        type="datetimerange"
        format="yyyy-MM-dd HH:mm"
        range-separator="至"
        start-placeholder="开始日期"
        end-placeholder="结束日期"
      />
      <el-button v-waves class="filter-item" type="primary" icon="el-icon-search" @click="handleFilter">
        搜索
      </el-button>
      <el-button class="filter-item" style="margin-left: 10px;" type="primary" icon="el-icon-edit" @click="handleCreate">
        新增
      </el-button>
    </div>

    <el-table
      :key="tableKey"
      v-loading="listLoading"
      :data="list"
      border
      fit
      highlight-current-row
      style="width: 100%;"
    >
      <el-table-column label="课程名" align="center" width="100">
        <template slot-scope="{row}">
          <span>{{ row.subject }}</span>
        </template>
      </el-table-column>
      <el-table-column label="学生" width="150px" align="center">
        <template slot-scope="{row}">
          <span v-for="s in row.students" :key="s">{{ s }} &nbsp;</span>
        </template>
      </el-table-column>
      <el-table-column label="教练" width="150px" align="center">
        <template slot-scope="{row}">
          <span>{{ row.teacher }}</span>
        </template>
      </el-table-column>
      <el-table-column label="课时" width="150px" align="center">
        <template slot-scope="{row}">
          <span>{{ row.school_hour }}</span>
        </template>
      </el-table-column>
      <el-table-column label="地点" width="150px" align="center">
        <template slot-scope="{row}">
          <span>{{ row.location }}</span>
        </template>
      </el-table-column>
      <el-table-column label="开始时间" width="150px" align="center">
        <template slot-scope="{row}">
          <span>{{ row.start_time | parseTime('{y}-{m}-{d} {h}:{i}') }}</span>
        </template>
      </el-table-column>
      <el-table-column label="结束时间" width="150px" align="center">
        <template slot-scope="{row}">
          <span>{{ row.end_time | parseTime('{y}-{m}-{d} {h}:{i}') }}</span>
        </template>
      </el-table-column>
      <el-table-column label="状态" width="150px">
        <template slot-scope="{row}">
          <span> {{ row.status }} </span>
        </template>
      </el-table-column>
      <el-table-column label="备注" width="150px" align="center">
        <template slot-scope="{row}">
          <span>{{ row.remark }}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" min-width="230" class-name="small-padding fixed-width">
        <template slot-scope="{row,$index}">
          <el-button type="primary" size="mini" @click="handleUpdate(row)">
            编辑
          </el-button>
          <el-button size="mini" type="danger" @click="handleDelete(row,$index)">
            删除
          </el-button>
        </template>
      </el-table-column>
    </el-table>

    <pagination v-show="total>0" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.limit" @pagination="handlePaginate" />

    <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible">
      <el-form ref="dataForm" :model="temp" label-position="left" label-width="70px" style="width: 400px; margin-left:50px;">
        <el-form-item label="课程名" prop="subject">
          <el-select v-model="temp.subject_id" placeholder="请选择课程" @change="handleSelectSubject(temp.subject_id)">
            <el-option v-for="item in subjectList" :key="item.subject_id" :label="item.name" :value="item.subject_id" />
          </el-select>
        </el-form-item>
        <el-form-item label="学生" prop="student">
          <el-select v-model="temp.student_ids" filterable :disabled="sdisabled" placeholder="课程选择后选择学生" multiple @change="handleSelectStudent()">
            <el-option v-for="item in studentAccounts" :key="item.account_id" :label="item.username" :value="item.account_id" />
          </el-select>
        </el-form-item>
        <el-form-item label="教练" prop="teacher">
          <el-select v-model="temp.teacher_id" placeholder="选择教师" @change="handleSelectTeacher(temp.teacher_id)">
            <el-option v-for="item in teacherList" :key="item.account_id" :label="item.username" :value="item.account_id" />
          </el-select>
        </el-form-item>
        <el-form-item label="课时" prop="school_hour">
          <el-input-number v-model="temp.school_hour" :precision="1" :step="0.1" />
        </el-form-item>
        <el-form-item label="地点" prop="location">
          <el-input v-model="temp.location" />
        </el-form-item>
        <el-form-item label="开始时间" prop="start_time">
          <el-date-picker v-model="temp.start_time" type="datetime" format="yyyy-MM-dd HH:mm" value-format="timestamp" placeholder="Please pick a date" />
        </el-form-item>
        <el-form-item label="结束时间" prop="end_time">
          <el-date-picker v-model="temp.end_time" type="datetime" format="yyyy-MM-dd HH:mm" value-format="timestamp" placeholder="Please pick a date" />
        </el-form-item>
        <el-form-item v-if="dialogStatus!=='create'" label="状态">
          <el-select v-model="temp.status" class="filter-item" placeholder="Please select">
            <el-option v-for="item in courseStatusOptions" :key="item" :label="item" :value="item" />
          </el-select>
        </el-form-item>
        <el-form-item label="备注" prop="remark">
          <el-input v-model="temp.remark" />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">
          取消
        </el-button>
        <el-button type="primary" @click="dialogStatus==='create'?createData():updateData()">
          确认
        </el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { fetchCourseList, searchCourses, createCourse, deleteCourse, updateCourse } from '@/api/course'
import { getStudents, getTeachers } from '@/api/user'
import { fetchSubjectList } from '@/api/subject'
import { MessageBox } from 'element-ui'
import waves from '@/directive/waves' // waves directive
import Pagination from '@/components/Pagination' // secondary package based on el-pagination

const courseStatusOptions = ['未开始', '进行中', '已完成', '已取消']

export default {
  name: 'Course',
  components: { Pagination },
  directives: { waves },
  filters: {
    statusFilter(status) {
      const statusMap = {
        published: 'success',
        draft: 'info',
        deleted: 'danger'
      }
      return statusMap[status]
    }
  },
  data() {
    return {
      sdisabled: true,
      tableKey: 0,
      list: null,
      studentAccounts: null,
      subjectList: null,
      teacherList: null,
      total: 0,
      listLoading: true,
      listQuery: {
        page: 1,
        limit: 20,
        student: null,
        teacher: null,
        status: '',
        timeRange: null,
        startTime: null,
        endTime: null
      },
      courseStatusOptions,
      temp: {
        id: undefined,
        subject_id: '',
        subject: '',
        student: '',
        student_ids: null,
        teacher: '',
        teacher_id: '',
        school_hour: 1.0,
        start_time: new Date(),
        end_time: new Date(),
        status: '',
        remark: '',
        class: ''
      },
      dialogFormVisible: false,
      dialogStatus: '',
      textMap: {
        update: 'Edit',
        create: 'Create'
      }
    }
  },
  created() {
    this.getStudentAccounts()
    this.getSubjectList()
    this.getTeacherAccounts()
    this.getList()
  },
  methods: {
    getList() {
      this.listLoading = true
      fetchCourseList().then(response => {
        const { courses, total } = response
        this.list = courses
        this.total = total
        this.listLoading = false
      })
    },
    handleFilter() {
      this.listQuery.page = 1
      if (this.listQuery.timeRange != null) {
        this.listQuery.startTime = this.listQuery.timeRange[0]
        this.listQuery.endTime = this.listQuery.timeRange[1]
      }
      searchCourses(this.listQuery).then((response) => {
        const { courses, total } = response
        this.total = total
        this.list = courses
      })
    },
    handlePaginate(data) {
      this.listQuery.page = data.page
      this.listQuery.limit = data.limit
      searchCourses(this.listQuery).then((response) => {
        const { courses } = response
        this.list = courses
      })
    },
    resetTemp() {
      this.temp = {
        id: undefined,
        subject_id: '',
        subject: '',
        student: '',
        student_ids: null,
        teacher: '',
        teacher_id: '',
        school_hour: 1.0,
        start_time: new Date(),
        end_time: new Date(),
        status: '未开始'
      }
    },
    handleCreate() {
      this.resetTemp()
      this.dialogStatus = 'create'
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    createData() {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          this.temp.start_time = new Date(this.temp.start_time).getTime()
          this.temp.end_time = new Date(this.temp.end_time).getTime()
          createCourse(this.temp).then(() => {
            this.dialogFormVisible = false
            this.$notify({
              title: 'Success',
              message: 'Created Successfully',
              type: 'success',
              duration: 2000
            })
            this.getList()
          })
        }
      })
    },
    handleUpdate(row) {
      this.temp = Object.assign({}, row) // copy obj
      this.dialogStatus = 'update'
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    updateData() {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          const tempData = Object.assign({}, this.temp)
          updateCourse(tempData).then(() => {
            this.dialogFormVisible = false
            this.$notify({
              title: 'Success',
              message: 'Update Successfully',
              type: 'success',
              duration: 2000
            })
            this.getList()
          })
        }
      })
    },
    handleDelete(row, index) {
      MessageBox.confirm('确认删除', '删除', {
        confirmButtonText: '删除',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        const tempData = Object.assign({}, row)
        deleteCourse(tempData).then(() => {
          this.$notify({
            title: 'Success',
            message: 'Delete Successfully',
            type: 'success',
            duration: 2000
          })
          this.getList()
        })
      })
    },
    getStudentAccounts() {
      getStudents().then(response => {
        const { students } = response
        this.studentAccounts = students
      })
    },
    getSubjectList() {
      fetchSubjectList().then(response => {
        const { subjects } = response
        this.subjectList = subjects
      })
    },
    getTeacherAccounts() {
      getTeachers().then(response => {
        const { teachers } = response
        this.teacherList = teachers
      })
    },
    handleSelectStudent(studentId) {
      if (this.temp.subject_id === '') {
        this.$notify({
          title: '提示',
          message: '课程未填写',
          type: 'warning',
          duration: 2000
        })
        this.sdisabled = true
      }
    },
    handleSelectSubject(subjectId) {
      this.subjectList.forEach(element => {
        if (element.subject_id === subjectId) {
          this.temp.subject = element.name
        }
      })
      this.sdisabled = false
    },
    handleSelectTeacher(teacherId) {
      this.teacherList.forEach(element => {
        if (element.account_id === teacherId) {
          this.temp.teacher = element.username
        }
      })
    }
  }
}
</script>
