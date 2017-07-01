import React, { Component } from "react";
import { Modal, Button, Spin, DatePicker, message, Icon } from "antd";
import { Tooltip } from 'antd';

import moment from "moment";

import "../../node_modules/antd/lib/modal/style/index.less";
import "../../node_modules/antd/lib/button/style/index.less";
import "../../node_modules/antd/lib/spin/style/index.less";
import "../../node_modules/antd/lib/message/style/index.less";

import CardDataTable from "../components/CardDataTable";
import ConsumeChart from "../components/ConsumeChart";

import "../styles/MyDialogModal.scss";

// import { textParse } from "../utils/utils";
import { getMockData,getData } from "../apis/apis";

const { RangePicker } = DatePicker;
const text = <span>由于学校接口限制，最早为2015-11-01日。</span>;
export default class MyDialogModal extends Component {
    state = {
        visible: false,
        data: [],
        beginTime: moment().startOf("month"),
        endTime: moment(),
        loading: false
    };

    constructor(props) {
        super(props);
        this.dateChange = this.dateChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    // componentWillMount() {
    //   getMockData()
    //     .then(res => {
    //       const data = res.data;
    //       this.setState ({
    //         data
    //       });
    //     })
    // }

    showModal = () => {
        this.setState({
            visible: true
        });
    };

    handleOk = e => {
        this.setState({
            visible: false
        });
    };

    handleCancel = e => {
        this.setState({
            visible: false
        });
    };

    handleSubmit = e => {
        let data_list = [];
        this.setState({
            loading: true
        });
        // getMockData()
        //     .then(res => {
        //         message.success("数据已取回");
        //         this.setState({
        //             data: res.data,
        //             loading: false
        //         });
        //     })
        //     .catch(err => {
        //         message.error(err);
        //     });
        getData(this.state.beginTime, this.state.endTime)
          .then(res=>{
            data_list = res;
            let data = [];
            // console.log(data_list);
            if(data_list.length > 0){
              data = data_list.reduce((accur, item)=>{
                // console.log(item);
                return accur.concat(item.data);
              }, []);
            }else{
              data =[];
            }
            // console.log(data, 71)
            this.setState({
                data,
                loading: false
            })
        });
    };

    dateChange(date) {
        this.setState({
            beginTime: date[0],
            endTime: date[1]
        });
    }

    disabledDate(current) {
        const before_time = moment("2015-11-01");
        return (
            current.valueOf() > Date.now() || current.valueOf() < before_time
        );
    }

    render() {
        const modelHeader = (
            <div>
                <span>校园卡消费记录</span>
            </div>
        );
        return (
            <div>
                <span  onClick={this.showModal}>
                    <Icon type="pie-chart" style={{ fontSize: 25, color:'#c3c3c3' }}/>
                    <Button id="card-vis-button" style={{ fontSize: 15 }}>
                        PKUCard-helper
                    </Button>
                </span>

                <Modal
                    title={modelHeader}
                    visible={this.state.visible}
                    onOk={this.handleOk}
                    onCancel={this.handleCancel}
                    width="75%"
                    height="100%"
                    style={{ top: 65 }}
                    footer={<span>Good Bye </span>}>
                    <div className="vis-custom">
                        <div>
                            <span style={{ marginRight: 20 }}>时间选择</span>
                            <RangePicker
                                onChange={this.dateChange}
                                ranges={{
                                    今天: [moment(), moment()],
                                    本月: [moment().startOf("month"), moment()],
                                    本年: [moment().startOf("year"), moment()],
                                    过去一年: [
                                        moment().subtract(1, "years"),
                                        moment()
                                    ]
                                }}
                                disabledDate={this.disabledDate}
                            />
                            <Button
                                onClick={this.handleSubmit}
                                style={{ marginLeft: 20 }}>
                                确定
                            </Button>
                            <Tooltip placement="right" title={text} >
                                <span style={{ fontSize:16, marginLeft: 20 }}> <a href="#"><Icon type="info-circle-o" /></a> </span>
                            </Tooltip>
                            <span style={{color:"red"}}>*由于学校接口巨慢无比，请耐心等待(一年的数据3min吧)，如有错误，刷新重试</span>

                        </div>
                        <Spin
                            tips="Loading..."
                            spinning={this.state.loading}
                            delay={100}>
                            {this.state.data.length > 0 &&
                                this.state.endTime &&
                                <ConsumeChart {...this.state} />}
                            <CardDataTable {...this.state} />
                        </Spin>
                    </div>
                </Modal>
            </div>
        );
    }
}
