import $ from 'jquery';
import table2json from 'table2json';


export function textParse(content){
    content = content.data ? content.data : content;
    const return_data = { };
    try{
        const table_re_list = /\<table[\s\S]*\<\/table\>/mg.exec(content);
        const table = table_re_list[0]; 
        let dom = $.parseHTML(table); //return dom array
        dom = dom[0];

        const json_data_origin = table2json.parse(dom);

        const json_data = []
        for(let item of json_data_origin){
            let json_item = {}
            let number = 1;
            for(let key in item){
                number++;
                let value = item[key].trim();
                key = key.trim()
                json_item[key] = value.replace(/<[^>]+>/g,"");
            }
            if(number > 2){
                json_data.push(json_item)
            }else{
                return_data.others = json_item
            }
        }
        return_data.data = json_data;
    }catch(e){
        console.log(e);
        console.log(content);
    }
	
    return return_data;
}


export function dataTransform(data){
    return "";
}


