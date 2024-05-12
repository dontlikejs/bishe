import * as echarts from "echarts";
class people {
  constructor(options) {
    this.peopleChart1 = options.peopleChart1;
    this.peopleChart2 = options.peopleChart2;
  }
  peopleInfo() {
    this.peopleChart1.setOption({
      legend: {
        top:"80%" ,
      },
      toolbox: {
        show: false,
      },
        tooltip: {
        trigger: 'item',
        formatter: '{b}: {d}%',
        backgroundColor: 'rgba(47,37,1308,0.75)',
         borderColor :'#2880FF',
          borderWidth: 1,
          textStyle:{
             color  :'#fff'
          }
      },
      series: [
        {
          name: 'Nightingale Chart',
          type: 'pie',
          radius: ['40%','75%'],
          center: ['50%', '40%'],
          roseType: 'area',
          label: {show:false},
          labelLine: {show:false},
           selectedOffset :30,
          selectedMode: true,
          itemStyle: {
            borderRadius: 8
          },
          data: [
            { value: 506, name: '学生' },
            { value: 125, name: '教职工' },
            { value: 187, name: '职工' },
            { value: 211, name: '其他' },
            { value: 187, name: '职工' },
            { value: 211, name: '其他' },
          ]
        }
      ]
    });
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
    this.peopleChart2.setOption({
      color: ['#1A64F8'],
      tooltip: {
        trigger: 'axis',
        axisPointer: {
          type: 'none',
        },
        formatter: function (prams) {
          return prams[0].name + ':' + prams[0].data;
        },
      },
      legend: {
        data: ['进校', '出校'],
        icon: 'rect',
        top: 1,
        right: '6%',
        itemGap: 20,
        itemWidth: 12,
        itemHeight: 8,
      },
      grid: {
        left: '16%',
        right: '3%',
        top: '16%',
        bottom: '28%',
      },
      xAxis: [
        {
          type: 'category',
          data: landData.map((item) => {
            return item.name;
          }),
          axisTick: {
            alignWithLabel: true,
          },
          axisLabel: {
            color: '#606266',
            interval: 0,
            margin: 5,
            align: 'center',
          },
        },
      ],
      yAxis: {
        axisLine: {
          show: false,
        },
        axisTick: {
          show: false,
        },
        axisLabel: {
          color: '#606266',
        },
        splitLine: {
          show: true,
          lineStyle: {
            type: 'dashed',
          },
        },
      },
      series: [
        // 梯田
        {
          name: '进校',
          type: 'bar',
          backgroundStyle: {
            color: 'rgba(216, 229, 247, 0.55)',
            borderRadius: [8, 8, 0, 0],
          },
          itemStyle: {
            normal: {
              borderRadius: [12, 12, 0, 0],
              color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                {
                  offset: 1,
                  color: '#74A3FF',
                  opacity: 0.85,
                },
                {
                  offset: 0,
                  color: '#ADDAFF',
                  opacity: 0.79,
                },
              ]),
              // barBorderRadius: 11,
            },
          },
          barWidth: '20',
          label: {
            show: true,
            color: '#74A2FF',
            position: 'outside',
          },
          data: fieldData.map((item) => {
            return item.value;
          }),
        },
        // 坡地
        {
          name: '出校',
          type: 'bar',
          backgroundStyle: {
            color: 'rgba(216, 229, 247, 0.55)',
            borderRadius: [8, 8, 0, 0],
          },
          itemStyle: {
            normal: {
              borderRadius: [12, 12, 0, 0],
              color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                {
                  offset: 1,
                  color: '#1FB8AC',
                  opacity: 0.85,
                },
                {
                  offset: 0,
                  color: '#7FE3A6',
                  opacity: 0.79,
                },
              ]),
              // barBorderRadius: 11,
            },
          },
          barWidth: '20',
          label: {
            show: true,
            color: '#42C3B9',
            position: 'outside',
          },
          data: landData.map((item) => {
            return item.value;
          }),
        },
      ],
    });
  }
}
export default people;
