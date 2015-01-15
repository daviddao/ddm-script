---
layout: page
permalink: /sparkcontext/
---

## SparkSQL

[SparkSQL](http://spark.apache.org/docs/latest/sql-programming-guide.html) adds the ability to specify schema for RDDs, run SQL queries on them, and even create, delete, and query tables in [Hive](http://hive.apache.org), the original SQL tool for Hadoop. Recently, support was added for parsing JSON records, inferring their schema, and writing RDDs in JSON format.

Several years ago, the Spark team ported the Hive query engine to Spark, calling it [Shark](http://shark.cs.berkeley.edu/). That port is now deprecated. SparkSQL will replace it once it is feature compatible with Hive. The new query planner is called [Catalyst](http://databricks.com/blog/2014/03/26/spark-sql-manipulating-structured-data-using-spark-2.html).

## SparkStreaming

Spark Streaming uses a clever hack; it runs more or less the same Spark API (or code that at least looks conceptually the same) on *deltas* of data, say all the events received within one-second intervals (which is what we used here). Deltas of one second to several minutes are most common. Each delta of events is stored in its own [RDD](http://spark.apache.org/docs/latest/api/scala/index.html#org.apache.spark.rdd.RDD) encapsulated in a [DStream](http://spark.apache.org/docs/latest/api/scala/index.html#org.apache.spark.streaming.dstream.DStream) ("Discretized Stream").

A [StreamingContext](http://spark.apache.org/docs/latest/api/scala/index.html#org.apache.spark.streaming.StreamingContext) is used to wrap the normal [SparkContext](http://spark.apache.org/docs/latest/api/scala/index.html#org.apache.spark.SparkContext), too.