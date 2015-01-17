// highchart: MLlib vs. Mahout
$(function () {
    $('#container').highcharts({
        chart: {
            type: 'spline',
            inverted: true
        },
        title: {
            text: 'MLlib vs. Mahout'
        },
        subtitle: {
            text: 'ALS Amazon Reviews on 16 Nodes'
        },
        xAxis: {
            reversed: false,
            title: {
                text: 'Running Time (m)'
            },
            showLastLabel: true
        },
        yAxis: {
            title: {
                text: 'Number of Rating'
            },
            labels: {
                formatter: function () {
                    return this.value + 'M';
                }
            },
            lineWidth: 2
        },
        tooltip: {
            headerFormat: '<b>{series.name}</b><br/>',
            pointFormat: '{point.y}M: {point.x} mins'
        },
        plotOptions: {
            spline: {
                marker: {
                    enable: false
                }
            }
        },
        series: [{
            name: 'MLlib',
            data: [[2, 60], [2.5, 70], [3, 120], [5, 240], [13.5, 470],
                [20, 710], [32, 950]]
        },
        {
            name: 'Mahout',
            color: '#FF8C00',
            data: [[23.5, 70], [46.5, 120]]
        }]
    });
});