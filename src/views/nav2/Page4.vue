<template>
  <section>
    <!--工具条-->
    <el-col :span="24" class="toolbar" style="padding-bottom: 0px;">
      <el-dropdown size="medium" split-button type="primary" >
        {{defaultPost}}
        <el-dropdown-menu slot="dropdown">
          <el-dropdown-item v-for="post in posts" v-bind:id="post.postId">{{post.postName}}</el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
    </el-col>

    <!--
                    ruleId:'',
                    ruleIntroduction:'',
                    ruleLevel:'',
                    rulePost:'',
                    ruleClass:''-->
    <!--列表-->
    <el-table :data="rules" :span-method="objectSpanMethod"
              highlight-current-row v-loading="listLoading" @selection-change="selsChange" style="width: 100%;">

      <el-table-column type="index" width="100">
      </el-table-column>
      <el-table-column prop="ruleLevel" label="规则等级" v-show="false" width="350">
      </el-table-column>
      <el-table-column prop="ruleClass" label="规则类别" width="250">
      </el-table-column>
      <el-table-column prop="ruleIntroduction" label="规则介绍" width="550">
      </el-table-column>
    </el-table>

    <!--工具条-->
    <el-col :span="24" class="toolbar">
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
    <!--新增界面-->
    <el-dialog title="新增" v-model="addFormVisible" :close-on-click-modal="false">
      <el-form :model="addForm" label-width="80px" :rules="addFormRules" ref="addForm">
        <el-form-item label="姓名" prop="name">
          <el-input v-model="addForm.name" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="性别">
          <el-radio-group v-model="addForm.sex">
            <el-radio class="radio" :label="1">男</el-radio>
            <el-radio class="radio" :label="0">女</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="年龄">
          <el-input-number v-model="addForm.age" :min="0" :max="200"></el-input-number>
        </el-form-item>
        <el-form-item label="生日">
          <el-date-picker type="date" placeholder="选择日期" v-model="addForm.birth"></el-date-picker>
        </el-form-item>
        <el-form-item label="地址">
          <el-input type="textarea" v-model="addForm.addr"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click.native="addFormVisible = false">取消</el-button>
        <el-button type="primary" @click.native="addSubmit" :loading="addLoading">提交</el-button>
      </div>
    </el-dialog>
  </section>
</template>

<script>
    import util from '../../common/js/util'
    //import NProgress from 'nprogress'
    import { getAllPost,getRuleByPage,getAllgoods, editUser, addUser,downGoods } from '../../api/api';

    export default {
        data() {
            return {
                postForm:{
                    postId:'',
                    postName:'',
                    postIntroduction:''
                },
                posts:[],
                rules:[],
                defaultPost:'',
                defaultPostId:'',
                rule:{
                    ruleId:'',
                    ruleIntroduction:'',
                    ruleLevel:'',
                    rulePost:'',
                    ruleClass:''
                },

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
                this.getAllgoods();
            },
            /*查询所有的岗位*/
            getAllPost(){
                var param = {post:1};
                getAllPost(param).then((res) =>{
                    this.posts = res.data;
                    this.defaultPost = this.posts[0].postName;
                    this.defaultPostId = this.posts[0].postId;
                });
            },
            getRuleByPage(){

                var params = {
                    type: this.defaultPostId,
                    page: this.page,
                };
                getRuleByPage(params).then((res)=>{
                        this.rules=res.data.list;
                })
            },
            objectSpanMethod({ row, column, rowIndex, columnIndex }) {
                if (columnIndex === 0) {
                    if (rowIndex % 2 === 0) {
                        return {
                            rowspan: 2,
                            colspan: 1
                        };
                    } else {
                        return {
                            rowspan: 0,
                            colspan: 0
                        };
                    }
                }
            },




            //获取用户列表
            getAllgoods() {
                let para = {
                    page: this.page,
                    query: this.filters.goodsname
                };
                this.listLoading = true;
                //NProgress.start();
                getAllgoods(para).then((res) => {
                    this.total = res.data.total;
                    this.users = res.data.list;
                    this.listLoading = false;
                    //NProgress.done();
                });
            },
            //删除
            handleDel: function (goodsid) {
                this.$confirm('确认下架该商品吗?', '提示', {
                    type: 'warning'
                }).then(() => {
                    this.listLoading = true;
                    //NProgress.start();
                    let para = { goodsid: goodsid};
                    downGoods(para).then((res) => {
                        this.listLoading = false;
                        //NProgress.done();
                        this.$message({
                            message: '下架成功',
                            type: 'success'
                        });
                        this.getAllgoods();
                    });
                }).catch(() => {

                });
            },
            //显示编辑界面
            handleEdit: function (index, row) {
                this.editFormVisible = true;
                this.dialogVisible=true;
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
                                this.getAllgoods();
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
                                this.getAllgoods();
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
                        this.getAllgoods();
                    });
                }).catch(() => {

                });
            }
        },
        mounted() {
            this.getAllPost();
            this.getRuleByPage();
        }
    }

</script>

<style scoped>

</style>