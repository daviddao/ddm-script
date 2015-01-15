---
layout: page
permalink: /hadoop/
---

Table of Contents:

- [Installation](#installation)
- [Standalone MapReduce](#standalone)
- [Setup a one-node-cluster](#onenode)
- [Setup a multi-node-cluster](#multinode)
- [Using HDFS](#upload)

<a name='installation'></a>
### Installation

1. Start an ubuntu instance and set up `/etc/resolv.conf` and `/etc/hosts` 
2. Update apt-get repository : `sudo apt-get update`
3. Install java 1.7 with `sudo aptitude -y install openjdk-7-jdk`
4. Edit your `.bashrc file` and add `export JAVA_HOME=/usr/lib/jvm/java-7-openjdk-amd64`
5. Get the newest version of hadoop with `sudo wget http://apache.openmirror.de/hadoop/common/hadoop-2.5.2/hadoop-2.5.2.tar.gz`
6. Unpack hadoop with `sudo tar –xvzf hadoop-2.5.2.tar.gz`
7. Rename the folder with `sudo mv hadoop-2.5.2 hadoop`
8. Adjust the `JAVA_HOME` variable in `etc/hadoop/hadoop-env.sh`

<a name='standalone'></a>
### Standalone MapReduce

By default, Hadoop is configured to run in non-distributed mode. You can start a small mapreduce job by following:

````
$ mkdir input
$ cp etc/hadoop/*.xml input
$ bin/hadoop jar share/hadoop/mapreduce/hadoop-mapreduce-examples-2.5.2.jar 
$ grep input output 'dfs[a-z.]+'
$ cat output/* //which should deliver 1 dfsadmin
````

Congratulations! You have Hadoop running on Ubuntu.

<a name='onenode'></a>
### Setup a one-node-cluster

Hadoop can also be run on a single-node in a pseudo-distributed mode where each Hadoop daemon runs in a separate Java process.
First of all we need to shut of IPv6 because Ubuntu is using 0.0.0.0 for different Hadoop instances
Edit file `/etc/sysctl.conf` with below and reboot or just add `export HADOOP_OPTS=-Djava.net.preferIPv4Stack=true` in `hadoop-env`

````
#disable ipv6
net.ipv6.conf.all.disable_ipv6 = 1
net.ipv6.conf.default.disable_ipv6 = 1
net.ipv6.conf.lo.disable_ipv6 = 1
````

Edit file etc/hadoop/core-site.xml:

````
<configuration>
<property>
<name>fs.defaultFS</name>
<value>hdfs://localhost:9000</value>
</property>
</configuration>
````

Edit file etc/hadoop/hdfs-site.xml

````
<configuration>
<property>
<name>dfs.replication</name>
<value>1</value>
</property>
</configuration>
````

Hadoop uses ssh to communicate so we need to setup ssh localhost
Lets create a key: `ssh-keygen -t dsa -f ~/.ssh/id_dsa`
And add this key `cat ~/.ssh/id_dsa.pub >> ~/.ssh/authorized_keys`, now it should be possible to ssh localhost

<a name='multinode'></a>
### Setup a multi-node-cluster 

This Tutorial is an excerpt of Mohamed and Marawan's Hadoop Tutorial.
The [Hadoop tutorial for multi-node cluster installation](http://hadoop.apache.org/docs/r2.5.1/hadoop-project-dist/hadoop-common/ClusterSetup.html) doesn't offer much in the way of detailed steps, presenting just a list of the configuration options available, which is confusing because for a minimal required configuration you only need to change the following :
In `etc/hadoop/core-site.xml` , instead of having the `fs.defaultFS` property set to localhost, we set it to point to the IP address of the NameNode :

```` 
 <configuration>
    <property>
        <name>fs.defaultFS</name>
        <value>hdfs://172.16.19.10:9000</value>
    </property>
 </configuration>

````
This has 2 effects. First on the NameNode, the NameNode process will listen on 172.16.19.10:9000 which allows machines on the network to connect to it, in contrast with listening on localhost:9000 which only allowed processed on the same machine to connect to it. The second effect is on the DataNode, this config of course just tells the DataNodes what NameNode to connect to and on which port.

In `etc/hadoop/yarn-site.xml`, specify the ResourceManager IP, which here we just used the NameNode IP for (but that doesn't always have to be the case) :

```` 
 <configuration>
    <property>
        <name>yarn.resourcemanager.hostname</name>
        <value>172.16.19.10</value>
        <description>The hostname of the Resource Manager.</description>
    </property>
 </configuration>
````

The above configs need to eventually be on both the NameNode and the DataNode, so we applied them to our single machine , then created a snapshot of the machine. And that is our Hadoop image that we'll use to create our cluster.

(Optional) In `etc/hadoop/hdfs-site.xml`, specify the Secondary Node IP, which is by default set to '''0.0.0.0.0:50090''' which basically points to all the ip addresses currently configured on the machine and the `dfs.replication` which is how many copies to store for each block of a file in HDFS (default:3):

````
    <property>
        <name>dfs.replication</name>
        <value>3</value>
    </property>
    <property>
        <name>dfs.namenode.secondary.http-address</name>
        <value>172.16.19.17:50090</value>
    </property>
````

(Recommended) In `etc/hadoop/hdfs-site.xml`, disable ACL permissions for HDFS files. This might be enabled for a production environment, but for testing, can lead to some Permission denied exceptions:

````
    <property>
        <name>dfs.permissions</name>
        <value>false</value>
    </property>
````

**Specific Configuration** 
Now we have an image with the correct hadoop configuration, we proceeded by creating cloned instances from that image to create a small cloud with one name node and 3 data nodes.
The IP address of our machines :

````
 172.16.19.10 (NameNode)
 172.16.19.11 (DataNode)
 172.16.19.12 (DataNode)
 172.16.19.13 (DataNode)
````

Now all machines are clones. First we need to adjust the hostnames by doing fixing unknown host.
Then in terms of Hadoop configuration, only the NameNode needs 2 additional configurations :
On the name node server we edited the `etc/hadoop/slaves` file and added the IP addresses of the 3 data nodes

````
 172.16.19.11
 172.16.19.12
 172.16.19.13
````

Now the NameNode knows which slaves it can use. 
Important : Make sure that the NameNode can ssh to each of the DataNodes without a passphrase or any user input. 
 from the NameNode:

````
 ssh ubuntu@172.16.19.11
 ssh ubuntu@172.16.19.12
 ssh ubuntu@172.16.19.13
````

This should be the case if you had already followed the single-node cluster configuration, on one node and then cloned it, as the the ssh key should already be in the list of authorizaed keys for the machine. 

On the name node server, edit `/etc/hosts` add the hostname-ip mappings of the datanodes, so that the file looks like this:

````
 ubuntu@namenode:~/hadoop$ cat /etc/hosts
 127.0.0.1 localhost
 127.0.0.1 namenode:localdomain namenode
 
 '''172.16.19.11 datanode-1'''
 '''172.16.19.12 datanode-2'''
 '''172.16.19.13 datanode-3'''
 # The following lines are desirable for IPv6 capable hosts
 ::1 ip6-localhost ip6-loopback
 fe00::0 ip6-localnet
 ff00::0 ip6-mcastprefix
 ff02::1 ip6-allnodes
 ff02::2 ip6-allrouters
 ff02::3 ip6-allhosts
````


*On the data nodes, edit `/etc/hosts` add add the hostname-ip mappings of the  namenode and the other datanodes. This is required because when running Map reduce jobs, the data nodes will need to communicate with each other and to the name node. You also need to ('''IMPORTANT''') comment out the line with localdomain so that the file looks like this:

````
 ubuntu@datanode-1:~/hadoop$ cat /etc/hosts
 127.0.0.1 localhost
 
 #127.0.0.1 datanode-1:localdomain datanode-1
 
 172.16.19.10 namenode
 172.16.19.11 datanode-1
 172.16.19.12 datanode-2
 172.16.19.13 datanode-3
 ....
````

Without these modifications, HDFS will work correctly, but running a MapReduce job will fail with a "Connection Refused" error

<a name='upload'></a>
### Upload Files using HDFS

Starting the hadoop cluster now by executing the following on NameNode

````
bin/hadoop namenode -format
sbin/start-dfs.sh
sbin/start-yarn.sh
````

Now we are able to upload files. DFS has its own file namespace, and the stored data on dfs is not directly accessible with Linux commands, instead we have to use `bin/hadoop` command to access it. By default any relative path on DFS is at `/user/[username]/` , however this directory is not created by default so we need to create it:

````
ubuntu@namenode:~/hadoop$bin/hdfs dfs -mkdir /user
ubuntu@namenode:~/hadoop$bin/hdfs dfs -mkdir /user/ubuntu
````

You can list the files in /user/ubuntu by :

````
ubuntu@namenode:~/hadoop$bin/hdfs dfs -ls
````

Note that we didn't need to specify /user/ubuntu in the ls command, because that's the default directory.
Now copy a test file and see it with -ls

````
ubuntu@namenode:~/hadoop$echo Hello HDFS > ~/hellohdfs.txt
ubuntu@namenode:~/hadoop$bin/hadoop dfs -put ~/hellohdfs.txt testfile
ubuntu@namenode:~/hadoop$bin/hadoop dfs -ls
Found 1 items
-rw-r--r--   3 ubuntu supergroup         16 2014-11-04 13:06 testfile
````

We did this while on the namenode, now go to a datanode and see the file content from there:

````
ubuntu@datanode-1:~/hadoop$ bin/hadoop dfs -ls
Found 1 items
-rw-r--r--   3 ubuntu supergroup         16 2014-11-04 12:06 testfile
ubuntu@datanode-1:~/hadoop$ bin/hadoop dfs -cat testfile
Hello HDFS
````

### Using the GUI to browse HDFS
It is also possible to use the GUI to browse HDFS. For this, have a look at Section `Module0: Preparation & Setup - GUI`

