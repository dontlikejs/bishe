import axios from "axios";
class tem {
  constructor(options) {
    this.temChart1 = options.temChart1;
    this.temChart2 = options.temChart2;
    this.city = '成华';
    // this.tmpOld = null;
    // this.briefOld = null;
    this.weatherInfo = null;
 
    this.key = 'e290b35324554ea7bf499dad340ea3ab';
  }
 async temInfo() {
    let httpUrl = `https://geoapi.qweather.com/v2/city/lookup?location=${this.city}&key=${this.key}`
    let res = await axios.get(httpUrl)
    console.log(res.data)

    let id = res.data.location[0].id
    //根据城市id获取具体的天气https://api.qweather.com/v7/weather/7d?[请求参数]
    let httpUrl2 = `https://devapi.qweather.com/v7/weather/7d?location=${id}&key=${this.key}`
    let res2 = await fetch(httpUrl2)
    let result2 = await res2.json()

    let httpUrl1 = `https://devapi.qweather.com/v7/indices/1d?type=1,8,9,10&location=${id}&key=${this.key}`
    let res1 = await fetch(httpUrl1)
    let result1 = await res1.json()

    let httpUrl3 = `    https://devapi.qweather.com/v7/air/now?location=${id}&key=${this.key}`
    let res3 = await fetch(httpUrl3)
    let result3 = await res3.json()

    // let httpUrl1 = `https://devapi.qweather.com/v7/weather/now?location=${id}&key=${this.key}`
    // let res1 = await fetch(httpUrl1)
    // let result1 = await res1.json()
    // let now = result1.now
    // this.tmpNew =now.temp
    // this.briefNew = now.text
    // this.daily=result1.daily

    this.temChart1.setOption({
      title: {
        text: "本周气温",
        textStyle: {
          color: "#024f9b",
          opacity: 0.6,
        },
      },
      tooltip: {
        trigger: "axis",
      },
      legend: {
        y: 200,
      },
      toolbox: {
        show: true,
        feature: {
          dataView: { show: true, readOnly: false },
          magicType: { show: true, type: ['line', 'bar'] },
          restore: { show: true },
          saveAsImage: { show: true }
        }
      },
    
      xAxis: {
        type: "category",
        boundaryGap: false,
        data: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
      },
      yAxis: {
        type: "value",
        axisLabel: {
          formatter: "{value} °C",
        },
      },
      series: [
        {
          name: "Highest",
          type: "line",
          data: [result2.daily[0].tempMax, result2.daily[1].tempMax,result2.daily[2].tempMax, result2.daily[3].tempMax, result2.daily[4].tempMax, result2.daily[5].tempMax, result2.daily[6].tempMax],
          markPoint: {
            data: [
              { type: "max", name: "Max" },
              { type: "min", name: "Min" },
            ],
          },
          markLine: {
            data: [{ type: "average", name: "Avg" }],
          },
        },
        {
          name: "Lowest",
          type: "line",
          data: [result2.daily[0].tempMin, result2.daily[1].tempMin,result2.daily[2].tempMin, result2.daily[3].tempMin, result2.daily[4].tempMin, result2.daily[5].tempMin, result2.daily[6].tempMin],
          markPoint: {
            data: [
              { type: "max", name: "Max" },
              { type: "min", name: "Min" },
            ],
          },
          markLine: {
            data: [
              { type: "average", name: "Avg" },
              [
                {
                  symbol: "none",
                  x: "90%",
                  yAxis: "max",
                },
                {
                  symbol: "circle",
                  label: {
                    position: "start",
                    formatter: "Max",
                  },
                  type: "max",
                  name: "最高点",
                },
              ],
            ],
          },
        },
      ],
    });

    this.temChart2.setOption( {
      title: {
        text: '污染物指数',
        textStyle: {
          color: "#024f9b",
          opacity: 0.6,
        },
      },
      splitArea: {
        //设置渐变背景色
        areaStyle: {
          color: [            'rgba(210,89,140,0.8)',
            'rgba(210,89,140,0.8)',
            'rgba(210,89,140,0.8)',
            'rgba(210,89,140,0.8)',
            'rgba(11,89,140,0.2)'],
          shadowColor: 'rgba(0,0,0,0.3)',
          shadowBlur: 10
        }
      },
      radar: {
        // shape: 'circle',
        indicator: [
          { name: 'AQI', max: 142,color:'#008bf8' },
          { name: 'PM2.5', max: 97 ,color:'#008bf8'},
          { name: 'PM10', max: 143 ,color:'#008bf8'},
          { name: 'SO2', max: 7,color:'#008bf8' },
          { name: 'NO2', max: 99,color:'#008bf8' },
          { name: 'CO', max: 1.7 ,color:'#008bf8'},
    
        ]
      },
      series: [
        {
          name: '污染物指数',
          type: 'radar',
          data: [
            {
              value: [result3.now.aqi, result3.now.pm2p5, result3.now.pm10, result3.now.so2, result3.now.no2, result3.now.co],
              name: '污染物指数',
              label: {
                show: true,
                formatter: function (params) {
                  return params.value;
                }
              }
            },
            
          ]
        }
      ]
    });
  }
}
export default tem;
