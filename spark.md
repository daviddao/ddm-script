---
layout: page
title: Spark installation
permalink: /spark/
---

##Prerequisites

Installing Spark for Mesos is surprisingly simple, given that we already have configured following things:

- Mesos installed via Mesosphere (which includes OpenJDK 7) (check by accessing following URL: http://[master node]:8080)
- HDFS set up (you can check by accessing following URL: http://[namenode]:50900)

## Steps

1. Download Apache Spark and choose the correct Hadoop Version you are using 

<div class='fig figcenter fighighlight'>
  <img src='/assets/Install.png'>
</div>

2. Access your Namenode via ssh and `wget` this version by copy paste the link address!
3. Upload the TAR File on HDFS 


<div class='fig figcenter fighighlight'>
  <img src='/assets/Upload.png'>
</div>

4. Edit `spark-env.sh` by setting following variables: 

````
export MESOS_NATIVE_LIBRARY=<path to libmesos.so> (default: /usr/local/lib/libmesos.so)
export SPARK_EXECUTOR_URI=<URL to your Spark HDFS Upload> 
(We use 172.49.0.19:9000/user/ubuntu/spark)
````

5. Now we can start Spark on Mesos with

````
./bin/spark-shell --master mesos://host:5050
````


