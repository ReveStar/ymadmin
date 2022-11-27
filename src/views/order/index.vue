<template>
  <div class="app-container">
    <div class="filter-container">
      <el-input v-model="listQuery.student" placeholder="学生名" style="width: 200px;" class="filter-item" @keyup.enter.native="handleFilter" />
      <el-button v-waves class="filter-item" type="primary" icon="el-icon-search" @click="handleFilter">
        搜索
      </el-button>
      <el-button class="filter-item" style="margin-left: 10px;" type="primary" icon="el-icon-edit" @click="handleCreate">
        添加
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
      <el-table-column label="课程ID" align="center" width="100">
        <template slot-scope="{row}">
          <span>{{ row.subject_id }}</span>
        </template>
      </el-table-column>
      <el-table-column label="学生ID" width="150px" align="center">
        <template slot-scope="{row}">
          <span>{{ row.student_id }}</span>
        </template>
      </el-table-column>
      <el-table-column label="学生姓名" width="150px" align="center">
        <template slot-scope="{row}">
          <span>{{ row.student }}</span>
        </template>
      </el-table-column>
      <el-table-column label="状态" min-width="300px" align="center">
        <template slot-scope="{row}">
          <span>{{ row.status }}</span>
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
        <el-form-item label="课程名" prop="name">
          <el-input v-if="dialogStatus!=='create'" v-model="temp.subject" :disabled="true" />
          <el-select v-if="dialogStatus==='create'" v-model="temp.subject_id" placeholder="请选择课程" @change="handleSelectSubject(temp.subject_id)">
            <el-option v-for="item in subjectList" :key="item.subject_id" :label="item.name" :value="item.subject_id" />
          </el-select>
        </el-form-item>
        <el-form-item v-if="dialogStatus!=='create'" label="课程ID" prop="subject_id">
          <el-input v-model="temp.subject_id" :disabled="dialogStatus!=='create'" />
        </el-form-item>
        <el-form-item label="学生" prop="student">
          <el-input v-if="dialogStatus!=='create'" v-model="temp.student" :disabled="true" />
          <el-select v-else v-model="temp.student_id" placeholder="选择学生" @change="handleSelectStudent(temp.student_id)">
            <el-option v-for="item in studentAccounts" :key="item.account_id" :label="item.username" :value="item.account_id" />
          </el-select>
        </el-form-item>
        <el-form-item v-if="dialogStatus!=='create'" label="学生ID" prop="student_id">
          <el-input v-model="temp.student_id" :disabled="dialogStatus!=='create'" />
        </el-form-item>
        <el-form-item label="状态" prop="status">
          <el-select v-model="temp.status" :disabled="dialogStatus==='create'" class="filter-item" placeholder="选择当前订单的状态">
            <el-option v-for="item in orderStatusOptions" :key="item" :label="item" :value="item" />
          </el-select>
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
import { fetchOrderList, updateOrder, deleteOrder, searchOrder, createOrder } from '@/api/order'
import { fetchSubjectList } from '@/api/subject'
import { getStudents } from '@/api/user'
import { MessageBox } from 'element-ui'
import waves from '@/directive/waves' // waves directive
import Pagination from '@/components/Pagination' // secondary package based on el-pagination

const orderStatusOptions = ['待处理', '已处理']

export default {
  name: 'Order',
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
      orderStatusOptions,
      tableKey: 0,
      studentAccounts: null,
      subjectList: null,
      list: null,
      total: 0,
      listLoading: true,
      listQuery: {
        page: 1,
        limit: 20,
        student: ''
      },
      temp: {
        id: undefined,
        subject_id: '',
        subject: '',
        student: '',
        student_id: '',
        status: '待处理'
      },
      dialogFormVisible: false,
      dialogStatus: '',
      textMap: {
        update: '编辑',
        create: '新增'
      }
    }
  },
  created() {
    this.getStudentAccounts()
    this.getSubjectList()
    this.getList()
  },
  methods: {
    getList() {
      this.listLoading = true
      fetchOrderList().then(response => {
        const { orders, total } = response
        this.list = orders
        this.total = total
        this.listLoading = false
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
    handleFilter() {
      this.listQuery.page = 1
      searchOrder(this.listQuery).then((response) => {
        const { orders, total } = response
        this.total = total
        this.list = orders
      })
    },
    handlePaginate(data) {
      this.listQuery.page = data.page
      this.listQuery.limit = data.limit
      searchOrder(this.listQuery).then((response) => {
        const { orders } = response
        this.list = orders
      })
    },
    handleSelectStudent(studentId) {
      this.studentAccounts.forEach(element => {
        if (element.account_id === studentId) {
          this.temp.student = element.username
        }
      })
    },
    handleSelectSubject(subjectId) {
      this.subjectList.forEach(element => {
        if (element.subject_id === subjectId) {
          this.temp.subject = element.name
        }
      })
    },
    resetTemp() {
      this.temp = {
        id: undefined,
        subject_id: '',
        subject: '',
        student: '',
        student_id: '',
        status: '待处理'
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
          createOrder(this.temp).then(() => {
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
          updateOrder(tempData).then(() => {
            this.dialogFormVisible = false
            this.$notify({
              title: 'Success',
              message: '已更新',
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
        deleteOrder(tempData).then(() => {
          this.$notify({
            title: 'Success',
            message: '已删除',
            type: 'success',
            duration: 2000
          })
          this.getList()
        })
      })
    }
  }
}
</script>
