// counting Rows!
$(function () {
    $('#cast').highcharts({
        chart: {
            type: 'column'
        },
        title: {
            text: 'Cast performance on EC2 (3 Nodes)'
        },
        subtitle: {
            text: 'Addition (10000 dim, 1000000 rows)'
        },
        xAxis: {
            type: 'category',
            labels: {
                rotation: -45,
                style: {
                    fontSize: '13px',
                    fontFamily: 'Verdana, sans-serif'
                }
            }
        },
        yAxis: {
            min: 0,
            title: {
                text: 'Duration (ms)'
            }
        },
        legend: {
            enabled: false
        },
        tooltip: {
            pointFormat: 'Duration Time: <b>{point.y:.1f} s</b>'
        },
        series: [{
            name: 'Duration',
            data: [
                ['MLLib', 1165],
                ['Breeze', 879],
                ['Mahout', 6785]
            ],
            dataLabels: {
                enabled: true,
                rotation: -90,
                color: '#FFFFFF',
                align: 'right',
                x: 4,
                y: 10,
                style: {
                    fontSize: '13px',
                    fontFamily: 'Verdana, sans-serif',
                    textShadow: '0 0 3px black'
                }
            }
        }]
    });
});