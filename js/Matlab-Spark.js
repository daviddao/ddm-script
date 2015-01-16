$(function () {
    $('#container').highcharts({
        chart: {
            type: 'column'
        },
        title: {
            text: 'Regression'
        },
        subtitle: {
            text: 'Source: WorldClimate.com'
        },
        xAxis: {
            title: {
                text: 'Size (GB)'
            },
            categories: [100, 200, 400, 800]
        },
        yAxis: {
            min: 1,
            max: 12000,
            title: {
                text: 'Runtime (sec)'
            },
            labels: {
              formatter: function(){
                return (Math.floor (this.value) * 10);
              }
            }
        },
        tooltip: {
            headerFormat: '<span style="font-size:13px">{point.key} GB</span><table>',
            pointFormat: '<tr><td style="color:{series.color};padding:0">{series.name}: </td>' +
                '<td style="padding:0"><b>{point.y:.1f} sec</b></td></tr>',
            footerFormat: '</table>',
            shared: true,
            useHTML: true
        },
        plotOptions: {
            column: {
                pointPadding: 0.2,
                borderWidth: 0
            }
        },
        series: [{
            name: 'Workstation (Matlab)',
            data: [6000, 8000, 10000, 12000]

        }, {
            name: 'Cluster (Spark)',
            data: [40, 70, 110, 130]

        }]
    });
});