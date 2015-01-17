$(function () {
    $('#container').highcharts({
        chart: {
            plotBackgroundColor: null,
            plotBorderWidth: 0,
            plotShadow: false
        },
        title: {
            text: 'Regression ICA:<br>73.7s',
            align: 'center',
            verticalAlign: 'middle',
            y: 0
        },
        tooltip: {
            pointFormat: '{series.name}: <b>{point.percentage:.1f}%</b>'
        },
        plotOptions: {
            pie: {
                dataLabels: {
                    enabled: true,
                    distance: -50,
                    style: {
                        fontWeight: 'bold',
                        color: 'white',
                        textShadow: '0px 1px 2px black'
                    }
                },
                startAngle: 0,
                endAngle: 360,
                center: ['50%', '50%']
            }
        },
        series: [{
            type: 'pie',
            name: 'Browser share',
            innerSize: '50%',
            data: [
                ['Load & Parse',   50.0],
                ['Compute',       10.0],
                ['Collect & Save', 40.0]
            ]
        }]
    });
});