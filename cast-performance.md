---
layout: page
mathjax: true
permalink: /cast-performance/
---

Why is MLLib so much faster than Map-Reduce Hadoop ? One reason might be, that Hadoop Map Reduce is not optimized for iterative computation while Spark is.
Another one is probably the highly efficient RDD datastructure and Sparks Vector Data Type.
As we can see in the following Cast performance experiements, MLLibs Vector is optimized in a sense, that it can even cope with highly scientific libraries like [breeze](http://www.scalanlp.org/).

### Results 


<script src="http://ajax.googleapis.com/ajax/libs/jquery/1.9.1/jquery.min.js"></script>
<script src="http://code.highcharts.com/highcharts.js"></script>
<script src="http://code.highcharts.com/modules/exporting.js"></script>

<div id="cast"></div>

<script>
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
                ['Mahout', 3485]
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
</script>

### Full result

````
===== Experiment: Addition
CPU cores:160
Rows:1000000
Dimension:1000
Partitions:160
Execution Times: 25 times
Spark Vector: 404 [msec]
Breeze Vector: 240 [msec]
Hadoop Vector: 703 [msec]
===== Experiment: Multiplication
CPU cores:160
Rows:1000000
Dimension:1000
Partitions:160
Execution Times: 25 times
Spark Vector: 180 [msec]
Breeze Vector: 162 [msec]
Hadoop Vector: 303 [msec]
===== Experiment:  Addition
CPU cores:160
Rows:1000000
Dimension:1000
Partitions:160
Execution Times: 25 times
Spark Vector: 165 [msec]
Breeze Vector: 154 [msec]
Hadoop Vector: 303 [msec]
===== Experiment: Addition
CPU cores:160
Rows:1000000
Dimension:10000
Partitions:160
Execution Times: 25 times
Spark Vector: 1165 [msec]
Breeze Vector: 879 [msec]
Hadoop Vector: 3485 [msec]
===== Experiment: Multiplication
CPU cores:160
Rows:1000000
Dimension:10000
Partitions:160
Execution Times: 25 times
Spark Vector: 834 [msec]
Breeze Vector: 827 [msec]
Hadoop Vector: 2785 [msec]
===== Experiment: Division
CPU cores:160
Rows:1000000
Dimension:10000
Partitions:160
Execution Times: 25 times
Spark Vector: 843 [msec]
Breeze Vector: 845 [msec]
Hadoop Vector: 2703 [msec]
````