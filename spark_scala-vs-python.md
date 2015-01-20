---
layout: page
title: "Spark: Scala vs. Python (Performance & Usability)"
permalink: /spark_scala-vs-python/
---

Analyzing the Amazon data set
============================

Calculating the average rating for every item and the average item rating for all items.

### Scala

```
import org.apache.spark.SparkContext
import org.apache.spark.SparkContext._
import org.apache.spark.SparkConf

object AmazonAVG {
  def main(args: Array[String]) {

    val sc = new SparkContext(new SparkConf().setAppName("Spark Count").setMaster("local"))

    if(args.length < 1){
      println("No input file provided")
      System.exit(1)
    }

    val lines = sc.textFile(args(0))

    // do some standard mapping
    val rows = lines.map(a => a.split("\016"))
    val mappi = rows.map(x => (x(0),x))

    //var p2 = mappi.combineByKey(x => 0.0, (x:Double,v:Array[String]) => x, (v:Double,v2:Double) => v + v2

      // reduce to (rating, ratingsPerItem) -> calc avg
      var ratings = mappi.combineByKey(x => (x(6).toDouble, 1), (z:(Double,Int),v) => (z._1 + v(6).toDouble, z._2 + 1), (v:(Double, Int),v2:(Double,Int)) => (v._1 + v2._1, v._2 + v2._2)).mapValues(x => x._1 / x._2)

      // resolve tuple to avg
      val avgRating = ratings.mapValues("%1.2f".format(_))
      val totalMean = ratings.map(_._2).mean()

      println(totalMean)

    }

  }
```

Runtime for 5M entries: 30.66s


### Python


```
import sys
from pyspark import SparkContext

sc = SparkContext("local")

if len(sys.argv) < 2:
    print("no input file specified")
    sys.exit(1)

inputFile = sys.argv[1]

print("input %s" % inputFile)

lines = sc.textFile(inputFile)
rows = lines.map(lambda x: x.split("\016"))
mappi = rows.map(lambda x: (x[0], x))

ratings = mappi.combineByKey(lambda x: (float(x[6]),1), lambda x,y: (x[0] + float(y[6]), x[1] + 1), lambda x,y: (x[0] + y[0], x[1] + y[1] )).mapValues(lambda x: x[0] / x[1])

avgRating = ratings.mapValues(lambda x: "{:1.2f}".format(x))
totalMean = ratings.map(lambda x: x[1]).mean()
print(totalMean)
```

Runtime for 5M entries: 56.96s



## Analyzing Uniprot

Calculating the amino acid distribution

### Scala

```
import scala.collection.mutable.ListMap

val counts = lines.flatMap(line => { val cells = line.split("Ä"); (cells(1).split("").zipWithIndex) })
val stat= counts.countByKey
val total = fo.foldLeft(0L)(_ + _._2)

val relStat= stat.mapValues(v => v / 1.0 / total)

val relStatSorted = new ListMap() ++ relStat.toList.sortBy(_._2)
val relStatFormatted = fo3.mapValues(relStatSorted => "%1.2f".format(x))
println(relStatFormatted.mkString(";"))
```

Runtime: 33.53s (547.085 entries)

### Python

```
import sys
from pyspark import SparkContext
from collections import OrderedDict

sc = SparkContext("local")

if len(sys.argv) < 2:
    print("no input file specified")
    sys.exit(1)

inputFile = sys.argv[1]

print("input %s" % inputFile)

lines = sc.textFile(inputFile)


def countFlatter(line):
    cells = line.split(u"Ä")
    li = enumerate(list(cells[1]))
    return [(l[1], l[0]) for l in li]

counts = lines.flatMap(countFlatter)
stat = OrderedDict(sorted(counts.countByKey().iteritems()))
total = sum(stat.values())
relativeStat = {k: v / 1.0 / total for k, v in stat.iteritems()}

relativeStatForm = {k: "%.2f" % v for k, v in relativeStat.iteritems()}
print(relativeStatForm)
```

Runtime: 65.28s (547.085 entries)


### Total mean in Amazon

Scala

````
val rows = sc.textFile(inputFile).map(x => x.split("\016"))
val totalMean = rows.map(x => x(6).toDouble).mean()
```

Python

```
rows = sc.textFile(inputFile).map(lambda x: x.split("\016"))
totalMean = rows.map(lambda x: float(x[6])).mean()
```

Java

```
import org.apache.spark.api.java.*;
import org.apache.spark.api.java.function.DoubleFunction;
import java.util.Arrays;
import java.util.List;

public class AmazonMean 
{
    public static void main(String[] args)
    {
        System.out.println(args[0]);
        JavaSparkContext sc = new JavaSparkContext();
        JavaRDD<String> file = sc.textFile(args[0]);
        JavaRDD<List<String>> lines = file.map(s -> Arrays.asList(s.split("\016")));

        JavaDoubleRDD ratings = lines.mapToDouble(new DoubleFunction<List<String>>()
        {
            public double call(List<String> s)
            {
                return Double.parseDouble(s.get(6));
            }
        });

        Double totalMean  = ratings.mean();
        System.out.printf("mean %.2f\n", totalMean); 
    }
}
```
