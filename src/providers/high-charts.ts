
import { Injectable } from '@angular/core';
import * as HighCharts from 'Highcharts';
import { Receipt } from '../models/Receipt/Receipt';
/*
  Generated class for the HighChartsProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class HighChartsProvider {
  chart:any;
  receiptList: Receipt[];
  months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'June', 'July', 'Aug', 'Sept', 'Oct', 'Nov', 'Dec'];

  constructor() {

   
  }

  setData(data){
    let val = this.formatData(data);
    this.chart.options.series[0].data = val['data'];
    this.chart.subtitle = val['total'].toFixed(2);
  }

  formatData(data:Receipt[]){
    let mainArr = [];
    let tempArr = [];
    let total = 0;
    data.forEach(x=>{
     
      if (tempArr[x.category]  == null || tempArr[x.category] == undefined){
        tempArr[x.category] = x.transaction.total;
      
      }
      else{
        tempArr[x.category] += (x.transaction.total); 
      
      }
    });

    for (let y in tempArr) {
      mainArr.push( [y, parseFloat(tempArr[y].toFixed(2)) ] );
      total += tempArr[y]
    };

    

    console.log(mainArr);
    return {'data' :mainArr,'total':total } ;
  }

  initChart(data:Receipt[], date) {
  
    let val = this.formatData(data);
    

    this.chart = HighCharts.chart('container', {
      
      tooltip:{
        valueDecimals:2
      },
      chart: {
        type: 'pie'
      },
      title: {
        text: 'Total Expenses for ' +   this.months[parseInt(date.split('-')[1])-1] + " " + date.split('-')[0]
      },
      subtitle:{
        text: "$"+val['total'].toFixed(2)
      },
      plotOptions: {
        pie: {
          shadow: false,
          center: ['50%', '50%']
        }
      },
      credits: {
        enabled: false
      },

      series: [{
        // specific options for this series instance
        name:'Total Expense',
        type: 'pie',
        tooltip: {
          valueDecimals: 2
        },
        data: val['data'],
        innerSize: '60%',
        dataLabels: {
          enabled: true
        }

      }],
      
      // series start 
      // series: [{
      //   name: 'Browsers',
      //   data: browserData,
      //   size: '60%',
      //   dataLabels: {
      //     formatter: () =>{
      //       return this.y > 5 ? this.point.name : null;
      //     },
      //     color: '#ffffff',
      //     distance: -30
      //   }
      // }, {
      //   name: 'Versions',
      //   data: versionsData,
      //   size: '80%',
      //   innerSize: '60%',
      //   dataLabels: {
      //     formatter:  () =>{
      //       // display only if larger than 1
      //       return this.y > 1 ? '<b>' + this.point.name + ':</b> ' +
      //         this.y + '%' : null;
      //     }
      //   },
      //   id: 'versions'
      // }],

      // series end 

      responsive: {
        rules: [{
          condition: {
            maxWidth: 200,
            maxHeight:100
          },
          chartOptions: {
           
          }
        }]
      }
    
    });
 

  } 



 




}
