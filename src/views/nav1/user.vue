<template>
	<div style="margin-top: 1em;margin-bottom: 5em;    margin-left: 30%;">
		<el-form :model="editForm" label-width="70px" style="text-align:center;margin-top: 7em;" :rules="editFormRules">
			<el-form-item label="原密码" class="input_width" prop="password">
				<el-input v-model="editForm.password"  type="password" style="width: 256px;" auto-complete="off" clearable></el-input>
			</el-form-item>
			<el-form-item label="新密码" class="input_width" prop="newPassword">
				<el-input v-model="editForm.newPassword" type="password" style="width: 256px;" class="input_width" clearable auto-complete="off"></el-input>
			</el-form-item>
			<el-form-item label="新密码" class="input_width" prop="newSecPassword">
				<el-input v-model="editForm.newSecPassword" type="password" style="width: 256px;" clearable auto-complete="off"></el-input>
			</el-form-item>
			<el-button type="primary" @click="editSubmit" style="margin-right: 32%;">修改</el-button>
		</el-form>
	</div>
</template>
<script>
    import { updatePassword } from '../../api/api';
    //import NProgress from 'nprogress'
    export default {
        data() {
            var validateNewSecPassword = (rule, value, callback) => {
                if (value === '') {
                    callback(new Error('请输入密码'));
                } else {
                    if (this.editForm.newPassword !==this.editForm.newSecPassword) {
                        callback(new Error('两次密码不相等'));
                    }
                    callback();
                }
            };
            return {
                editForm:{
                    password:'',
                    newPassword:'',
                    newSecPassword:''
                },
                editFormRules: {

                    password: [
                        { required: true, message: '请输入原密码', trigger: 'blur' },

                    ],
                    newPassword: [
                        { required: true, message: '请输入新密码', trigger: 'blur' },

                    ],
                    newSecPassword: [
                        { required: true, message: '请输入新密码', trigger: 'blur' },
                        { validator:validateNewSecPassword, trigger: "blur" }
                    ]
                },
            }
        },
        methods: {

            editSubmit:function () {
                if (this.editForm.newPassword !==this.editForm.newSecPassword) {
                    this.$message({
                        message: '两次密码不一致',
                        type: 'error'
                    });
                    return;
                }else {
                    let param = {password:this.editForm.password,newPassword:this.editForm.newSecPassword};
                    updatePassword(param).then((res)=>{
                        if(res.data.code===200){
                            this.$message({
                                message: '修改成功',
                                type: 'success'
                            });
                            this.$router.push({ path: '/login' });
                        }else{
                            this.$message({
                                message: res.data.msg,
                                type: 'error'
                            });
                            this.editForm.password='';
                            this.editForm.newPassword='';
                            this.editForm.newSecPassword='';
                        }
                    })
                }
                this.editForm.password='';
                this.editForm.newPassword='';
                this.editForm.newSecPassword='';
            }
        },
        mounted() {

        }
    };

</script>

<style scoped>
	.input_width{
		max-width: 300px;
		border: none;
		text-align: center;
	}
</style>