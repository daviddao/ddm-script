---
layout: page
mathjax: true
permalink: /proxy/
---

## SOCKS Proxy to VM on dataminer
To proxy the VMs on dataminer, we need to send our ssh command as a proxy command to dataminer itself. 
We are using SSH tunneling over dataminer to access the virtual machine from our local machine. 
It allows you to browse and access the web as if you would be accessing it from your virtual machine.

````
ssh -f -N -D [port number] -i [private key for VM on your local machine] /
-oProxyCommand="ssh -W %h:%p -p 8574 [user name]@dataminer.informatik.tu-muenchen.de" /
ubuntu@[ip to your machine]
````
And set a SOCKS Proxy to [port number]


## GUI ports 
**Mesos GUI**

 - localhost:5050
 
**Marathon GUI**

 - localhost:8080

**Chronos GUI**

 - localhost:4400

**Hadoop GUI**

 - [namenode]:50070
 - [secondarynamenode]:50090 

