<template>
    <section>
        <!--工具条-->
        <el-col :span="24" class="toolbar" style="padding-bottom: 0px;">
            <el-form :inline="true" :model="filters">
                <el-form-item>
                    <el-input v-model="filters.goodsname" placeholder="商品名称"></el-input>
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" v-on:click="getSHgoods">查询</el-button>
                </el-form-item>
            </el-form>
        </el-col>

        <!--列表-->
        <el-table :data="users" highlight-current-row v-loading="listLoading" @selection-change="selsChange" style="width: 100%;">
            <el-table-column type="selection" width="55">
            </el-table-column>
            <el-table-column type="index" width="60">
            </el-table-column>
            <el-table-column prop="goodsid" label="商品名称" v-show="false" width="250"  sortable>
            </el-table-column>
            <el-table-column prop="goodsname" label="商品名称" width="250"  sortable>
            </el-table-column>
            <el-table-column prop="pop" label="人气" width="100" sortable>
            </el-table-column>
            <el-table-column prop="intro" label="简介" width="250" sortable>
            </el-table-column>
            <el-table-column prop="price" label="原价" width="120" sortable>
            </el-table-column>
            <el-table-column prop="secprice" label="价格" width="120" sortable>
            </el-table-column>
            <el-table-column prop="condition" label="新旧度" min-width="180" sortable>
            </el-table-column>
            <el-table-column label="操作" width="150">
                <template scope="scope">
                    <el-button size="small" @click="handleEdit(scope.row.goodsid)">上架</el-button>
                    <el-button type="danger" size="small" @click="handleDel(scope.row.goodsid)">拒绝</el-button>
                </template>
            </el-table-column>
        </el-table>

        <!--工具条-->
        <el-col :span="24" class="toolbar">
            <el-button type="danger" @click="batchRemove" :disabled="this.sels.length===0">批量删除</el-button>
            <el-pagination layout="prev, pager, next" @current-change="handleCurrentChange" :page-size="20" :total="total" style="float:right;">
            </el-pagination>
        </el-col>

        <!---->
        <el-dialog title="详情" v-model="editFormVisible" :close-on-click-modal="false">
            <el-form :model="editForm" label-width="80px" :rules="editFormRules" ref="editForm">

                <el-form-item label="商品名称" prop="goodsname">
                    <el-input v-model="editForm.goodsname" auto-complete="off"></el-input>
                </el-form-item>

                <el-form-item label="人气" prop="pop">
                    <el-input v-model="editForm.pop" auto-complete="off"></el-input>
                </el-form-item>

                <el-form-item label="简介" prop="intro">
                    <el-input v-model="editForm.intro" auto-complete="off"></el-input>
                </el-form-item>

                <el-form-item label="原价">
                    <el-input-number v-model="editForm.price" :min="0" :max="200"></el-input-number>
                </el-form-item>

                <el-form-item label="价格">
                    <el-input-number v-model="editForm.secprice" :min="0" :max="200"></el-input-number>
                </el-form-item>

                <el-form-item label="新旧度" prop="condition">
                    <el-input v-model="editForm.condition" auto-complete="off"></el-input>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click.native="editFormVisible = false">关闭</el-button>
            </div>
        </el-dialog>

    </section>
</template>

<script>
    import util from '../../common/js/util'
    //import NProgress from 'nprogress'
    import { getUserListPage,getSHgoods, removeUser, batchRemoveUser, editUser, addUser,downGoods,upgoods } from '../../api/api';

    export default {
        data() {
            return {
                filters: {
                    goodsname: ''
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
                    goodsname: '',
                    pop: '',
                    intro: '',
                    price: 0,
                    secprice: 0,
                    condition:'',
                    pictureUrl:''
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
                    name: '',
                    sex: -1,
                    age: 0,
                    birth: '',
                    addr: ''
                },
                dialogVisible:false

            }
        },
        methods: {
            //性别显示转换

            handleCurrentChange(val) {
                this.page = val;
                this.getSHgoods();
            },
            //获取用户列表
            getSHgoods() {
                let para = {
                    page: this.page,
                    query: this.filters.goodsname
                };
                this.listLoading = true;
                //NProgress.start();
                getSHgoods(para).then((res) => {
                    this.total = res.data.total;
                    this.users = res.data.list;
                    this.listLoading = false;
                    //NProgress.done();
                });
            },
            //删除
            handleDel: function (goodsid) {
                this.$confirm('确认拒绝该商品吗?', '提示', {
                    type: 'warning'
                }).then(() => {
                    this.listLoading = true;
                    //NProgress.start();
                    let para = {goodsid:goodsid,type:'3'};
                    upgoods(para).then((res) => {
                        this.listLoading = false;
                        //NProgress.done();
                        this.$message({
                            message: '拒绝成功',
                            type: 'success'
                        });
                        this.getSHgoods();
                    });
                }).catch(() => {

                });
            },
            //显示编辑界面
            handleEdit: function (goodsid) {
                var params = {goodsid:goodsid,type:'0'};
                upgoods(params).then((res)=>{
                    this.getSHgoods();
                })
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
                                this.getSHgoods();
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
                                this.getSHgoods();
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
                var ids = this.sels.map(item => item.id).toString();
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
                        this.getSHgoods();
                    });
                }).catch(() => {

                });
            }
        },
        mounted() {
            this.getSHgoods();
        }
    }

</script>

<style scoped>

</style>