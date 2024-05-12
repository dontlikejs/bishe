class car{
  constructor(options){
    this.carChart1=options.carChart1
    this.carChart2=options.carChart2
  }
  carInfo(){
    this.carChart1.setOption({
      title:{
        x:'center',
        text:'一周流入车辆统计',
        textStyle:{
          color:'#024f9b',
          opacity:0.6,
        }
      },
      legend:{
        orient:'horizontal',
        x:'center',
        y:25
      },
      xAxis:{
        data:['周一','周二','周三','周四','周五','周六','周日']
      },
      yAxis:{

      },
      tooltip:{

      },
      series:[
        {
          name:'蓝色车牌',
          type:'bar',
          data:[40,42,22,28,32,18,20]
        },
        {
          name:'绿色车牌',
          type:'bar',
          data:[21,23,15,12,18,15,16]
        },
        {
          name:'黄色车牌',
          type:'bar',
          data:[5,11,6,2,3,8,8]
        },
      ],
    })
    this.carChart2.setOption({
      title:{
        x:'center',
        text:'2022年入校车辆停放时常统计',
        textStyle:{
          color:'#024f9b',
          opacity:0.6,
        }
      },
      legend:{
        orient:'horizontal',
        x:'center',
        y:160
      },
      tooltip:{

      },
      series:[
        {
            type: 'pie', // 类型： 饼图
            data: [
              {
                  name: '0-2h',
                  value: '1100'
              },
              {
                  name: '2-4h',
                  value: '2800'
              },
              {
                  name: '4-8h',
                  value: '4500'
              },
              {
                  name: '8-12h',
                  value: '2202'
              },
              {
                  name: '12-16h',
                  value: '2421'
              },
              {
                  name: '16-20h',
                  value: '800'
              },
              {
                name: '20-24h',
                value: '800'
              },
              {
                name: '24h以上',
                value: '800'
            }
          ],//数据
            label: {//饼图文字的显示
                show: true, //默认  显示文字
                formatter: function (arg) {
                    return arg.name 
                }
            },
            radius: 40 ,//饼图的半径
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
  }
}
export default car;