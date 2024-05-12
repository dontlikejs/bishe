import axios from "axios";
import * as echarts from "echarts";
class student {
  constructor(options) {
    this.studentChart1 = options.studentChart1;
    this.studentChart2 = options.studentChart2;
    this.studentChart3 = options.studentChart3;
    this.studentChart4 = options.studentChart4;
    this.arr=[]
    this.i=null
    this.data=null
  }
   student() {
    let _this=this
    function chart(){
      _this.studentChart3.setOption({
        title: {
          left: "37%",
          text: "男女身高体重分布",
          top:"10%",
          textStyle: {
            color: "#024f9b",
            opacity: 0.6,
          },
        },
        grid: {
          left: "3%",
          right: "7%",
          bottom: "7%",
          containLabel: true,
        },
        tooltip: {
          // trigger: 'axis',
          showDelay: 0,
          formatter: function (params) {
            if (params.value.length > 1) {
              return (
                params.seriesName +
                " :<br/>" +
                params.value[0] +
                "cm " +
                params.value[1] +
                "kg "
              );
            } else {
              return (
                params.seriesName +
                " :<br/>" +
                params.name +
                " : " +
                params.value +
                "kg "
              );
            }
          },
          axisPointer: {
            show: true,
            type: "cross",
            lineStyle: {
              type: "dashed",
              width: 1,
            },
          },
        },
        tooltip: {
          
        },
  
        legend: {
          data: ["男", "女"],
          left: "center",
          bottom: 10,
          y: 240,
        },
        xAxis: [
          {
            type: "value",
            scale: true,
            axisLabel: {
              formatter: "{value} cm",
            },
            splitLine: {
              show: false,
            },
          },
        ],
        yAxis: [
          {
            type: "value",
            scale: true,
            axisLabel: {
              formatter: "{value} kg",
            },
            splitLine: {
              show: false,
            },
          },
        ],
        series: [
          {
            name: "男",
            type: "scatter",
            itemStyle: {
              normal: {
                color: "rgba(0,100,255,0.8)",
              },
            },
            emphasis: {
              focus: "series",
            },
            // prettier-ignore
            data: [[174.0, 65.6], [175.3, 71.8], [183.5, 80.7], [176.5, 62.6], [177.2, 72.8],
            [171.5, 64.8], [184.0, 86.4], [174.5, 58.4], [175.0, 62.0], [174.0, 71.6],
            [180.0, 76.6], [177.8, 83.6], [185.0, 75.0], [176.0, 74.6], [174.0, 71.0],
            [164.0, 68.6], [182.7, 75.8], [171.5, 70.0], [173.0, 72.4], [176.0, 75.9],
            [176.0, 78.8], [170.5, 67.8], [172.7, 66.2], [176.0, 86.4], [173.5, 71.8],
            [178.0, 70.6], [180.3, 72.8], [180.3, 76.4], [164.5, 63.2], [173.0, 60.9],
            [163.5, 54.8], [175.5, 70.0], [168.0, 62.4], [179.2, 74.1], [172.8, 69.1],
            [170.0, 59.5], [182.0, 67.2], [170.0, 61.3], [177.8, 68.6], [184.2, 75.1],
            [186.7, 75.8], [171.4, 64.7], [172.7, 73.4], [175.3, 72.1], [180.3, 82.6],
            [182.9, 76.7], [178.0, 74.1], [167.2, 54.1], [172.1, 74.9], [167.0, 59.1],
            [169.5, 75.6], [174.0, 65.2], [172.7, 65.3], [172.2, 62.1], [164.1, 55.2],
            [163.0, 57.0], [171.5, 61.4], [184.2, 76.8], [174.0, 76.8], [174.0, 72.2],
            [177.0, 65.6], [176.0, 64.8], [167.0, 68.2], [171.8, 66.1], [182.0, 72.0],
            [167.0, 64.6], [177.8, 74.8], [164.5, 70.0], [188.0, 85.6], [175.5, 63.2],
            [171.2, 79.1], [181.6, 78.9], [167.4, 67.7], [171.1, 66.0], [177.0, 68.2],
            [174.5, 63.9], [177.5, 72.0], [170.5, 56.8], [172.4, 64.5], [182.1, 90.9],
            [180.1, 83.0], [175.5, 70.9], [180.6, 72.7], [174.4, 68.0], [175.5, 70.9],
                  ],
  
            // markArea: {
            //   silent: true,
            //   itemStyle: {
            //     color: "transparent",
            //     borderWidth: 1,
            //     borderType: "dashed",
            //   },
            //   data: [
            //     [
            //       {
            //         name: "Female Data Range",
            //         xAxis: "min",
            //         yAxis: "min",
            //       },
            //       {
            //         xAxis: "max",
            //         yAxis: "max",
            //       },
            //     ],
            //   ],
            // },
            // markPoint: {
            //   data: [
            //     { type: "max", name: "Max" },
            //     { type: "min", name: "Min" },
            //   ],
            // },
            // markLine: {
            //   lineStyle: {
            //     type: "solid",
            //   },
            //   data: [{ type: "average", name: "AVG" }, { xAxis: 160 }],
            // },
          },
          {
            name: "女",
            type: "scatter",
            itemStyle: {
              normal: {
                color: "rgba(255,0,255,0.8)",
              },
            },
            emphasis: {
              focus: "series",
            },
            // prettier-ignore
            data: [[161.2, 51.6], [167.5, 59.0], [159.5, 49.2], [157.0, 63.0], [155.8, 53.6],
            [170.0, 59.0], [159.1, 47.6], [166.0, 69.8], [176.2, 66.8], [160.2, 65.2],
            [162.5, 55.2], [160.9, 54.2], [172.9, 62.5], [153.4, 42.0], [160.0, 50.0],
            [147.2, 49.8], [168.2, 49.2], [165.0, 65.2], [157.0, 47.8], [167.6, 68.8],
            [159.5, 50.6], [175.0, 62.5], [166.8, 57.2], [176.5, 62.8], [170.2, 62.8],
            [174.0, 54.5], [173.0, 59.8], [179.9, 67.3], [160.5, 67.8], [160.0, 47.0],
            [154.4, 46.2], [162.0, 55.0], [176.5, 83.0], [160.0, 54.4], [152.0, 45.8],
            [162.1, 53.6], [170.0, 61.2], [160.2, 52.1], [161.3, 67.9], [166.4, 56.6],
            [168.9, 62.3], [163.8, 58.5], [167.6, 54.5], [160.0, 50.2], [161.3, 60.3],
            [167.6, 58.3], [165.1, 56.2], [160.0, 50.2], [170.0, 61.9], [157.5, 59.8],
            [167.6, 61.0], [160.7, 69.1], [163.2, 55.9], [152.4, 46.5], [157.5, 54.3],
            [168.3, 54.8], [180.3, 60.7], [165.5, 60.0], [165.0, 62.0], [164.5, 60.3],
            [156.0, 52.7], [160.0, 64.3], [163.0, 62.0], [165.7, 63.1], [161.0, 80.0],
            [162.0, 54.7], [166.0, 53.2], [174.0, 75.7], [162.7, 55.1], [167.6, 55.7],
            [151.1, 48.7], [164.5, 52.3], [163.5, 50.0], [152.0, 59.3], [169.0, 62.5],
            [164.0, 55.7], [161.2, 54.8], [155.0, 45.9], [170.0, 60.6], [176.2, 67.2],
            [170.0, 69.4], [162.5, 58.2], [170.3, 64.8], [164.1, 61.6], [169.5, 52.8],
            [163.2, 59.8], [154.5, 49.0], [159.8, 50.0], [173.2, 69.2], [170.0, 55.9],
            [161.4, 63.4], [169.0, 58.2], [166.2, 58.6], [159.4, 45.7], [162.5, 52.2],
            [159.0, 48.6], [162.8, 57.8], [159.0, 55.6], [179.8, 66.8], [162.9, 59.4],
            [161.0, 53.6], [151.1, 53.2], [168.2, 53.4], [168.9, 69.0], [163.2, 55.4],
            [171.8, 56.2], [178.0, 63.6], [164.3, 59.8], [163.0, 62.0], [168.5, 65.2],
            [166.8, 56.6], [162.7, 55.6], [163.5, 51.8], [169.4, 63.4], [167.8, 59.0],
            [159.5, 47.6], [167.6, 63.0], [161.2, 55.2], [160.0, 45.0], [163.2, 54.0],
            [162.2, 50.2], [161.3, 60.2], [149.5, 44.8], [157.5, 58.8], [163.2, 56.4],
            [162.7, 52.0], [155.0, 49.2], [156.5, 67.2], [164.0, 53.8], [160.9, 54.4],
            [162.8, 58.0], [167.0, 59.8], [160.0, 54.8], [160.0, 43.2], [168.9, 60.5],
                  ],
          },
        ],
      });
     _this.studentChart4.setOption({
        title: {
          x: "center",
          text: "新生男女百分比",
          textStyle: {
            color: "#024f9b",
            opacity: 0.6,
          },
        },
        legend: {
          orient: "horizontal",
          x: "center",
          y: 180,
        },
        tooltip: {},
        series: [
          {
            itemStyle: {
              normal: {
                color: function (colors) {
                  const colorList = [
                    "rgba(0,100,255,0.8)",
                    "rgba(255,0,255,0.8)",
                  ];
                  return colorList[colors.dataIndex];
                },
              },
            },
            type: "pie", // 类型： 饼图
            data: [
              {
                name: "男",
                value:_this.data[0].num,
              },
              {
                name: "女",
                value:_this.data[1].num,
              },
            ], //数据
            label: {
              //饼图文字的显示
              show: true, //默认  显示文字
              formatter: function (arg) {
                return arg.name;
              },
            },
            radius: 60, //饼图的半径
            // radius: '20%' //百分比参照的事宽度和高度中较小的那一部分的一半来进行百分比设置
            // 圆环
            // radius: ['50%','80%']
  
            // 南丁格尔图  饼图的每一个部分的半径是不同的
            // roseType: 'radius',
            // selectedMode: 'single' //选中的效果，能够将选中的区域偏离圆点一小段距离
            selectedMode: "multiple",
            selectedOffset: 30,
          },
        ],
      });
      _this.studentChart1.setOption(
        {
          title: {
            text: '新生人数',
            top:"10%",
            textStyle: {
              color: "#024f9b",
              opacity: 0.6,
            },
          },
          tooltip: {
            // trigger: 'axis'
          },
          legend: {
            data: [ '总数', '男生', '女生'],
            top:"10%",
            left:"27%"
          },
          grid: {
            left: '3%',
            right: '4%',
            bottom: '3%',
            containLabel: true
          },
          toolbox: {
            show: true,
            left:'85%',
            feature: {
              
              dataView: { show: true, readOnly: false },
              saveAsImage: { show: true }
            }
          },
          xAxis: {
            type: 'category',
            boundaryGap: false,
            data: [ '2019', '2020', '2021', '2022', '2023']
          },
          yAxis: {
            type: 'value'
          },
          series: [
            {
              name: '总数',
              type: 'line',

              data: [ 9670, 5982+4146, 5211+3439, 5097+3294, 8045]
            },
            {
              name: '男生',
              type: 'line',

              data: [ 5779, 5982, 5211, 5097, 4974]
            },
            {
              name: '女生',
              type: 'line',

              data: [ 3891, 4146, 3439, 3294, 3071]
            }
          ]
        }

      );
      //做环形图的本质是 radius: ['内半径', '外半径'] 内半径!=0

const title = {
  text: '各学院学生人数',
  textStyle: {
    color: '#024f9b',
    fontSize: 26,
    opacity: 0.6,
  },
  padding: 0,
  top: 15,
  left: '20%',
};

// const tooltip = {
//   show: true,
//   formatter: '{b}:{d}%',
// };

      _this.studentChart2.setOption(
        // {

   
        //   title,
        //   tooltip,
 
          
        //   series: [
        //     {
        //       name: '各学院学生人数',
        //       type: 'pie',
        //       center: ['50%', '50%'], //圆心的位置
        //       top: '2%', //单单指的饼图距离上面的距离，top越大饼图越小
        //       left: '0%', //单单指的饼图距离左面的距离，会改变饼图的大小
        //       radius: ['40%', '70%'], //环形图的本质就在这里 [内半径!=0，外半径] 外半径越大，圆越大
        //        avoidLabelOverlap: false, //做同心圆用到
        //       clockwise: true, //顺时针排列
        //       startAngle: 90, //起始角度 影响不大
        //       //roseType:"", // 实心圆 不能出现roseType这个属性
              
        //       label: {
        //         show: false, //false不显示饼图上的标签
        //         position: 'center', //inside（在饼图上显示）,outside(默认就会出现引导线) center
        //         formatter: '{b}:{c}',
        //       },
              
        //       itemStyle: {
        //         //每个扇形的设置
        //         borderColor: 'rgba(0,0,0,.1)', //扇形边框颜色
        //         borderWidth: 1, //扇形边框大小 要先给borderColor颜色 设置borderWidth才会有效果
               
        //       },
        //       data: [
        //         { value: 2198, name: '地科院' },
        //         { value: 1835, name: '核自院' },
        //         { value: 1680, name: '管科院' },
        //         { value: 1619, name: ' 计网牛' },
        //         { value: 1556, name: ' 文法院' },
        //         { value: 1531, name: ' 机电院' },
        //         { value: 1479, name: ' 外院' },
        //         { value: 1453, name: ' 传艺院' },
        //         { value: 1372, name: '地物院' },
        //         { value: 1370, name: ' 旅规院' },
        //       ].sort((a, b) => b.value - a.value), //数组从大到小排序
        
        //       emphasis: {
        //         scale: true,
        //         scaleSize: 10,
        //         //同心圆单独加上的
        //          label: {
        //           show: true,
        //           fontSize: 24,
        //           fontWeight: 'bold'
        //         },
        //          //启用鼠标放上去放大效果，这个挺好的
        //         itemStyle: {
        //           shadowBlur: 10,
        //           shadowOffsetX: 0,
        //           shadowColor: 'rgba(0, 0, 0, 0.5)',
        //         },
        //       },
        //     },
        //   ],
        // },
       { title,
        toolbox: {
          show: true,
          left:'80%',
          feature: {
            
            dataView: { show: true, readOnly: false },
            saveAsImage: { show: true }
          }
        },
          xAxis: {
            type: 'category',
            data: [
              '地科院',
              '核自院',
              '管科院',
              '计网牛',
              '文法院',
              '机电院',
              '外院',
              '传艺院',
              '旅规院',
              '地物院',
            ]
          },
          yAxis: {
            type: 'value'
          },
          tooltip: {
         
          },
          series: [
            {
              data: [2120, 1875, 1468, 1684, 1289, 1931, 1590, 1234,1832,1729 ],
              type: 'bar'
            }
          ]
        }
        
              );
    }
    if(this.data){
      chart()
    }else{
      axios.get("http://129.226.146.111:8081/poi/detail").then(function(res){
        _this.data=res.data.data
        _this.i=res.data.data.length
        }).then(()=>{
          for( let n =0;n<_this.i;n++){
            _this.arr.push(_this.data[n].num)
          }
        }
        ).then(()=>{
          chart()
        })
    }

  }
}
export default student;
