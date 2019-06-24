<template>
	<section>
		<!--工具条-->
		<el-col :span="24" class="toolbar" style="padding-bottom: 0px;">
			<el-form :inline="true" :model="filters">
				<el-form-item>
					<el-input v-model="filters.name" placeholder="ID,姓名，电话查询"></el-input>
				</el-form-item>
				<el-form-item>
					<el-button type="primary" v-on:click="orderList">查询</el-button>
				</el-form-item>
			</el-form>
		</el-col>

		<!--列表-->
		<el-table :data="users" highlight-current-row v-loading="listLoading" @selection-change="selsChange" style="width: 100%;">
			<el-table-column type="selection" width="55">
			</el-table-column>
			<el-table-column type="index" width="60">
			</el-table-column>
			<el-table-column prop="username1" label="买家" width="100" sortable>
			</el-table-column>
			<el-table-column prop="username2" label="卖家" width="100"  sortable>
			</el-table-column>
			<el-table-column prop="name" label="商品名称" width="150"  sortable>
			</el-table-column>
			<el-table-column prop="address" label="地址" width="180" sortable>
			</el-table-column>
			<el-table-column prop="tel" label="收货电话" width="180" sortable>
			</el-table-column>
			<el-table-column prop="cost" label="消费金额" min-width="80" sortable>
			</el-table-column>
			<el-table-column prop="name_" label="订单状态" min-width="150" sortable>
			</el-table-column>
			<el-table-column label="操作" width="150">
				<template scope="scope">
					<el-button size="small" @click="handleEdit(scope.$index, scope.row)">详情</el-button>
				</template>
			</el-table-column>
		</el-table>

		<!--工具条-->
		<el-col :span="24" class="toolbar">
			<el-pagination layout="prev, pager, next" @current-change="handleCurrentChange" :page-size="20" :total="total" style="float:right;">
			</el-pagination>
		</el-col>




	</section>
</template>

<script>
    import { orderList } from '../../api/api';

    export default {
        data() {
            return {
                filters: {
                    name: ''
                },
                users: [],
                total: 0,
                page: 1,
                listLoading: false,
                sels: [],//列表选中列

            }
        },
        methods: {

            handleCurrentChange(val) {
                this.page = val;
                this.orderList();
            },
            //获取列表
            orderList() {
                let para = {
                    page: this.page,
                    query: this.filters.name
                };
                this.listLoading = true;
                //NProgress.start();
                orderList(para).then((res) => {
                    this.total = res.data.total;
                    this.users = res.data.list;
                    this.listLoading = false;
                    //NProgress.done();
                });
            },
            selsChange: function (sels) {
                this.sels = sels;
            },

        },
        mounted() {
            this.orderList();
        }
    }

</script>

<style scoped>

</style>