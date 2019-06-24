<template>
	<section>
		<!--工具条-->
		<el-col :span="24" class="toolbar" style="padding-bottom: 0px;">
			<el-form :inline="true" :model="filters">
				<el-form-item>
					<el-input v-model="filters.orderid" placeholder="订单号"></el-input>
				</el-form-item>
				<el-form-item>
					<el-button type="primary" v-on:click="commmentList">查询</el-button>
				</el-form-item>
			</el-form>
		</el-col>

		<!--列表-->
		<el-table :data="users" highlight-current-row v-loading="listLoading" @selection-change="selsChange" style="width: 100%;">
			<el-table-column type="index" width="60">
			</el-table-column>
			<el-table-column prop="commentid" label="订单号" v-show="true" width="200" sortable>
			</el-table-column>
			<el-table-column prop="orderid" label="订单号" width="200" sortable>
			</el-table-column>
			<el-table-column prop="goodsname" label="商品名称" width="150" sortable>
			</el-table-column>
			<el-table-column prop="commenttext" label="评论内容" width="200" sortable>
			</el-table-column>
			<el-table-column prop="sensitivetext" label="过滤内容" width="200" sortable>
			</el-table-column>
			<el-table-column prop="commenttime" label="评论时间" width="200" :formatter="formatTime" sortable>
			</el-table-column>

			<el-table-column prop="star" label="评分" width="100" sortable>
			</el-table-column>

			<el-table-column label="操作" width="200">
				<template scope="scope">
					<el-button size="small" type="warning" @click="backComment(scope.row.commentid)">还原评论</el-button>
					<el-button size="small" style="margin-left: auto" type="danger" @click="delcommment(scope.row.commentid)">删除</el-button>
				</template>
			</el-table-column>
		</el-table>

		<!--工具条-->
		<el-col :span="24" class="toolbar">
			<el-pagination layout="prev, pager, next" @current-change="handleCurrentChange" :page-size="20" :total="total" style="float:right;">
			</el-pagination>
		</el-col>

		<!--编辑界面-->
		<el-dialog title="编辑" v-model="editFormVisible" :close-on-click-modal="false">
			<el-form :model="editForm" label-width="80px" :rules="editFormRules" ref="editForm">
				<el-form-item label="姓名" prop="name">
					<el-input v-model="editForm.name" auto-complete="off"></el-input>
				</el-form-item>
				<el-form-item label="姓名" prop="name">
					<el-input v-model="editForm.name" auto-complete="off"></el-input>
				</el-form-item>


				<el-form-item label="地址">
					<el-input type="textarea" v-model="editForm.addr"></el-input>
				</el-form-item>
			</el-form>
			<div slot="footer" class="dialog-footer">
				<el-button @click.native="editFormVisible = false">取消</el-button>
				<el-button type="primary" @click.native="editSubmit" :loading="editLoading">提交</el-button>
			</div>
		</el-dialog>

	</section>
</template>

<script>
    import util from '../../common/js/util'
    //import NProgress from 'nprogress'
    import { commmentList ,backComment,delcommment} from '../../api/api';

    export default {
        data() {
            return {
                filters: {
                    orderid: ''
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
                //编辑界面数据
                editForm: {
                    id: 0,
                    name: '',
                    sex: -1,
                    age: 0,
                    birth: '',
                    addr: ''
                },

            }
        },
        methods: {
            formatTime: function (row, column) {
                var date = new Date(row.commenttime) //时间戳为10位需*1000，时间戳为13位的话不需乘1000
                var Y = date.getFullYear() + '-'
                var M = (date.getMonth()+1 < 10 ? '0'+(date.getMonth()+1) : date.getMonth()+1) + '-'
                var D = date.getDate() + ' '
                var h = date.getHours() + ':'
                var m = date.getMinutes() + ':'
                var s = date.getSeconds()
                return Y+M+D+h+m+s;

            },

            handleCurrentChange(val) {
                this.page = val;
                this.commmentList();
            },
            //获取评论列表
            commmentList() {
                let para = {
                    page: this.page,
                    query: this.filters.orderid
                };
                this.listLoading = true;
                //NProgress.start();
                commmentList(para).then((res) => {
                    this.total = res.data.total;
                    this.users = res.data.list;
                    console.log(this.users);
                    this.listLoading = false;
                    //NProgress.done();
                });
            },
            //删除
            //显示编辑界面
            handleEdit: function (index, row) {
                this.editFormVisible = true;
                this.editForm = Object.assign({}, row);
            },
            delcommment :function(commentid){

                this.$confirm('确认删除该记录吗?', '提示', {
                    type: 'warning'
                }).then(() => {
                    var params = {commentid:commentid};
                    delcommment(params).then((res) => {
                        this.editLoading = false;
                        //NProgress.done();
                        this.$message({
                            message: '提交成功',
                            type: 'success'
                        });
                        this.commmentList();
                    });
                }).catch(() => {

                });

			},
			//还原评论
            backComment :function(commentid){
                this.$confirm('确认还原该记录吗?', '提示', {
                    type: 'warning'
                }).then(() => {
                    var params = {commentid:commentid};
                    backComment(params).then((res) => {
                        this.editLoading = false;
                        //NProgress.done();
                        this.$message({
                            message: '提交成功',
                            type: 'success'
                        });
                        this.commmentList();
                    });
                }).catch(() => {

                });
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
                                this.commmentList();
                            });
                        });
                    }
                });
            },
            selsChange: function (sels) {
                this.sels = sels;
            },

        },
        mounted() {
            this.commmentList();
        }
    }

</script>

<style scoped>

</style>