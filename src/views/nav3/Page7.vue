<template>
    <section>
        <!--工具条-->
        <el-col :span="24" class="toolbar" style="padding-bottom: 0px;">
            <el-form :inline="true" :model="filters">
                <el-form-item>
                    <el-input v-model="filters.orderid" placeholder="敏感词汇"></el-input>
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" v-on:click="sensitiveList">查询</el-button>
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" v-on:click="addsensitiveword">新增</el-button>
                </el-form-item>
                <el-form-item>
                    <span style="color: firebrick">更新敏感词汇系统会延迟一分钟！</span>
                </el-form-item>
            </el-form>

        </el-col>

        <!--列表-->
        <el-table :data="users" highlight-current-row v-loading="listLoading" @selection-change="selsChange" style="width: 100%;">
            <el-table-column type="index" width="300">
            </el-table-column>
            <el-table-column prop="sensitiveword" label="敏感词汇" v-show="true" width="500" sortable>
            </el-table-column>

            <el-table-column label="操作" width="500">
                <template scope="scope">
                    <el-button size="small" type="warning" @click="aditsensitiveword(scope.row.sensitiveword)">编辑</el-button>
                    <el-button size="small" style="margin-left: auto" type="danger" @click="delSensitiveWord(scope.row.sensitiveword)">清除</el-button>
                </template>
            </el-table-column>
        </el-table>

        <!--工具条-->
        <el-col :span="24" class="toolbar">
            <el-pagination layout="prev, pager, next" @current-change="handleCurrentChange" :page-size="20" :total="total" style="float:right;">
            </el-pagination>
        </el-col>

        <el-dialog title="修改" v-model="editFormVisible" :close-on-click-modal="false">
            <el-form :model="editForm" label-width="80px" ref="editForm">
                <el-form-item label="旧敏感词" prop="name">
                    <el-input v-model="editForm.old" readonly="readonly" auto-complete="off"></el-input>
                </el-form-item>
                <el-form-item label="新敏感词" prop="name">
                    <el-input v-model="editForm.sensitiveword" auto-complete="off"></el-input>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click.native="editFormVisible = false">关闭</el-button>
                <el-button type="primary" @click.native="updateWord" :loading="addLoading">修改</el-button>
            </div>
        </el-dialog>

        <el-dialog title="新增" v-model="addFormVisible" :close-on-click-modal="false">
            <el-form :model="addForm" label-width="80px"  ref="addForm">
                <el-form-item label="敏感词" prop="name">
                    <el-input v-model="addForm.sensitiveword" auto-complete="off"></el-input>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click.native="addFormVisible = false">取消</el-button>
                <el-button type="primary" @click.native="addSubmit" :loading="addLoading">确定</el-button>
            </div>
        </el-dialog>
    </section>
</template>

<script>
    import util from '../../common/js/util'
    import {sensitiveList,addSensitiveWord1,updateSensitiveWord,delSensitiveWord} from "../../api/api";

    export default {


        data() {
            return {
                filters: {
                    orderid: ''
                },
                total: 0,
                page: 1,
                listLoading: false,
                sels: [],//列表选中列
                users: [],
                editFormVisible:false,
                editLoading: false,
                editForm:{
                    sensitiveword:'',
                    old:''
                },
                addFormVisible:false,
                addLoading: false,
                addForm:{
                    sensitiveword:''
                }

            }
        },
        methods :{
            sensitiveList:function () {
                let para = {
                    page: this.page,
                    query: this.filters.orderid
                };
                this.listLoading = true;
                //NProgress.start();
                sensitiveList(para).then((res) => {
                    this.total = res.data.total;
                    this.users = res.data.list;

                    this.listLoading = false;
                    //NProgress.done();
                });
            },
            //
            aditsensitiveword :function(word){
                console.log(word)
                this.editFormVisible=true,
                this.editForm.old = word
            },
            addsensitiveword :function(word){
                this.addFormVisible=true
            },
            selsChange: function (sels) {
                this.sels = sels;
            },
            handleCurrentChange(val) {
                this.page = val;
                this.sensitiveList();
            },
            addSubmit:function () {
                var addSensitiveWord ={sensitiveword:this.addForm.sensitiveword}
                addSensitiveWord1(addSensitiveWord).then((res) => {
                    this.addFormVisible=false, this.addForm.sensitiveword='';
                    this.sensitiveList();
                    //NProgress.done();
                });
            },
            updateWord:function () {
                if(this.editForm.sensitiveword===this.editForm.old){
                    this.$message({
                        message: '亲，您没有修改',
                        type: 'info'
                    });
                    return;
                }
                var params = {sensitiveword:this.editForm.sensitiveword,old:this.editForm.old};
                updateSensitiveWord(params).then((res) =>{
                    this.editFormVisible=false
                    this.sensitiveList();
                })
            },
            delSensitiveWord:function (sensitiveword) {
                this.$confirm('确认删除该敏感词吗?', '提示', {
                    type: 'warning'
                }).then(() => {
                    var params = {sensitiveword:sensitiveword};
                    delSensitiveWord(params).then((res) => {
                        this.editLoading = false;
                        //NProgress.done();
                        this.$message({
                            message: '删除成功',
                            type: 'success'
                        });
                        this.sensitiveList();
                    });
                }).catch(() => {

                });
            }
        },
        mounted() {
            this.sensitiveList();
        }
    }
</script>

<style scoped>

</style>