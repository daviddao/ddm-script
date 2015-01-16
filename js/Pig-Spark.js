// counting Rows!
$(function () {
    $('#container').highcharts({
        chart: {
            type: 'column'
        },
        title: {
            text: 'Pig vs. Spark'
        },
        subtitle: {
            text: 'Number of 54,874,995 of rows.'
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
                text: 'Duration (s)'
            }
        },
        legend: {
            enabled: false
        },
        tooltip: {
            pointFormat: 'Duration Time: <b>{point.y:.1f} mins</b>'
        },
        series: [{
            name: 'Duration',
            data: [
                ['Pig', 7.38],
                ['Spark', 2.06],
                ['Spark(8 cores)', 1.3]
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

// counting Distinct Words
$(function () {
    $('#container7').highcharts({
        chart: {
            type: 'column'
        },
        title: {
            text: 'Pig vs. Spark'
        },
        subtitle: {
            text: 'Number of 2,318,059 of distinct words.'
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
                text: 'Duration (s)'
            }
        },
        legend: {
            enabled: false
        },
        tooltip: {
            pointFormat: 'Duration Time: <b>{point.y:.1f} mins</b>'
        },
        series: [{
            name: 'Duration',
            data: [
                ['Pig', 28.5],
                ['Spark', 9.4],
                ['Spark(8 cores)', 5.38]
            ],
            color: '#ADFF2F',
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