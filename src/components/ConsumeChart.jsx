import React, {Component} from "react";
import {Row, Col} from 'antd';
import crossfilter from 'crossfilter';
import moment from 'moment';
import ReactEcharts from 'echarts-for-react';  
import echarts from 'echarts';

const colorPalette = [
        '#C1232B','#27727B','#FCCE10','#E87C25','#B5C334',
        '#FE8463','#9BCA63','#FAD860','#F3A43B','#60C0DD',
        '#D7504B','#C6E579','#F4E001','#F0805A','#26C0C0'
    ];

const theme = {

    color: colorPalette,

    title: {
        textStyle: {
            fontWeight: 'normal',
            color: '#27727B'
        }
    },

    visualMap: {
        color:['#C1232B','#FCCE10']
    },

    toolbox: {
        iconStyle: {
            normal: {
                borderColor: colorPalette[0]
            }
        }
    },

    tooltip: {
        backgroundColor: 'rgba(50,50,50,0.5)',
        axisPointer : {
            type : 'line',
            lineStyle : {
                color: '#27727B',
                type: 'dashed'
            },
            crossStyle: {
                color: '#27727B'
            },
            shadowStyle : {
                color: 'rgba(200,200,200,0.3)'
            }
        }
    },

    dataZoom: {
        dataBackgroundColor: 'rgba(181,195,52,0.3)',
        fillerColor: 'rgba(181,195,52,0.2)',
        handleColor: '#27727B'
    },

    categoryAxis: {
        axisLine: {
            lineStyle: {
                color: '#27727B'
            }
        },
        splitLine: {
            show: false
        }
    },

    valueAxis: {
        axisLine: {
            show: false
        },
        splitArea : {
            show: false
        },
        splitLine: {
            lineStyle: {
                color: ['#ccc'],
                type: 'dashed'
            }
        }
    },

    timeline: {
        lineStyle: {
            color: '#27727B'
        },
        controlStyle: {
            normal: {
                color: '#27727B',
                borderColor: '#27727B'
            }
        },
        symbol: 'emptyCircle',
        symbolSize: 3
    },

    line: {
        itemStyle: {
            normal: {
                borderWidth:2,
                borderColor:'#fff',
                lineStyle: {
                    width: 3
                }
            },
            emphasis: {
                borderWidth:0
            }
        },
        symbol: 'circle',
        symbolSize: 3.5
    },

    candlestick: {
        itemStyle: {
            normal: {
                color: '#C1232B',
                color0: '#B5C334',
                lineStyle: {
                    width: 1,
                    color: '#C1232B',
                    color0: '#B5C334'
                }
            }
        }
    },

    graph: {
        color: colorPalette
    },

    map: {
        label: {
            normal: {
                textStyle: {
                    color: '#C1232B'
                }
            },
            emphasis: {
                textStyle: {
                    color: 'rgb(100,0,0)'
                }
            }
        },
        itemStyle: {
            normal: {
                areaColor: '#ddd',
                borderColor: '#eee'
            },
            emphasis: {
                areaColor: '#fe994e'
            }
        }
    },

    gauge: {
        axisLine: {
            lineStyle: {
                color: [[0.2, '#B5C334'],[0.8, '#27727B'],[1, '#C1232B']]
            }
        },
        axisTick: {
            splitNumber: 2,
            length: 5,
            lineStyle: {
                color: '#fff'
            }
        },
        axisLabel: {
            textStyle: {
                color: '#fff'
            }
        },
        splitLine: {
            length: '5%',
            lineStyle: {
                color: '#fff'
            }
        },
        title : {
            offsetCenter: [0, -20]
        }
    }
};

echarts.registerTheme('infographic', theme);

export default class ConsumeChart extends Component{
	constructor(props){
        super(props)
        this.state = {
            datas: [],
            loading: true,
            begin_time: '2017-02-01',
            end_time: '2017-03-21'
        }
    }

