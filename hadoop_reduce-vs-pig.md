---
layout: page
title: "MapReduce vs. Pig"
permalink: /hadoop_reduce-vs-pig/
---


See the github folder ["wordcount"](https://github.com/greenify/ddm/tree/master/wordcount)

### Results (local)

Hadoop Reduce: 11:42.41
Pig: 10:09.30
PySpark: 4:07.72 
JavaSpark:  1:00.63
Spark: 58.861
Spark (8 cores): 53.247

(1.4G, 32.116.000 lines)

### Results (ec2, standalone mode)

JavaSpark: 10m40.727s 
Spark: 10m14.702s 

(6.5G, 160.580.000 lines)

### Results (ec2, with 3 nodes)

ScalaSpark: 2m57.832s
JavaSpark: 3m5.509s 

(6.5G, 160.580.000 lines)

### Results (local, 8 cores)

ScalaSpark: 1m40.07s
JavaSpark: 2m12.98s
PySpark: 11m01.30s

1 core:

JavaSpark: 5m12.84s
ScalaSpark: 5m11.33s
PySpark: 21m26.94s

(6.5G, 160.580.000 lines)


### Generate dummy data

```
for i in {1..1000}; do cat inpt/pg5000.txt >> input/dummy ; done
```


### Pig

```
export JAVA_HOME=/usr/lib/jvm/default
pig -f wordcount.py
```

### Hadoop

```
# compile
mkdir wc_classes
javac -cp /path/to/hadoop-core-0.20.205.0.jar -d wc_classes WordCount.java
jar -cvf wordcount.jar -C wc_classes .

# submit it to hadoop
hadoop jar wordcount.jar WordCount ../input/dummy out
```

### PySpark

```
spark-submit wordcount.py input/dummy out/py
```

or directly via

```
./wordcount.py input/dummy out/py
```

### JavaSpark

```
mvn package
spark-submit --class WordCount target/word-counting-1.0.jar ../input/dummy out
```

### ScalaSpark

```
sbt package
spark-submit --class WordCount target/scala-2.11/word-counting_2.11-1.0.jar ../input/dummy out
```
