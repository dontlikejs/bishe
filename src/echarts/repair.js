import * as echarts from "echarts";
class repair {
  constructor(options) {
    this.repairChart1 = options.repairChart1;
    this.repairChart2 = options.repairChart2;
  }
  repairInfo() {
    this.repairChart1.setOption({
      grid:{
        left:'-1%'
      },
      title:{
        x:'center',
        text:'保修项目类型统计',
        textStyle:{
          color:'#024f9b',
          opacity:0.6,
        }
      },
      legend:{
        orient:'horizontal',
        x:'center',
        y:200
      },
      tooltip:{

      },
      series:[
        {
            type: 'pie', // 类型： 饼图
            center:['50%','42%'],
            data: [
              {
                  name: '灯',
                  value: '11'
              },
              {
                  name: '厕所',
                  value: '15'
              },
              {
                  name: '网络',
                  value: '12'
              },
              {
                  name: '门锁',
                  value: '3'
              },
              {
                  name: '电梯',
                  value: '2'
              },
              {
                  name: '饮水机',
                  value: '8'
              },
              {
                name: '自助机',
                value: '2'
              },
              {
                name: '电力',
                value: '18'
              },
              {
                name: '热水',
                value: '4'
              },
              {
                name: '空调',
                value: '5'
              },
              {
                name: '水龙头',
                value: '21'
              },
          ],//数据
            label: {//饼图文字的显示
                show: true, //默认  显示文字
                formatter: function (arg) {
                    return arg.name 
                }
            },
            radius: 60 ,//饼图的半径
            // radius: '20%' //百分比参照的事宽度和高度中较小的那一部分的一半来进行百分比设置
            // 圆环
            // radius: ['50%','80%']

            // 南丁格尔图  饼图的每一个部分的半径是不同的
            // roseType: 'radius',
            // selectedMode: 'single' //选中的效果，能够将选中的区域偏离圆点一小段距离
            selectedMode: 'multiple',
            selectedOffset: 30
        }
    ],
    
    })
    const dataList = [
      {
        name: '进校',
        value: [
          {
            max: 300,
            name: '东门',
            value: 252,
          },
          {
            max: 300,
            name: '南门',
            value: 214,
          },
          {
            max: 300,
            name: '西门',
            value: 278,
          },
          {
            max: 300,
            name: '北门',
            value: 157,
          },
        ],
      },
      {
        name: '出校',
        value: [
          {
            max: 300,
            name: '东门',
            value: 264,
          },
          {
            max: 300,
            name: '南门',
            value: 121,
          },
          {
            max: 300,
            name: '西门',
            value: 259,
          },
          {
            max: 300,
            name: '北门',
            value: 198,
          },
        ],
      },
    ];
    const fieldData = dataList[0].value;
    const landData = dataList[1].value;
    // this.repairChart2.setOption({
    //   color: ['#1A64F8'],
    //   tooltip: {
    //     trigger: 'axis',
    //     axisPointer: {
    //       type: 'none',
    //     },
    //     formatter: function (prams) {
    //       return prams[0].name + ':' + prams[0].data;
    //     },
    //   },
    //   legend: {
    //     data: ['进校', '出校'],
    //     icon: 'rect',
    //     top: 1,
    //     right: '6%',
    //     itemGap: 20,
    //     itemWidth: 12,
    //     itemHeight: 8,
    //   },
    //   grid: {
    //     left: '16%',
    //     right: '3%',
    //     top: '16%',
    //     bottom: '28%',
    //   },
    //   xAxis: [
    //     {
    //       type: 'category',
    //       data: landData.map((item) => {
    //         return item.name;
    //       }),
    //       axisTick: {
    //         alignWithLabel: true,
    //       },
    //       axisLabel: {
    //         color: '#606266',
    //         interval: 0,
    //         margin: 5,
    //         align: 'center',
    //       },
    //     },
    //   ],
    //   yAxis: {
    //     axisLine: {
    //       show: false,
    //     },
    //     axisTick: {
    //       show: false,
    //     },
    //     axisLabel: {
    //       color: '#606266',
    //     },
    //     splitLine: {
    //       show: true,
    //       lineStyle: {
    //         type: 'dashed',
    //       },
    //     },
    //   },
    //   series: [
    //     // 梯田
    //     {
    //       name: '进校',
    //       type: 'bar',
    //       backgroundStyle: {
    //         color: 'rgba(216, 229, 247, 0.55)',
    //         borderRadius: [8, 8, 0, 0],
    //       },
    //       itemStyle: {
    //         normal: {
    //           borderRadius: [12, 12, 0, 0],
    //           color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
    //             {
    //               offset: 1,
    //               color: '#74A3FF',
    //               opacity: 0.85,
    //             },
    //             {
    //               offset: 0,
    //               color: '#ADDAFF',
    //               opacity: 0.79,
    //             },
    //           ]),
    //           // barBorderRadius: 11,
    //         },
    //       },
    //       barWidth: '20',
    //       label: {
    //         show: true,
    //         color: '#74A2FF',
    //         position: 'outside',
    //       },
    //       data: fieldData.map((item) => {
    //         return item.value;
    //       }),
    //     },
    //     // 坡地
    //     {
    //       name: '出校',
    //       type: 'bar',
    //       backgroundStyle: {
    //         color: 'rgba(216, 229, 247, 0.55)',
    //         borderRadius: [8, 8, 0, 0],
    //       },
    //       itemStyle: {
    //         normal: {
    //           borderRadius: [12, 12, 0, 0],
    //           color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
    //             {
    //               offset: 1,
    //               color: '#1FB8AC',
    //               opacity: 0.85,
    //             },
    //             {
    //               offset: 0,
    //               color: '#7FE3A6',
    //               opacity: 0.79,
    //             },
    //           ]),
    //           // barBorderRadius: 11,
    //         },
    //       },
    //       barWidth: '20',
    //       label: {
    //         show: true,
    //         color: '#42C3B9',
    //         position: 'outside',
    //       },
    //       data: landData.map((item) => {
    //         return item.value;
    //       }),
    //     },
    //   ],
    // });
    const myData = ['珙桐', '香樟', '银杏', '松林', '芙蓉'];
// 全彩屏，双基色屏，简易屏，条形屏
const offLine = [
    [3, 2, 1, 4, 2 ],
    [2, 3, 2, 5, 2 ],
    [3, 0, 5, 2,  1],
];

const onLine = [
    [18,17 , 15, 14, 16 ],
    [27, 24, 24, 25, 23 ],
    [31, 30, 33, 28, 31 ],
];

const offLineSum = [8, 5,8 , 11, 5 ];
const onLineSum = [76, 71, 72, 67, 70 ];

    this.repairChart2.setOption({
      /*    title: [
          {
              text: '脱机状态',
              top: '2%',
              left: '30%',
              textStyle: {
                  color: '#DC3239',
                  fontSize: 14,
              },
          },
          {
              text: '联机状态',
              top: '2%',
              right: '30%',
              textStyle: {
                  color: '#2087FE',
                  fontSize: 14,
              },
          },
      ],*/
      legend: [
          {
              // 图例
              top: '2%',
              left: 'center', // 图例距离左侧距离(此处水平居中)
              textStyle: {
                  // 图例文本样式
                  color: '#fff',
              },
              itemGap: 100,
  
              selectedMode: false, //图例点击失效
              data: ['脱机状态', '联机状态'],
          },
          {
              // 图例
              bottom: '45',
              left: 'center', // 图例距离左侧距离(此处水平居中)
              textStyle: {
                  // 图例文本样式
                  color: '#fff',
              },
              selectedMode: false, //图例点击失效
              data: ['大门', '走廊', '楼梯'],
          },
      ],
      tooltip: {
          // 提示框

   
          // formatter: '{b}<br/>脱机: {c}' // 提示框所提示的文本内容
    
      },
      grid: [
          {
              // 左边
              show: false,
              left: '2%',
              top: 20,
              bottom: 60,
              containLabel: true,
              width: '43%',
          },
          {
              // 中间
              show: false,
              left: '55%',
              top: 40,
              bottom: 60,
              width: '14%',
          },
          {
              // 右边
              show: false,
              right: '2%',
              top: 20,
              bottom: 60,
              containLabel: true,
              width: '43%',
          },
      ],
      // X轴线配置
      xAxis: [
          {
              // 左侧区域
              gridIndex: 0, // x 轴所在的 grid 的索引，默认位于第一个 grid。[ default: 0 ]
              type: 'value', // 轴线类型: 数值轴
              position: 'top', // 轴线位置(此处位于顶部)
              inverse: true, // 是否是反向坐标轴.[ default: false ]
              axisLine: {
                  show: false, // 轴线不显示
              },
              axisTick: {
                  show: false, // 轴线刻度不显示
              },
              axisLabel: {
                  // 轴线刻度标签
                  show: true, // 显示刻度标签
                  textStyle: {
                      // 标签样式
                      color: '#153D7D64',
                      fontSize: 12,
                  },
              },
              splitLine: {
                  // 垂直于X轴的分隔线
                  show: true, // 显示分隔线
                  lineStyle: {
                      // 分隔线样式
                      color: '#153D7D64',
                      width: 1,
                      type: 'solid',
                  },
              },
              // 强制设置坐标轴分割间隔
              // interval: 50,
              // min: 0, // 最小值
              // max: 200 // 最大值
          },
          {
              // 中间区域
              gridIndex: 1,
              show: false, // 中间部分不显示X轴
          },
          {
              // 右侧区域
              gridIndex: 2,
              type: 'value',
              position: 'top',
              inverse: false, // 是否是反向坐标轴.[ default: false ]
              axisLine: {
                  show: false,
              },
              axisTick: {
                  show: false,
              },
              axisLabel: {
                  show: true,
                  textStyle: {
                      color: '#153D7D64',
                      fontSize: 12,
                  },
              },
              splitLine: {
                  show: true,
                  lineStyle: {
                      color: '#153D7D64',
                      width: 1,
                      type: 'solid',
                  },
              },
              // 强制设置坐标轴分割间隔
              // interval: 50,
              // min: 0, // 最小值
              // max: 200 // 最大值
          },
      ],
      // Y轴线配置
      yAxis: [
          {
              // 左侧区域
              gridIndex: 0, // y 轴所在的 grid 的索引，默认位于第一个 grid。[ default: 0 ]
              type: 'category', // 轴线类型: 类目轴
              // 类目轴中 boundaryGap 可以配置为 true 和 false。默认为 true，这时候刻度只是作为分隔线，标签和数据点都会在两个刻度之间的带(band)中间。
              boundaryGap: true, // 坐标轴两边留白策略，类目轴和非类目轴的设置和表现不一样。
              inverse: true, // 是否是反向坐标轴.[ default: false ]
              position: 'right', // y轴的位置。'left' or 'right'
              axisLine: {
                  show: false, // y轴线不显示
              },
              axisTick: {
                  show: false, // y轴线刻度不显示
                  lineStyle: {
                      // 刻度线样式
                      color: '#11356D',
                  },
              },
              axisLabel: {
                  show: false, // 刻度标签不显示
              },
              data: myData, // Y轴(这里是类目轴)的类目数据
          },
          {
              gridIndex: 1, // 中间区域
              type: 'category',
              boundaryGap: true,
              inverse: true,
              position: 'left', // y轴的位置。'left' or 'right'
              axisLine: {
                  show: false,
              },
              axisTick: {
                  show: false,
              },
              axisLabel: {
                  show: true, // 显示中间部分的Y轴刻度标签(中间的文字)
                  textStyle: {
                      // 标签样式
                      color: '#cccccc',
                      fontSize: 12,
                  },
              },
              data: myData,
          },
          {
              // 右侧区域
              gridIndex: 2,
              type: 'category',
              boundaryGap: true,
              inverse: true,
              position: 'left',
              axisLine: {
                  show: false,
              },
              axisTick: {
                  show: false,
                  lineStyle: {
                      // 刻度线样式
                      color: '#153D7D',
                  },
              },
              axisLabel: {
                  show: false,
              },
              data: myData,
          },
      ],
      series: [
          {
              name: '大门', // 系列名称
              type: 'bar',
              // barGap: 5, // 柱间距离
              barWidth: 15, // 柱子宽度
              xAxisIndex: 0, // 对应在X轴的grid索引
              yAxisIndex: 0, // 对应在Y轴的grid索引
              stack: '1', // 相同就是堆叠
              // barGap:'-100%', //重叠
              label: {
                  show: true,
                  position: 'top',
                  color: '#F59A3F',
                  fontSize: 10,
              },
              itemStyle: {
                  // 柱条样式。
                  color: '#F59A3F',
                  // borderWidth:1,
                  // borderColor:'transparent'
              },
              emphasis: {
                  // 鼠标指向高亮
                  show: true,
                  label: {
                      color: '#F59A3F96', // 高亮状态下柱条颜色
                  },
                  itemStyle: {
                      color: '#F59A3F96', // 高亮状态下柱条颜色
                  },
              },
              data: offLine[0], // 系列中的数据内容数组
          },
          {
              name: '走廊', // 系列名称
              type: 'bar',
              barWidth: 15, // 柱子宽度
              xAxisIndex: 0, // 对应在X轴的grid索引
              yAxisIndex: 0, // 对应在Y轴的grid索引
              stack: '1', // 相同就是堆叠
              label: {
                  show: true,
                  position: 'top',
                  color: '#F2C751',
                  fontSize: 10,
              },
              itemStyle: {
                  // 柱条样式。
                  color: '#F2C751',
                  // borderWidth:1,
                  // borderColor:'transparent'
              },
              emphasis: {
                  // 高亮
                  show: true,
                  label: {
                      color: '#F2C75196', // 高亮状态下柱条颜色
                  },
                  itemStyle: {
                      color: '#F2C75196', // 高亮状态下柱条颜色
                  },
              },
              data: offLine[1], // 系列中的数据内容数组
          },
          {
              name: '楼梯', // 系列名称
              type: 'bar',
              barWidth: 15, // 柱子宽度
              xAxisIndex: 0, // 对应在X轴的grid索引
              yAxisIndex: 0, // 对应在Y轴的grid索引
              stack: '1', // 相同就是堆叠
              label: {
                  show: true,
                  position: 'top',
                  color: '#296FFB',
                  fontSize: 10,
              },
              itemStyle: {
                  // 柱条样式。
                  color: '#296FFB',
                  // borderWidth:1,
                  // borderColor:'transparent'
              },
              emphasis: {
                  // 高亮
                  show: true,
                  label: {
                      color: '#296FFB96', // 高亮状态下柱条颜色
                  },
                  itemStyle: {
                      color: '#296FFB96', // 高亮状态下柱条颜色
                  },
              },
              data: offLine[2], // 系列中的数据内容数组
          },

          // 脱机背景
          {
              name: '脱机状态', // 系列名称
              type: 'bar',
              // barGap: 5, // 柱间距离
              barWidth: 21, // 柱子宽度
              xAxisIndex: 0, // 对应在X轴的grid索引
              yAxisIndex: 0, // 对应在Y轴的grid索引
              // stack: '1', // 相同就是堆叠
              barGap: '-120%', //重叠
              itemStyle: {
                  // 柱条样式。
                  // color: '#DC3239',
                  color: 'transparent',
                  borderWidth: 1,
                  borderColor: '#DC3239',
                  shadowColor: '#DC3239',
                  shadowBlur: 20,
              },
              emphasis: {
                  scale: false,
              },
              data: offLineSum, // 系列中的数据内容数组
          }, 
          {
              name: '大门', // 系列名称
              type: 'bar',
              barWidth: 15, // 柱子宽度
              xAxisIndex: 2, // 对应在X轴的grid索引
              yAxisIndex: 2, // 对应在Y轴的grid索引
              stack: '2', // 相同就是堆叠
              label: {
                  show: true,
                  position: 'top',
                  color: '#F59A3F',
                  fontSize: 10,
              },
              itemStyle: {
                  // 柱条样式。
                  color: '#F59A3F',
                  // borderWidth:1,
                  // borderColor:'transparent'
              },
              emphasis: {
                  // 鼠标指向高亮
                  show: true,
                  label: {
                      color: '#F59A3F96', // 高亮状态下柱条颜色
                  },
                  itemStyle: {
                      color: '#F59A3F96', // 高亮状态下柱条颜色
                  },
              },
              data: onLine[0], // 系列中的数据内容数组
          },
          {
              name: '走廊', // 系列名称
              type: 'bar',
              barWidth: 15, // 柱子宽度
              xAxisIndex: 2, // 对应在X轴的grid索引
              yAxisIndex: 2, // 对应在Y轴的grid索引
              stack: '2', // 相同就是堆叠
              label: {
                  show: true,
                  position: 'top',
                  color: '#F2C751',
                  fontSize: 10,
              },
              itemStyle: {
                  // 柱条样式。
                  color: '#F2C751',
                  // borderWidth:1,
                  // borderColor:'transparent'
              },
              emphasis: {
                  // 高亮
                  show: true,
                  label: {
                      color: '#F2C75196', // 高亮状态下柱条颜色
                  },
                  itemStyle: {
                      color: '#F2C75196', // 高亮状态下柱条颜色
                  },
              },
              data: onLine[1], // 系列中的数据内容数组
          },
          {
              name: '楼梯', // 系列名称
              type: 'bar',
              barWidth: 15, // 柱子宽度
              xAxisIndex: 2, // 对应在X轴的grid索引
              yAxisIndex: 2, // 对应在Y轴的grid索引
              stack: '2', // 相同就是堆叠
              label: {
                  show: true,
                  position: 'top',
                  color: '#296FFB',
                  fontSize: 10,
              },
              itemStyle: {
                  // 柱条样式。
                  color: '#296FFB',
                  // borderWidth:1,
                  // borderColor:'transparent'
              },
              emphasis: {
                  // 高亮
                  show: true,
                  label: {
                      color: '#296FFB96', // 高亮状态下柱条颜色
                  },
                  itemStyle: {
                      color: '#296FFB96', // 高亮状态下柱条颜色
                  },
              },
              data: onLine[2], // 系列中的数据内容数组
          },

          // 联机背景
          {
              name: '联机状态', // 系列名称
              type: 'bar',
              // barGap: 5, // 柱间距离
              barWidth: 21, // 柱子宽度
              xAxisIndex: 2, // 对应在X轴的grid索引
              yAxisIndex: 2, // 对应在Y轴的grid索引
              // stack: '2', // 相同就是堆叠
              barGap: '-120%', //重叠
              itemStyle: {
                  // 柱条样式。
                  // color: '#2087FE',
                  color: 'transparent',
                  borderWidth: 1,
                  borderColor: '#2087FE',
              },
              data: onLineSum, // 系列中的数据内容数组
          },
      ],
  });
  }
}
export default repair;