    getPieOption(){
        const data = this.state.datas;
        let crossfilter_data =  crossfilter(data);
        let messFilter = crossfilter_data.dimension( d=> d["商户名称"]?d["商户名称"]:"others");
        let messMeasure = messFilter.group().reduceSum(d=>{let price = parseFloat(d["交易金额"]); return price>0 ? price : -price;});
        let mess = messMeasure.top(11)
        mess = mess.filter(d=>d.key!="others");
        let x_data = mess.map(d=>d.key);
        let y_pay = mess.map(d=>{ return {"name": d.key, "value":d.value.toFixed(2)}});
        let option = {
            title : {
                text: '南丁格尔玫瑰图Top10',
                textStyle: {
                    fontSize: 12
                }
            },
            tooltip : {
                trigger: 'item',
                formatter: "{a} <br/>{b} : {c} ({d}%)"
            },
            toolbox: {
                show : true,
                feature : {
                    mark : {show: true},
                    dataView : {show: true, readOnly: false},
                    magicType : {
                        show: true,
                        type: ['pie', 'funnel']
                    },
                    restore : {show: true},
                    saveAsImage : {show: true}
                }
            },
            calculable : true,
            series : [
                {
                    name:'食堂分布玫瑰图Top10',
                    type:'pie',
                    radius : [60, 110],
                    center : ['50%', '55%'],
                    roseType : 'area',
                    data:y_pay
                }
            ]
        };
        return option;
    }
    getLineDayOption(){
         const data = this.state.datas;
        let crossfilter_data =  crossfilter(data);
        let dayFilter = crossfilter_data.dimension( d=> moment(d["交易时间"],"YYYY/M/D h:mm:s").format("YYYY-MM-DD"))
        let payMeasure = dayFilter.group().reduceSum(d=>{let price = parseFloat(d["交易金额"]); return price<0? price : 0;});
        let incomeMeasure = dayFilter.group().reduceSum(d=>{let price = parseFloat(d["交易金额"]); return price>0? price/2 : 0;});
        let pay1 = payMeasure.top(Infinity)
        let income = incomeMeasure.top(Infinity).sort((a, b)=> +(a.key > b.key) || +(a.key === b.key) - 1);
        let pay = pay1.sort((a, b)=> +(a.key > b.key) || +(a.key === b.key) - 1);
        let x_data = pay.map(d=>d.key);
        let y_pay = pay.map(d=>0-d.value.toFixed(2));
        let y_income = income.map(d=>d.value.toFixed(2));

        let option = {
            title : {
                text: '消费和充值',
                textStyle:{
                    fontSize: 12
                }
            },
            tooltip : {
                trigger: 'axis',
                orient: 'vertical',
            },
            toolbox: {
                show : true,
                feature : {
                    mark : {show: true},
                    dataView : {show: true, readOnly: false},
                    magicType : {
                        show: true,
                        type: ['pie', 'funnel']
                    },
                    restore : {show: true},
                    saveAsImage : {show: true}
                }
            },
            legend: {
                data:['消费','充值'],
                x : 'center',
                y : 'bottom',
                bottom: 0
            },
            grid: {
                left: '3%',
                right: '4%',
                bottom: '8%',
                containLabel: true
            },
            xAxis : [
                {
                    type : 'category',
                    data : x_data
                }
            ],
            yAxis : [
                {
                    type : 'value'
                }
            ],
            series : [
                {
                    name:'消费',
                    type:'bar',
                    data: y_pay
                },
                {
                    name:'充值',
                    type:'bar',
                    data: y_income
                },
            ]
        };
        return option;
    }
    getLineOption(){
        const data = this.state.datas;
        let crossfilter_data =  crossfilter(data);
        let monthFilter = crossfilter_data.dimension( d=> moment(d["交易时间"],"YYYY/M/D h:mm:s").format("YYYY-MM"))
        let payMeasure = monthFilter.group().reduceSum(d=>{let price = parseFloat(d["交易金额"]); return price<0? price : 0;});
        let incomeMeasure = monthFilter.group().reduceSum(d=>{let price = parseFloat(d["交易金额"]); return price>0? price/2 : 0;});
        let pay1 = payMeasure.top(Infinity)
        let income = incomeMeasure.top(Infinity).sort((a, b)=> +(a.key > b.key) || +(a.key === b.key) - 1);
        let pay = pay1.sort((a, b)=> +(a.key > b.key) || +(a.key === b.key) - 1);
        let x_data = pay.map(d=>d.key);
        let y_pay = pay.map(d=>0-d.value.toFixed(2));
        let y_income = income.map(d=>d.value.toFixed(2));

        let option = {
            title : {
                text: '消费和充值',
                textStyle:{
                    fontSize: 12
                }
            },
            tooltip : {
                trigger: 'axis',
                orient: 'vertical',
            },
            toolbox: {
                show : true,
                feature : {
                    mark : {show: true},
                    dataView : {show: true, readOnly: false},
                    magicType : {
                        show: true,
                        type: ['pie', 'funnel']
                    },
                    restore : {show: true},
                    saveAsImage : {show: true}
                }
            },
            legend: {
                data:['消费','充值'],
                x : 'center',
                y : 'bottom',
                bottom: 0
            },
            grid: {
                left: '3%',
                right: '4%',
                bottom: '8%',
                containLabel: true
            },
            xAxis : [
                {
                    type : 'category',
                    data : x_data
                }
            ],
            yAxis : [
                {
                    type : 'value'
                }
            ],
            series : [
                {
                    name:'消费',
                    type:'bar',
                    data: y_pay
                },
                {
                    name:'充值',
                    type:'bar',
                    data: y_income
                },
            ]
        };
        return option;

    }

