<template>
    <section class="chart-container">
        <el-row>
            <el-col :span="12">
                <div id="chartColumn" style="width:100%; height:400px;"></div>
            </el-col>
            <el-col :span="12">
                <div id="chartBar" style="width:100%; height:400px;"></div>
            </el-col>
            <el-col :span="12">
                <div id="chartLine" style="width:100%; height:400px;"></div>
            </el-col>
            <el-col :span="12">
                <div id="chartPie" style="width:100%; height:400px;"></div>
            </el-col>
            <el-col :span="24">
                <a href="http://echarts.baidu.com/examples.html" target="_blank" style="float: right;">more>></a>
            </el-col>
        </el-row>
    </section>
</template>

<script>
    import echarts from 'echarts'

    export default {
        data() {
            return {
                chartColumn: null,
                chartBar: null,
                chartLine: null,
                chartPie: null
            }
        },

        methods: {
            drawColumnChart() {
                this.chartColumn = echarts.init(document.getElementById('chartColumn'));
                this.chartColumn.setOption({
                  title: { text: '商品销量' },
                  tooltip: {},
                  xAxis: {
                      data: ["手机", "数码", "家电", "配件", "服装", "居家","美妆","玩具乐器"]
                  },
                  yAxis: {},
                  series: [{
                      name: '销量',
                      type: 'bar',
                      data: [15, 11, 5, 1, 2, 5,7,1],
                      itemStyle:{
                          normal:{
                              color: function(params) {
                                  // build a color map as your need.
                                  var colorList = [
                                      '#FAD860','#F3A43B','#60C0DD','#D7504B','#C6E579','#F4E001','#F0805A','#26C0C0'
                                  ];
                                  return colorList[params.dataIndex]
                              },
                          }
                      }
                    }]
                });
            },
            drawBarChart() {
                this.chartBar = echarts.init(document.getElementById('chartBar'));
                this.chartBar.setOption({
                    title: {
                        text: '订单状态统计',
                    },
                    tooltip: {
                        trigger: 'axis',
                        axisPointer: {
                            type: 'shadow'
                        }
                    },
                    grid: {
                        left: '3%',
                        right: '4%',
                        bottom: '3%',
                        containLabel: true,
                    },
                    xAxis: {
                        type: 'value',
                        boundaryGap: [0, 0.01]
                    },
                    yAxis: {
                        type: 'category',
                        data: ['已付款', '已发货', '派件', '已收货','退货退款', '评价', '总数']
                    },
                    series: [
                        {
                            name: '2011年',
                            type: 'bar',
                            data: [21, 23, 3, 2, 12,5, 60],
                            itemStyle:{
                                normal:{
                                    color: function(params) {
                                        // build a color map as your need.
                                        var colorList = [
                                            '#5498dc'
                                        ];
                                        return colorList[params.dataIndex]
                                    },
                                }
                            }
                        },

                    ]
                });
            },
            drawLineChart() {
                this.chartLine = echarts.init(document.getElementById('chartLine'));
                this.chartLine.setOption({
                    title: {
                        text: '销量比较'
                    },
                    tooltip: {
                        trigger: 'axis'
                    },
                    legend: {
                        data: ["手机", "数码", "家电", "配件", "服装", "居家","美妆","玩具乐器"]
                    },
                    grid: {
                        left: '3%',
                        right: '4%',
                        bottom: '3%',
                        containLabel: true
                    },
                    xAxis: {
                        type: 'category',
                        boundaryGap: false,
                        data: ['周一', '周二', '周三', '周四', '周五', '周六', '周日']
                    },
                    yAxis: {
                        type: 'value'
                    },
                    series: [
                        {
                            name: '手机',
                            type: 'line',
                            stack: '总量',
                            data: [0, 1, 5, 2, 3, 4, 8]
                        },
                        {
                            name: '数码',
                            type: 'line',
                            stack: '总量',
                            data: [2, 1, 0, 1, 0, 1, 1]
                        },
                        {
                            name: '家电',
                            type: 'line',
                            stack: '总量',
                            data: [5, 5, 0, 0, 0, 4, 0]
                        },
                        {
                            name: '配件',
                            type: 'line',
                            stack: '总量',
                            data: [4, 0, 0, 0, 0, 0, 4]
                        },
                        {
                            name: '服装',
                            type: 'line',
                            stack: '总量',
                            data: [1, 1, 2, 1, 2, 0, 0]
                        },{
                            name: '美妆',
                            type: 'line',
                            stack: '总量',
                            data: [0, 1, 0, 1, 2, 2, 1]
                        },{
                            name: '玩具乐器',
                            type: 'line',
                            stack: '总量',
                            data: [1, 0, 5, 5, 1, 0, 0]
                        }
                    ]
                });
            },
            drawPieChart() {
                this.chartPie = echarts.init(document.getElementById('chartPie'));
                this.chartPie.setOption({
                    title: {
                        text: '订单状态比重',
                        x: 'center'
                    },
                    tooltip: {
                        trigger: 'item',
                        formatter: "{a} <br/>{b} : {c} ({d}%)"
                    },
                    legend: {
                        orient: 'vertical',
                        left: 'left',
                        data: ['已付款', '已发货', '派件', '已收货','退货退款', '评价']
                    },
                    series: [
                        {
                            name: '访问来源',
                            type: 'pie',
                            radius: '55%',
                            center: ['50%', '60%'],
                            data: [
                                { value: 21, name: '已付款' },
                                { value: 23, name: '已发货' },
                                { value: 3, name: '派件' },
                                { value: 2, name: '已收货' },
                                { value: 12, name: '退货退款' },
                                { value: 5, name: '评价' }
                            ],
                            itemStyle: {
                                emphasis: {
                                    shadowBlur: 10,
                                    shadowOffsetX: 0,
                                    shadowColor: 'rgba(0, 0, 0, 0.5)'
                                }
                            }
                        }
                    ]
                });
            },
            drawCharts() {
                this.drawColumnChart()
                this.drawBarChart()
                this.drawLineChart()
                this.drawPieChart()
            },
        },

        mounted: function () {
            this.drawCharts()
        },
        updated: function () {
            this.drawCharts()
        }
    }
</script>

<style scoped>
    .chart-container {
        width: 100%;
        float: left;
    }
    /*.chart div {
        height: 400px;
        float: left;
    }*/

    .el-col {
        padding: 30px 20px;
    }
</style>
