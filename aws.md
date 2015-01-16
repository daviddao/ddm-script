---
layout: page
mathjax: true
permalink: /aws/
---

## How to start a Spark Cluster on AWS

1. Create an account in AWS
2. Obtain your keys by clicking Account > Security Credentials > Access Credentials

<div class='fig figcenter fighighlight'>
  <img src="{{ '/assets/aws-accesskey.png' | prepend: site.baseurl }}">
</div>

3. Edit your bashrc script

````
export AWS_ACCESS_KEY_ID=<ACCESS_KEY_ID>
export AWS_SECRET_ACCESS_KEY=<SECRET_ACCESS_KEY>
````


4. Select as region US-EAST (only region currently supported)
5. Create a keypair

<div class='fig figcenter fighighlight'>
  <img src="{{ '/assets/aws-keypair.png' | prepend: site.baseurl }}">
</div>

6. Inside your local spark folder should be the ec subfolder. Run and wait until the setup is ready

````
./spark-ec2 -i <key_file> -k <name_of_key_pair>  launch <name>
````

7. Commands: 

````
./spark-ec2 -i <key_file> -k <name_of_key_pair>  login <name> 
./spark-ec2 -i <key_file> -k <name_of_key_pair>  stop <name>
./spark-ec2 -i <key_file> -k <name_of_key_pair>  start <name>
./spark-ec2 -i <key_file> -k <name_of_key_pair>  destroy <name>

````

## Source
[Official Spark resource](http://spark.apache.org/docs/latest/ec2-scripts.html)