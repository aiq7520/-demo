//0 高亮显示数据点前n名
//1  高亮显示数据点大小控制  最小
//2  高亮显示数据点大小控制  最大
var config = [2,8,15];
var zooms =[1,1,5,10,15];//地图放大级别  第一个数用来记录放大了多少次
/**
 * 此数据为后台格式
 */
var datas = [
             {name:'VPC库',province:'天津',totalCount:18000,nowCount:12000},
             {name:'八号库',province:'天津',totalCount:8000,nowCount:2000,},
             {name:'分部库',province:'天津',totalCount:5000,nowCount:1000,},
             {name:'七号库',province:'天津',totalCount:3000,nowCount:500,},
             {name:'芦潮库',province:'上海',totalCount:3000,nowCount:1000,},
             {name:'南沙库',province:'广东',totalCount:2000,nowCount:12000,}
             ];
//仓库名 省份 仓库库位数  仓库库存数 仓库经维度
/**
 * 此处处理数据点 显示的数据内容
 */
var convertData = function (data) {
    var res = [];
    for (var i = 0; i < data.length; i++) {
        var geoCoord = geoCoordMap[data[i].name];
        if (geoCoord) {
        	geoCoord =  geoCoord.concat(data[i].totalCount);//添加仓库库位数
        	geoCoord =  geoCoord.concat(data[i].nowCount);//添加仓库库位数
            res.push({
                name: data[i].name,//仓库名
                value: geoCoord,
            });
        }
    }
    return res;
};
//对数据点的大小进行控制的方法
function symbolSize (val) {
	var r =val[2] / 1000<config[1]?config[1]:val[2] / 1000;
		r = r>config[2]? config[2]:r;
	return r;
}

$(function(){
	
	var storageCount =datas.length;
	var totalCount =0;
	var nowCount =0;
	
	$.each(datas,function(i,n){
		totalCount = totalCount + datas[i].totalCount;
		nowCount = nowCount +datas[i].nowCount;
	});
	
	$("#storageCount").text(storageCount);
	$("#totalCount").text(totalCount);
	$("#nowCount").text(nowCount);
	
	var myChart = echarts.init(document.getElementById("mapcontainer"));
	var option = {
		title : {
			text : '仓库平面分布图',
			subtext : '副标题',//副标题
			sublink : '',//副标题对应链接
			left : 'center',
			textStyle : {
				color : 'red'//主标题颜色
			}
		},
		    tooltip : {
		    	show:true,
				trigger : 'item'
			},
		geo : {
			type : 'map',
			map : 'china',
			center : [ 104.114129, 35.550339 ],
			zoom : zooms[1],
			scaleLimit:{min:1},
			roam : true,
			label : {
				normal : {
					show : false, //是否显示省份
					//文本样式  
					textStyle : {
						//文本字体颜色  
						color : '#fff'
					}
				},
				emphasis : {
					show : true,//鼠标进入是否显示省份
					//文本样式  
					textStyle : {
						//文本字体颜色  
						color : '#fff'
					}
				}
			},
			roam : true,
			itemStyle : {
				normal : {
					areaColor: '#323c48',
		            borderColor: '#111'
				},
				emphasis : {
					 areaColor: '#2a333d',
					borderColor : '#febe64'
				}
			},
		},
		series : [ {
			dimensions : [ '东经', '北纬', '仓库库位数','仓库库存数' ],
			type : 'effectScatter',
			coordinateSystem : 'geo',
			data : convertData(datas.sort(function(a, b) {//排序
				return b.nowCount - a.nowCount;
			}).slice(0,config[0])),//对前n(2)明高亮显示  config是一个配置数组
			symbolSize :symbolSize,//数据点大小控制的回调方法
			showEffectOn : 'render',
			rippleEffect : {
				brushType : 'stroke'
			},
			hoverAnimation : true,
			label : {
				normal : {
					formatter : '{b}',
					position : 'right',
					show : true
				}
			},
			itemStyle : {
				normal : {
					color : '#f4e925',
					shadowBlur : 5,
					shadowColor : 'black'
				}
			},

		} ,
		{
			dimensions : [ '东经', '北纬', '仓库库位数','仓库库存数' ],
			type : 'scatter',
			coordinateSystem : 'geo',
			data : convertData(datas.sort(function(a, b) {//排序
				return b.nowCount - a.nowCount;
			})),//对前n(2)明高亮显示
			symbolSize :symbolSize,//数据点大小控制的回调方法
			showEffectOn : 'render',
			rippleEffect : {
				brushType : 'stroke'
			},
			hoverAnimation : true,
			label : {
				normal : {
					formatter : '{b}',
					position : 'right',
					show : false
				}
			},
			itemStyle : {
				normal : {
					color : '#f4e925',
					shadowBlur : 5,
					shadowColor : 'black'
				}
			},

		} 
		]
	};
	if (option && typeof option === "object") {
		myChart.setOption(option, true);
	}
	myChart.on('dblclick',function(parmas) {//双击
		if (parmas.componentType=='series') {//仓库点击
			var url = webRoot+encodeURI("/visual/storage-show.htm");
			window.location.href = url;
		}
	});
	 myChart.on('click',function(parmas) {//单击
		 if(parmas.componentType=='series'){
				var i = zooms[0] == zooms.length - 1 ? (zooms[0] = 1): ++zooms[0];
				option.geo.zoom = zooms[i];//放大地图
				option.geo.center = parmas.value;//中心坐标
				myChart.setOption(option, true);
			}
			return;
	}); 
});