    componentWillMount() {
        this.setState({
            datas: this.props.data,
            begin_time: this.props.beginTime.format('YYYY-MM-DD'),
            end_time: this.props.endTime.format('YYYY-MM-DD')
        });  
    }

    componentWillReceiveProps(nextProps) {
        this.setState({
            datas: nextProps.data,
            begin_time: nextProps.beginTime.format('YYYY-MM-DD'),
            end_time: nextProps.endTime.format('YYYY-MM-DD')
        });
    }

    getAllMoney(){
        const data = this.state.datas;
        let crossfilter_data =  crossfilter(data);
        let payFilter = crossfilter_data.dimension( d=> d["交易金额"]);
        const result1 = payFilter.groupAll().reduceSum(d=> {let price = parseFloat(d["交易金额"]); return price>0? price/2 : 0;} )
        const result2 = payFilter.groupAll().reduceSum(d=> {let price = parseFloat(d["交易金额"]); return price<0? -price : 0;} )
        return [result1.value(), result2.value()];
    }


    render(){
        const day_or_month = (moment(this.state.end_time) - moment(this.state.begin_time)) > 2678400000;
        return <div style={{marginTop:20}}>
                    <Row>
                        <div style={{fontSize:"120%"}}>
                            在{this.state.begin_time}~{this.state.end_time}这段是时间里，总共充值为<span className="bigger">{this.getAllMoney()[0].toFixed(2)}</span>，总计消费
                            <span className="bigger">{this.getAllMoney()[1].toFixed(2)}</span>.
                        </div>
                        <Col span={12}>
                            <ReactEcharts
                              option={day_or_month ? this.getLineOption(): this.getLineDayOption()}
                              notMerge={true}
                              lazyUpdate={true}
                              theme={"infographic"}
                            />
                        </Col>
                        <Col span={12}>
                            <ReactEcharts
                              option={ this.getPieOption()}
                              notMerge={true}
                              lazyUpdate={true}
                              theme={"infographic"}
                            />
                        </Col>
                    </Row>
                </div>
        
    }
}