---
layout: page
title: Pig
permalink: /pig/
---

Pig allows do reduce a lot of Hadoop Code! 
In the following we provided you with a wordcount example, first in hadoop and next in pig.

Hadoop WordCount:

````
public static class WordCountMapClass extends MapReduceBase
public static class WordCountMapClass extends MapReduceBase
  implements Mapper<LongWritable, Text, Text, IntWritable> {
  private final static IntWritable one = new IntWritable(1);
  private Text word = new Text();
  public void map(LongWritable key, Text value,
                  OutputCollector<Text, IntWritable> output,
                  Reporter reporter) throws IOException {
    String line = value.toString();
    StringTokenizer itr = new StringTokenizer(line);
    while (itr.hasMoreTokens()) {
      word.set(itr.nextToken());
      output.collect(word, one);
    }
  }
}
public static class WorkdCountReduce extends MapReduceBase
  implements Reducer<Text, IntWritable, Text, IntWritable> {
  public void reduce(Text key, Iterator<IntWritable> values,
                     OutputCollector<Text, IntWritable> output,
                     Reporter reporter) throws IOException {
    int sum = 0;
    while (values.hasNext()) {
      sum += values.next().get();
    }
    output.collect(key, new IntWritable(sum));
  }
}
````


My Pig script looks like below:

````
B = foreach A generate flatten(TOKENIZE((chararray)$0)) as word;
C = group B by word;
D = foreach C generate COUNT(B), group;
E = group D all;
F = foreach E generate COUNT(D);
dump F;
````

Impressive, however Pig has no chance against Spark Scalas impressive oneliner : 

````
var wc = auditLog.flatMap(line => line.split(" ")).map(word => (word, 1)).reduceByKey(_ + _)
wc.count
````
