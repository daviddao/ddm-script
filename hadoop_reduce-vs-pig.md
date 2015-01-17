---
layout: page
title: "MapReduce vs. Pig"
permalink: /hadoop_reduce-vs-pig/
---


See the github folder "wordcount"

### Results

Hadoop Reduce: 11:42.41
Pig: 19:02.59
PySpark: 4:07.72 
JavaSpark:  1:00.63
Spark: 58.861

### Generate dummy data

```
for i in {1..1000}; do cat inpt/pg5000.txt >> input/dummy ; done
```

(1.4G, 32.116.000 lines)

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
spark-submit wordcount.py input/dummy output/py
```

or directly via

```
./wordcount.py input/dummy output/py
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
