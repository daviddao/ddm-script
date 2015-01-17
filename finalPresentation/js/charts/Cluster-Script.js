$(function () {
    $('#container').highcharts({
        chart: {
            type: 'column'
        },
        title: {
            text: 'Cluster Setup vs. FabScript'
        },
        subtitle: {
            text: ''
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
                text: 'Total Time (min)'
            }
        },
        legend: {
            enabled: false
        },
        tooltip: {
            pointFormat: 'Total Time: <b>{point.y:.1f} mins</b>'
        },
        series: [{
            name: 'Duration',
            data: [
                ['Cluster Setup', 7.38],
                ['Script Setup', 0.30],
            ],
            color: '#87CEFA',
            dataLabels: {
                enabled: true,
                //rotation: -90,
                color: '#FFFFFF',
                align: 'center',
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