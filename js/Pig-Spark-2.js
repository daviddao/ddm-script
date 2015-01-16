$(function () {
    $('#container').highcharts({
        chart: {
            type: 'column'
        },
        title: {
            text: 'Pig vs. Spark'
        },
        xAxis: {
            categories: ['Pig', 'Spark', 'Spark(8 cores)']
        },
        yAxis: {
            min: 0,
            title: {
                text: 'Total Duration (min)'
            },
            stackLabels: {
                enabled: true,
                style: {
                    fontWeight: 'bold',
                    color: (Highcharts.theme && Highcharts.theme.textColor) || 'gray'
                }
            }
        },
        legend: {
            align: 'right',
            x: -30,
            verticalAlign: 'top',
            y: 25,
            floating: true,
            backgroundColor: (Highcharts.theme && Highcharts.theme.background2) || 'white',
            borderColor: '#CCC',
            borderWidth: 1,
            shadow: false
        },
        tooltip: {
            formatter: function () {
                return '<b>' + this.x + '</b><br/>' +
                    this.series.name + ': ' + this.y + ' mins<br/>' +
                    'Total: </b>' + this.point.stackTotal + ' mins';
            }
        },
        plotOptions: {
            column: {
                stacking: 'normal',
                dataLabels: {
                    enabled: true,
                    color: (Highcharts.theme && Highcharts.theme.dataLabelsColor) || 'white',
                    style: {
                        textShadow: '0 0 3px black'
                    }
                }
            }
        },
        series: [{
            name: 'Number of Rows: 54,874,995',
            data: [7.38, 2.06, 1.30]
        }, {
            name: 'Number of Distinct Words: 2,318,059',
            data: [28.5, 9.4, 5.38]
        }]
    });
});