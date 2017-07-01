import axios from 'axios';
import moment from 'moment';
import { textParse } from '../utils/utils'

const MOCK_API = 'http://127.0.0.1:5001/mock'

export function getUser(){
    return "lll";
}

export function getData(beginTime, endTime){
    const beginTimeString = moment(beginTime).format("YYYY-MM-DD");
    const endTimeString = moment(endTime).format("YYYY-MM-DD");
    const url = `http://card.pku.edu.cn/CardManage/CardInfo/TrjnList?beginTime=${beginTimeString}&endTime=${endTimeString}&type=1`;
    let return_datas = [];
    return new Promise(function(resolve, reject){
                    axios({
                        url,
                        method: 'GET'
                    }).then(res=>{
                        const data = res.data;
                        const lastIndex = parseInt(getLastIndex(data), 10);
                        if(lastIndex > 0){
                            const promise_list = [];
                            for(let i=1; i<= lastIndex; i++){
                                promise_list.push(getAllData(url, i));
                            }
                            Promise.all(promise_list)
                                .then(([...datas])=>{
                                    return_datas = datas.map((item, index, array)=>{
                                        return textParse(item)
                                    });
                                    resolve(return_datas);
                                });
                        }else{
                            return_datas =  textParse(data);
                            resolve(return_datas);
                        }
                        
                    }).catch(err=>{
                        console.log(err)
                    });
        });
}   

export function getAllData(url, lastIndex){
    const now_url = url + `&pageindex=${lastIndex}`
    return axios({
        url: now_url,
        method: 'GET'
    })

}

export function getLastIndex(data){
    const result = /pageindex\=([0-9]+)\"\>尾页/mg.exec(data);
    if(result){
        return result[1];
    }else{
        return 0;
    }
}

export function getMockData(){
    const data = {"test":"1"}

    return axios({
        url: MOCK_API,
        method: 'POST',
        data
    })
}