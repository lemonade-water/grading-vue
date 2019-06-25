
<template>
	<div style="margin-top: 2em">
		<div class="demo-image__placeholder">
			<div class="block" style="text-align: center;">
				<i class="el-icon-s-custom"></i>
				<span class="el-dropdown-link userinfo-inner"><img src="../../assets/user.png" /> </span>
			</div>
		</div>
		<div style="text-align: center;margin-top: 1em;margin-bottom: 1em" @click="showEditDialog()"><label>编辑个人信息</label><i class="el-icon-edit"></i></div>
		<el-form ref="userForm" :model="userForm" label-width="43%">
			<el-form-item  label="工号" prop="id">
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
				<el-input class="input_width" type="number"
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

        <!--编辑弹出框-->
        <el-dialog title="编辑" v-model="editFormVisible" :close-on-click-modal="false">
            <el-form :model="editForm" label-width="80px" :rules="editFormRules">
                <el-form-item label="姓名" prop="name">
                    <el-input v-model="editForm.name" auto-complete="off"></el-input>
                </el-form-item>
                <el-form-item label="年龄" prop="age">
                    <el-input v-model="editForm.age" type="number" min="0" max="150" auto-complete="off"></el-input>
                </el-form-item>
                <el-form-item label="邮箱" prop="email">
                    <el-input v-model="editForm.email" type="email" auto-complete="off"></el-input>
                </el-form-item>
                <el-form-item label="个人简介" prop="personalIntroduction">
                    <el-input v-model="editForm.personalIntroduction" auto-complete="off"></el-input>
                </el-form-item>

            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click.native="editFormVisible = false">取消</el-button>
                <el-button type="primary" @click.native="editSubmit" :loading="editLoading">提交</el-button>
            </div>
        </el-dialog>
	</div>


</template>

<script>
	import util from '../../common/js/util'
	import { getUserListPage, editUser } from '../../api/api';

	export default {
		data() {
            var validateAge = (rule, value, callback) => {
                if (value === '') {
                    callback(new Error('请输入年龄'));
                } else {
                    if (value < 0|| value >150) {
                        callback(new Error('请输入0-150之间的值'));
                    }
                    callback();
                }
            };
            var validateEmail = (rule,value,callback) =>{
                var reg = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

              if(value === ''){
                  callback(new Error('请输入您的邮箱号'));
              }else {
                  if(!reg.test(value)){
                      callback(new Error('请输入正确的邮箱'));
                  }
                  callback();
              }
            };
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



                editForm:{
				    id:'',
                    name:'',
                    age:'',
                    email:'',
                    personalIntroduction:'',
                },
				editFormVisible: false,//编辑界面是否显示
				editLoading: false,

				editFormRules: {

					name: [
						{ required: true, message: '请输入姓名', trigger: 'blur' }

					],
                    age: [
                        { required: true, message: '请输入年龄', trigger: 'blur' },
                        { validator:validateAge, trigger: "blur" }
                    ],
                    email: [
                        { required: true, message: '请输入邮箱', trigger: 'blur' },
                        { validator:validateEmail, trigger: "blur" }
                    ],
                    personalIntroduction: [
                        { required: true, message: '请输入个人简介', trigger: 'blur' }
                    ]
				},


			};

		},

		methods: {

			//性别显示转换
			formatSex: function (row, column) {
				return row.value%2==0  ? '女' :  '男';
			},
            onlineMatter:function(row, column){

                return row.online==1  ? '在线' :row.online==0 ?  '离线':'在线';
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
					// removeUser(para).then((res) => {
					// 	this.listLoading = false;
					// 	//NProgress.done();
					// 	this.$message({
					// 		message: '删除成功',
					// 		type: 'success'
					// 	});
					// 	this.getUsers();
					// });
				}).catch(() => {

				});
			},
			//显示编辑界面
			showEditDialog:function(){
                this.editFormVisible = true;
                this.editForm.name = this.userForm.name;
                this.editForm.age = this.userForm.age;
                this.editForm.personalIntroduction = this.userForm.personalIntroduction;
                this.editForm.email = this.userForm.email;
                this.editForm.id = this.userForm.id;
            },
            editSubmit :function () {
			    let param = this.editForm;
                editUser(param).then((res)=>{

                })
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