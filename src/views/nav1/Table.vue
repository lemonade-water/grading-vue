
<template>
	<el-form ref="userForm" :model="userForm" label-width="80px">
		<el-form-item label="工号" prop="id">
			<el-input class="input_width"
					v-model="userForm.id"
					:disabled="true">
			</el-input>
		</el-form-item>
		<el-form-item label="姓名" prop="name">
			<el-input class="input_width"
					  v-model="userForm.name"
					  :disabled="true">
			</el-input>
		</el-form-item>
		<el-form-item label="年龄" prop="age">
			<el-input class="input_width"
					  v-model="userForm.age"
					  :disabled="true">
			</el-input>
		</el-form-item>
		<el-form-item label="邮箱" prop="email">
			<el-input class="input_width"
					  v-model="userForm.email"
					  :disabled="true">
			</el-input>
		</el-form-item>
		<el-form-item label="项目组" prop="organization.orgName">
			<el-input class="input_width"
					  v-model="userForm.organization.orgName"
					  :disabled="true">
			</el-input>
		</el-form-item>
		<el-form-item label="岗位名称" prop="post.postName">
			<el-input class="input_width"
					  v-model="userForm.post.postName"
					  :disabled="true">
			</el-input>
		</el-form-item>
		<el-form-item label="个人简介" prop="personalIntroduction">
			<el-input class="input_width"
					  v-model="userForm.personalIntroduction"
					  :disabled="true">
			</el-input>
		</el-form-item>
	</el-form>
</template>

<script>
	import util from '../../common/js/util'
	import { getUserListPage, removeUser, batchRemoveUser, editUser, addUser } from '../../api/api';

	export default {
		data() {
			return {
				filters: {
					name: ''
				},
				/*用户表格*/
				userForm:{
				    id:'',
                    name:'',
                    age:'',
                    email:'',
                    personalIntroduction:'',
                    organization:{orgName:''},
                    post:{postName:''},
				},

				users: [],
				total: 0,
				page: 1,
				listLoading: false,
				sels: [],//列表选中列

				editFormVisible: false,//编辑界面是否显示
				editLoading: false,
				editFormRules: {
					name: [
						{ required: true, message: '请输入姓名', trigger: 'blur' }
					]
				},


				addFormVisible: false,//新增界面是否显示
				addLoading: false,
				addFormRules: {
					name: [
						{ required: true, message: '请输入姓名', trigger: 'blur' }
					]
				},
				//新增界面数据
				addForm: {
                    username: '',
                    sex: -1,
                    online: 0,
                    uemail: '',
                    address: ''
				}

			}
		},
		methods: {
			//性别显示转换
			formatSex: function (row, column) {
				return row.value%2==0  ? '女' :  '男';
			},
            onlineMatter:function(row, column){

                return row.online==1  ? '在线' :row.online==0 ?  '离线':'在线';
			},
			handleCurrentChange(val) {
				this.page = val;
				this.getUsers();
			},
			//获取用户列表
			getUsers() {
				getUserListPage().then((res) => {
					// this.total = res.data.total;
					// this.users = res.data.list;
					this.userForm = res.data;
					this.listLoading = false;
				});
			},
			//删除
			handleDel: function (index, row) {
				this.$confirm('确认删除该记录吗?', '提示', {
					type: 'warning'
				}).then(() => {
					this.listLoading = true;
					//NProgress.start();
					let para = { id: row.username };
					removeUser(para).then((res) => {
						this.listLoading = false;
						//NProgress.done();
						this.$message({
							message: '删除成功',
							type: 'success'
						});
						this.getUsers();
					});
				}).catch(() => {

				});
			},
			//显示编辑界面
			handleEdit: function (index, row) {
				this.editFormVisible = true;
				this.editForm = Object.assign({}, row);
			},
			//显示新增界面
			handleAdd: function () {
				this.addFormVisible = true;
				this.addForm = {
					name: '',
					sex: -1,
					age: 0,
					birth: '',
					addr: ''
				};
			},
			//编辑
			editSubmit: function () {
				this.$refs.editForm.validate((valid) => {
					if (valid) {
						this.$confirm('确认提交吗？', '提示', {}).then(() => {
							this.editLoading = true;
							//NProgress.start();
							let para = Object.assign({}, this.editForm);
							para.birth = (!para.birth || para.birth == '') ? '' : util.formatDate.format(new Date(para.birth), 'yyyy-MM-dd');
							editUser(para).then((res) => {
								this.editLoading = false;
								//NProgress.done();
								this.$message({
									message: '提交成功',
									type: 'success'
								});
								this.$refs['editForm'].resetFields();
								this.editFormVisible = false;
								this.getUsers();
							});
						});
					}
				});
			},
			//新增
			addSubmit: function () {
				this.$refs.addForm.validate((valid) => {
					if (valid) {
						this.$confirm('确认提交吗？', '提示', {}).then(() => {
							this.addLoading = true;
							//NProgress.start();
							let para = Object.assign({}, this.addForm);
							para.birth = (!para.birth || para.birth == '') ? '' : util.formatDate.format(new Date(para.birth), 'yyyy-MM-dd');
							addUser(para).then((res) => {
								this.addLoading = false;
								//NProgress.done();
								this.$message({
									message: '提交成功',
									type: 'success'
								});
								this.$refs['addForm'].resetFields();
								this.addFormVisible = false;
								this.getUsers();
							});
						});
					}
				});
			},
			selsChange: function (sels) {
				this.sels = sels;
			},
			//批量删除
			batchRemove: function () {
				var ids = this.sels.map(item => item.username).toString();
				this.$confirm('确认删除选中记录吗？', '提示', {
					type: 'warning'
				}).then(() => {
					this.listLoading = true;
					//NProgress.start();
					let para = { ids: ids };
					batchRemoveUser(para).then((res) => {
						this.listLoading = false;
						//NProgress.done();
						this.$message({
							message: '删除成功',
							type: 'success'
						});
						this.getUsers();
					});
				}).catch(() => {

				});
			}
		},
		mounted() {
			this.getUsers();
		}
	}

</script>

<style scoped>
	.input_width{
		max-width: 200px;
		border: none;
	}
</style>