import React, {Component} from "react";
import {BootstrapTable, TableHeaderColumn} from 'react-bootstrap-table';
import moment from 'moment'
import "../styles/CardDataTable.scss"

export default class CardDataTable extends Component{
	constructor(props){
        super(props)
    }

    render(){
    	const { data, endTime, beginTime } = this.props;
        const options = {
                exportCSVText: '下载CSV数据'
              };

        const sortPriceFunc = function(a ,b, order){
            let v_a = Math.abs(parseFloat(a["交易金额"]));
            let v_b = Math.abs(parseFloat(b["交易金额"]))
            if (order === 'desc') {
                return  v_a - v_b ;
            }else{
                return v_b - v_a;
            }
        } 
        const datePriceFunc = function(a,b,order){
            let v_a = moment(a["交易时间"], "YYYY/M/D h:mm:s");
            let v_b = moment(b["交易时间"], "YYYY/M/D h:mm:s");
            if (order === 'desc') {
                return  v_a - v_b ;
            }else{
                return v_b - v_a;
            }
        }
    	return (<div id="card-datatable">
                <BootstrapTable data={data} pagination search exportCSV options={options} csvFileName={`${beginTime.format("YYYY-MM-DD")}-${endTime.format("YYYY-MM-DD")}.csv`}>
                     <TableHeaderColumn dataField="交易时间" isKey width="50px" dataSort sortFunc={datePriceFunc}>交易时间</TableHeaderColumn>
                     <TableHeaderColumn dataField="商户名称" width="100px" dataSort>商户名称</TableHeaderColumn>
                     <TableHeaderColumn dataField="交易名称" width="100px" dataSort>交易名称</TableHeaderColumn>
                     <TableHeaderColumn dataField="交易金额" width="80px" dataSort sortFunc={sortPriceFunc}>交易金额</TableHeaderColumn>
                     <TableHeaderColumn dataField="卡余额" width="50px" >卡余额 </TableHeaderColumn>
                </BootstrapTable>
                </div>);
    }
}