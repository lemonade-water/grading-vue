<template>
    <section>
        <!--工具条-->
        <el-col :span="24" class="toolbar" style="padding-bottom: 0px;">
            <el-dropdown size="medium" split-button type="primary" @command="handleCommand">
                {{defaultPost}}
                <el-dropdown-menu slot="dropdown">
                    <el-dropdown-item v-for="post in posts" v-bind:command="post.postId">{{post.postName}}</el-dropdown-item>
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
        <el-table :data="rules" :span-method="objectSpanMethod" border
                  highlight-current-row v-loading="listLoading" @selection-change="selsChange" style="width: 100%;">

            <el-table-column type="index" width="100">
            </el-table-column>
            <el-table-column prop="ruleLevel" label="规则等级" v-show="false" width="100">
            </el-table-column>
            <el-table-column prop="ruleClass" label="规则类别" width="100">
            </el-table-column>
            <el-table-column prop="ruleIntroduction" label="规则介绍" width="550">
            </el-table-column>
            <el-table-column label="评分" width="200">
                <template scope="scope">
                    <el-select v-model="scope.row.ruleGrading" placeholder="请评分">
                        <el-option
                                v-for="item in options"
                                :key="item.value"
                                :label="item.label"
                                :value="item.value">
                        </el-option>
                    </el-select>
                </template>
            </el-table-column>
            <el-table-column label="备注信息" width="250">
                <template scope="scope">
                    <el-input v-model="scope.row.ruleRemarks" placeholder="备注信息">

                    </el-input>
                </template>
            </el-table-column>
        </el-table>
        <template>
            <el-table
                    :data="tableData"
                    style="width: 100%">
                <el-table-column
                        prop="introduction"
                        label="介绍"
                        width="800">
                </el-table-column>
                <el-table-column label="平均分值" width="350">
                    <template scope="scope">
                        <el-input v-model="scope.row.grading1" readonly="readonly" placeholder="平均分值">

                        </el-input>
                    </template>
                </el-table-column>

            </el-table>
        </template>
        <!--工具条-->
        <el-col :span="24" class="toolbar">
            <el-col class="toolbar" style="padding-bottom: 0px;float: right">
                <el-form :inline="true">
                    <el-form-item>
                        <el-button type="primary" v-on:click="">提交</el-button>
                        <el-button type="primary" v-on:click="">保存</el-button>
                    </el-form-item>
                </el-form>
            </el-col>
        </el-col>

        <!---->
        <el-dialog title="详情" v-model="editFormVisible" :close-on-click-modal="false">
            <el-form :model="editForm" label-width="80px" :rules="editFormRules" border ref="editForm">

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
                options: [{
                    value: '1',
                    label: '1'
                }, {
                    value: '2',
                    label: '2'
                }, {
                    value: '3',
                    label: '3'
                }, {
                    value: '4',
                    label: '4'
                }, {
                    value: '5',
                    label: '5'
                }],
                tableData: [{
                    introduction: '9级符合度（取平均，值应为0-5分之间，保留1位小数）',
                    grading1: '',
                },{
                    introduction: '8级符合度（取平均，值应为0-5分之间，保留1位小数）',
                    grading1: '',
                },{
                    introduction: '7级符合度（取平均，值应为0-5分之间，保留1位小数）',
                    grading1: '',
                },{
                    introduction: '6级符合度（取平均，值应为0-5分之间，保留1位小数）',
                    grading1: '',
                },{
                    introduction: '5级符合度（取平均，值应为0-5分之间，保留1位小数）',
                    grading1: '',
                },{
                    introduction: '4级符合度（取平均，值应为0-5分之间，保留1位小数）',
                    grading1: '',
                },{
                    introduction: '3级符合度（取平均，值应为0-5分之间，保留1位小数）',
                    grading1: '',
                },{
                    introduction: '2级符合度（取平均，值应为0-5分之间，保留1位小数）',
                    grading1: '',
                },{
                    introduction: '1级符合度（取平均，值应为0-5分之间，保留1位小数）',
                    grading1: '',
                },
                ],
                value: '',
                postForm:{
                    postId:'',
                    postName:'',
                    postIntroduction:''
                },
                posts:[],
                rules:[{
                    ruleId:'',
                    ruleIntroduction:'',
                    ruleLevel:'',
                    rulePost:'',
                    ruleClass:'',
                    ruleGrading:4,
                    ruleRemarks:'',
                }],
                defaultPost:'',
                defaultPostId:'',
                rule:{
                    ruleId:'',
                    ruleIntroduction:'',
                    ruleLevel:'',
                    rulePost:'',
                    ruleClass:''
                },
                rowList: [],
                spanArr: [],
                position: 0,



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

            rowspan() {
                this.rules.forEach((item,index) => {
                    if( index === 0){
                        this.spanArr.push(1);
                        this.position = 0;
                    }else{
                        if(item.ruleClass === this.rules[index-1].ruleClass ){
                            this.spanArr[this.position] += 1;
                            this.spanArr.push(0);
                        }else{
                            this.spanArr.push(1);
                            this.position = index;
                        }
                    }
                })
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
                    this.rowspan();
                }).catch(() =>{

                })
            },
            /*合并单元格*/
            objectSpanMethod({ row, column, rowIndex, columnIndex }) {
                if (columnIndex === 1) {
                    const _row = this.spanArr[rowIndex];
                    const _col = _row>0 ? 1 : 0;
                    return {
                        rowspan: _row,
                        colspan: _col
                    }
                }
                if (columnIndex === 2) {
                    const _row = this.spanArr[rowIndex];
                    const _col = _row>0 ? 1 : 0;
                    return {
                        rowspan: _row,
                        colspan: _col
                    }
                }
            },
            handleCommand:function(command){
                this.defaultPostId = command;
                for(let i =0;i<this.posts.length;i++){
                    if(this.posts[i].postId === command){
                        this.defaultPost =this.posts[i].postName;
                    }
                }
                this.getRuleByPage();
                this.rowList=[],
                    this.spanArr=[],
                    this.position=0
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