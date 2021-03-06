---
layout: page
mathjax: true
permalink: /mesos/
---
The following content is from Digital Ocean and was our main guideline for setting up mesos on ubuntu

Table of Contents:

- [Introduction](#introduction)
- [Install mesosphere on the servers](#install-mesosphere-on-the-servers)
- [Configure mesos on the master servers](#configure-mesos-on-the-master-servers)
- [Configure the slave servers](#configure-the-slave-servers)
- [Starting services on mesos and marathon](#starting-services-on-mesos-and-marathon)

 <h3 id="introduction">Introduction</h3>

<p>Mesosphere is a system that combines a number of components to effectively manage server clustering and highly available deployments on top of an existing operating system layer.  Unlike systems like CoreOS, Mesosphere is not a specialized operating system and is instead a set of packages.</p>

<p>In this guide, we will go over how to configure a highly available cluster in Mesosphere.  This configuration will set us up with failover in case any of our master nodes go down as well as a pool of slave servers to handle the tasks that are scheduled.</p>

<p>We will be using Ubuntu 14.04 servers for this guide.</p>

<h2 id="prerequisites-and-goals">Prerequisites and Goals</h2>

<p>During this tutorial, we will be using six Ubuntu servers.  This fulfills the Apache Mesos recommendation of having at least three masters for a production environment.  It also provides a pool of three worker or slave servers, which will be assigned work when tasks are sent to the cluster.</p>

<p>The six servers we will be using will use <code>zookeeper</code> to keep track of the current leader of the master servers.  The Mesos layer, built on top of this, will provide distributed synchronization and resource handling.  It is responsible for managing the cluster.  Marathon, the cluster's distributed init system, is used to schedule tasks and hand work to the slave servers.</p>

<p>For the sake of this guide, we will be assuming that our machines have the following configuration:</p>

<table class="pure-table">
<thead><tr>
<th>Hostname</th>
<th>Function</th>
<th>IP Address</th>
</tr></thead>
<tbody>
<tr>
<td>master1</td>
<td>Mesos master</td>
<td>192.0.2.1</td>
</tr>
<tr>
<td>master2</td>
<td>Mesos master</td>
<td>192.0.2.2</td>
</tr>
<tr>
<td>master3</td>
<td>Mesos master</td>
<td>192.0.2.3</td>
</tr>
<tr>
<td>slave1</td>
<td>Mesos slave</td>
<td>192.0.2.51</td>
</tr>
<tr>
<td>slave2</td>
<td>Mesos slave</td>
<td>192.0.2.52</td>
</tr>
<tr>
<td>slave3</td>
<td>Mesos slave</td>
<td>192.0.2.53</td>
</tr>
</tbody>
</table>
<p>Each of these machines should have Ubuntu 14.04 installed. </p>

<p>When you are finished with the above steps, continue on with this guide.</p>

<h2 id="install-mesosphere-on-the-servers">Install Mesosphere on the Servers</h2>

<p>The first step to getting your cluster up and running is to install the software.  Fortunately, the Mesosphere project maintains an Ubuntu repository with up-to-date packages that are easy to install.</p>

<h3 id="add-the-mesosphere-repositories-to-your-hosts">Add the Mesosphere Repositories to your Hosts</h3>

<p>On <strong>all</strong> of the hosts (masters and slaves), complete the following steps.</p>

<p>First, add the Mesosphere repository to your sources list.  This process involves downloading the Mesosphere project's key from the Ubuntu keyserver and then crafting the correct URL for our Ubuntu release.  The project provides a convenient way of doing this:</p>
<pre class=""><code class="code-highlight language-bash">sudo apt-key adv --keyserver keyserver.ubuntu.com --recv E56151BF
DISTRO=$(lsb_release -is | tr '[:upper:]' '[:lower:]')
CODENAME=$(lsb_release -cs)
echo "deb http://repos.mesosphere.io/${DISTRO} ${CODENAME} main" | sudo tee /etc/apt/sources.list.d/mesosphere.list
</code></pre>
<h3 id="install-the-necessary-components">Install the Necessary Components</h3>

<p>After you have the Mesosphere repository added to your system, you must update your local package cache to gain access to the new component:</p>
<pre class=""><code class="code-highlight language-bash">sudo apt-get -y update
</code></pre>
<p>Next, you need to install the necessary packages.  The components you need will depend on the role of the host.</p>

<p>For your <strong>master</strong> hosts, you need the <code>mesosphere</code> meta package.  This includes the <code>zookeeper</code>, <code>mesos</code>, <code>marathon</code>, and <code>chronos</code> applications:</p>
<pre class=""><code class="code-highlight language-bash">sudo apt-get install mesosphere
</code></pre>
<p>For your <strong>slave</strong> hosts, you only need the <code>mesos</code> package, which also pulls in <code>zookeeper</code> as a dependency:</p>
<pre class=""><code class="code-highlight language-bash">sudo apt-get install mesos
</code></pre>
<h2 id="set-up-the-zookeeper-connection-info-for-mesos">Set up the Zookeeper Connection Info for Mesos</h2>

<p>The first thing we are going to do is configure our <code>zookeeper</code> connection info.  This is the underlying layer that allows all of our hosts to connect to the correct master servers, so it makes sense to start here.</p>

<p>Our master servers will be the only members of our <code>zookeeper</code> cluster, but all of our servers will need some configuration to be able to communicate using the protocol.  The file that defines this is <code>/etc/mesos/zk</code>.</p>

<p>On <strong>all</strong> of your hosts, complete the following step.  Open the file with root privileges:</p>
<pre class=""><code class="code-highlight language-bash">sudo nano /etc/mesos/zk
</code></pre>
<p>Inside, you will find the connection URL is set by default to access a local instance.  It will look like this:</p>
<pre><code langs="">zk://localhost:2181/mesos
</code></pre>
<p>We need to modify this to point to our three master servers.  This is done by replacing <code>localhost</code> with the IP address of our first Mesos master server.  We can then add a comma after the port specification and replicate the format to add our second and third masters to the list.</p>

<p>For our guide, our masters have IP addresses of <code>192.0.2.1</code>, <code>192.168.2.2</code>, and <code>192.168.2.3</code>.  Using these values, our file will look like this:</p>
<pre><code langs="">zk://<span class="highlight">192.0.2.1</span>:2181,<span class="highlight">192.0.2.2</span>:2181,<span class="highlight">192.0.2.3</span>:2181/mesos
</code></pre>
<p>The line must start with <code>zk://</code> and end with <code>/mesos</code>.  In between, your master servers' IP addresses and <code>zookeeper</code> ports (<code>2181</code> by default) are specified.</p>

<p>Save and close the file when you are finished.</p>

<p>Use this identical entry in each of your masters and slaves.  This will help each individual server connect to the correct master servers to communicate with the cluster.</p>

<h2 id="configure-the-master-servers'-zookeeper-configuration">Configure the Master Servers' Zookeeper Configuration</h2>

<p>On your <strong>master</strong> servers, we will need to do some additional <code>zookeeper</code> configuration.</p>

<p>The first step is to define a unique ID number, from 1 to 255, for each of your master servers.  This is kept in the <code>/etc/zookeeper/conf/myid</code> file.  Open it now:</p>
<pre class=""><code class="code-highlight language-bash">sudo nano /etc/zookeeper/conf/myid
</code></pre>
<p>Delete all of the info in this file and replace it with a single number, from 1 to 255.  Each of your master servers must have a unique number.  For the sake of simplicity, it is easiest to start at 1 and work your way up.  We will be using 1, 2, and 3 for our guide.</p>

<p>Our first server will just have this in the file:</p>
<pre><code langs="">1
</code></pre>
<p>Save and close the file when you are finished.  Do this on each of your master servers.</p>

<p>Next, we need to modify our <code>zookeeper</code> configuration file to map our <code>zookeeper</code> IDs to actual hosts.  This will ensure that the service can correctly resolve each host from the ID system that it uses.</p>

<p>Open the <code>zookeeper</code> configuration file now:</p>
<pre class=""><code class="code-highlight language-bash">sudo nano /etc/zookeeper/conf/zoo.cfg
</code></pre>
<p>Within this file, you need to map each ID to a host.  The host specification will include two ports, the first for communicating with the leader, and the second for handling elections when a new leader is required.  The <code>zookeeper</code> servers are identified by "server" followed by a dot and their ID number.</p>

<p>For our guide, we will be using the default ports for each function and our IDs are 1-3.  Our file will look like this:</p>
<pre><code langs="">server.<span class="highlight">1</span>=<span class="highlight">192.168.2.1</span>:2888:3888
server.<span class="highlight">2</span>=<span class="highlight">192.168.2.2</span>:2888:3888
server.<span class="highlight">3</span>=<span class="highlight">192.168.2.3</span>:2888:3888
</code></pre>
<p>Add these same mappings in each of your master servers' configuration files.  Save and close each file when you are finished.</p>

<p>With that, our <code>zookeeper</code> configuration is complete.  We can begin focusing on Mesos and Marathon.</p>

<h2 id="configure-mesos-on-the-master-servers">Configure Mesos on the Master Servers</h2>

<p>Next, we will configure Mesos on the three master servers.  These steps should be taken on each of your master servers.</p>

<h3 id="modify-the-quorum-to-reflect-your-cluster-size">Modify the Quorum to Reflect your Cluster Size</h3>

<p>First, we need to adjust the quorum necessary to make decisions.  This will determine the number of hosts necessary for the cluster to be in a functioning state. </p>

<p>The quorum should be set so that over 50 percent of the master members must be present to make decisions.  However, we also want to build in some fault tolerance so that if all of our masters are not present, the cluster can still function.</p>

<p>We have three masters, so the only setting that satisfies both of these requirements is a quorum of two.  Since the initial configuration assumes a single server setup, the quorum is currently set to one.</p>

<p>Open the quorum configuration file:</p>
<pre class=""><code class="code-highlight language-bash">sudo nano /etc/mesos-master/quorum
</code></pre>
<p>Change the value to "2":</p>
<pre><code langs="">2
</code></pre>
<p>Save and close the file.  Repeat this on each of your master servers.</p>

<h3 id="configure-the-hostname-and-ip-address">Configure the Hostname and IP Address</h3>

<p>Next, we'll specify the hostname and IP address for each of our master servers.  We will be using the IP address for the hostname so that our instances will not have trouble resolving correctly.</p>

<p>For our master servers, the IP address needs to be placed in these files:</p>

<ul>
<li>/etc/mesos-master/ip</li>
<li>/etc/mesos-master/hostname</li>
</ul>
<p>First, add each master node's individual IP address in the <code>/etc/mesos-master/ip</code> file.  Remember to change this for each server to match the appropriate value:</p>
<pre><code langs="">echo <span class="highlight">192.168.2.1</span> | sudo tee /etc/mesos-master/ip
</code></pre>
<p>Now, we can copy this value to the hostname file:</p>
<pre class=""><code class="code-highlight language-bash">sudo cp /etc/mesos-master/ip /etc/mesos-master/hostname
</code></pre>
<p>Do this on each of your master servers.</p>

<h2 id="configure-marathon-on-the-master-servers">Configure Marathon on the Master Servers</h2>

<p>Now that Mesos is configured, we can configure Marathon, Mesosphere's clustered init system implementation.</p>

<p>Marathon will run on each of our master hosts, but only the leading master server will be able to actually schedule jobs.  The other Marathon instances will transparently proxy requests to the master server.</p>

<p>First, we need to set the hostname again for each server's Marathon instance.  Again, we will use the IP address, which we already have in a file.  We can copy that to the file location we need.</p>

<p>However, the Marathon configuration directory structure we need is not created automatically.  We will have to create the directory and then we can copy the file over:</p>
<pre class=""><code class="code-highlight language-bash">sudo mkdir -p /etc/marathon/conf
sudo cp /etc/mesos-master/hostname /etc/marathon/conf
</code></pre>
<p>Next, we need to define the list of <code>zookeeper</code> masters that Marathon will connect to for information and scheduling.  This is the same <code>zookeeper</code> connection string that we've been using for Mesos, so we can just copy the file.  We need to place it in a file called <code>master</code>:</p>
<pre class=""><code class="code-highlight language-bash">sudo cp /etc/mesos/zk /etc/marathon/conf/master
</code></pre>
<p>This will allow our Marathon service to connect to the Mesos cluster.  However, we also want Marathon to store its own state information in <code>zookeeper</code>.  For this, we will use the other <code>zookeeper</code> connection file as a base, and just modify the endpoint.</p>

<p>First, copy the file to the Marathon zookeeper location:</p>
<pre class=""><code class="code-highlight language-bash">sudo cp /etc/marathon/conf/master /etc/marathon/conf/zk
</code></pre>
<p>Next, open the file in your editor:</p>
<pre class=""><code class="code-highlight language-bash">sudo nano /etc/marathon/conf/zk
</code></pre>
<p>The only portion we need to modify in this file is the endpoint.  We will change it from <code>/mesos</code> to <code>/marathon</code>:</p>
<pre><code langs="">zk://192.0.2.1:2181,192.0.2.2:2181,192.0.2.3:2181/<span class="highlight">marathon</span>
</code></pre>
<p>This is all we need to do for our Marathon configuration.</p>

<h2 id="configure-service-init-rules-and-restart-services">Configure Service Init Rules and Restart Services</h2>

<p>Next, we will restart our master servers' services to use the settings that we have been configuring.</p>

<p>First, we will need to make sure that our master servers are only running the Mesos master process, and not running the slave process.  We can stop any currently running slave processes (this might fail, but that's okay since this is just to ensure the process is stopped).  We can also ensure that the server doesn't start the slave process at boot by creating an override file:</p>
<pre class=""><code class="code-highlight language-bash">sudo stop mesos-slave
echo manual | sudo tee /etc/init/mesos-slave.override
</code></pre>
<p>Now, all we need to do is restart <code>zookeeper</code>, which will set up our master elections.  We can then start our Mesos master and Marathon processes:</p>
<pre class=""><code class="code-highlight language-bash">sudo restart zookeeper
sudo start mesos-master
sudo start marathon
</code></pre>
<p>To get a peak at what you have just set up, visit one of your master servers in your web browser at port <code>5050</code>:</p>
<pre><code langs="">http://<span class="highlight">192.168.2.1</span>:5050
</code></pre>
<p>You should see the main Mesos interface.  You may be told you are being redirected to the active master depending on whether you connected to the elected leader or not.  Either way, the screen will look similar to this:</p>

<p><img src="https://assets.digitalocean.com/articles/mesos_cluster/mesos_main.png" alt="Mesos main interface"></p>

<p>This is a view of your cluster currently.  There is not much to see because there are no slave nodes available and no tasks started.</p>

<p>We have also configured Marathon, Mesosphere's long-running task controller.  This will be available at port <code>8080</code> on any of your masters:</p>

<p><img src="https://assets.digitalocean.com/articles/mesos_cluster/marathon_main.png" alt="Marathon main interface"></p>

<p>We will briefly go over how to use these interfaces once we get our slaves set up.</p>

<h2 id="configure-the-slave-servers">Configure the Slave Servers</h2>

<p>Now that we have our master servers configured, we can begin configuring our slave servers.</p>

<p>We have already configured our slaves with our masters servers' <code>zookeeper</code> connection information.  The slaves themselves do not run their own <code>zookeeper</code> instances.</p>

<p>We can stop any <code>zookeeper</code> process currently running on our slave nodes and create an override file so that it will not automatically start when the server reboots:</p>
<pre class=""><code class="code-highlight language-bash">sudo stop zookeeper
echo manual | sudo tee /etc/init/zookeeper.override
</code></pre>
<p>Next, we want to create another override file to make sure the Mesos master process doesn't start on our slave servers.  We will also ensure that it is stopped currently (this command may fail if the process is already stopped.  This is not a problem):</p>
<pre class=""><code class="code-highlight language-bash">echo manual | sudo tee /etc/init/mesos-master.override
sudo stop mesos-master
</code></pre>
<p>Next, we need to set the IP address and hostname, just as we did for our master servers.  This involves putting each node's IP address into a file, this time under the <code>/etc/mesos-slave</code> directory.  We will use this as the hostname as well, for easy access to services through the web interface:</p>
<pre><code langs="">echo <span class="highlight">192.168.2.51</span> | sudo tee /etc/mesos-slave/ip
sudo cp /etc/mesos-slave/ip /etc/mesos-slave/hostname
</code></pre>
<p>Again, use each slave server's individual IP address for the first command.  This will ensure that it is being bound to the correct interface.</p>

<p>Now, we have all of the pieces in place to start our Mesos slaves.  We just need to turn on the service:</p>
<pre class=""><code class="code-highlight language-bash">sudo start mesos-slave
</code></pre>
<p>Do this on each of your slave machines.</p>

<p>To see whether your slaves are successfully registering themselves in your cluster, go back to your one of your master servers at port <code>5050</code>:</p>
<pre><code langs="">http://<span class="highlight">192.168.2.1</span>:5050
</code></pre>
<p>You should see the number of active slaves at "3" now in the interface:</p>

<p><img src="https://assets.digitalocean.com/articles/mesos_cluster/three_slaves.png" alt="Mesos three slaves"></p>

<p>You can also see that the available resources in the interface has been updated to reflect the pooled resources of your slave machines:</p>

<p><img src="https://assets.digitalocean.com/articles/mesos_cluster/resources.png" alt="Mesos resources"></p>

<p>To get additional information about each of your slave machines, you can click on the "Slaves" link at the top of the interface.  This will give you an overview of each machine's resource contribution, as well as links to a page for each slave:</p>

<p><img src="https://assets.digitalocean.com/articles/mesos_cluster/slaves_page.png" alt="Mesos slaves page"></p>

<h2 id="starting-services-on-mesos-and-marathon">Starting Services on Mesos and Marathon</h2>

<p>Marathon is Mesosphere's utility for scheduling long-running tasks.  It is easy to think of Marathon as the init system for a Mesosphere cluster because it handles starting and stopping services, scheduling tasks, and making sure applications come back up if they go down.</p>

<p>You can add services and tasks to Marathon in a few different ways.  We will only be covering basic services.  Docker containers will be handled in a future guide.</p>

<h3 id="starting-a-service-through-the-web-interface">Starting a Service through the Web Interface</h3>

<p>The most straight forward way of getting a service running quickly on the cluster is to add an application through the Marathon web interface.</p>

<p>First, visit the Marathon web interface on one of your the master servers.  Remember, the Marathon interface is on port <code>8080</code>:</p>
<pre><code langs="">http://<span class="highlight">192.168.2.1</span>:8080
</code></pre>
<p>From here, you can click on the "New App" button in the upper-right corner.  This will pop up an overlay where you can add information about your new application:</p>

<p><img src="https://assets.digitalocean.com/articles/mesos_cluster/marathon_new_app.png" alt="Marathon new app"></p>

<p>Fill in the fields with the requirements for your app.  The only fields that are mandatory are:</p>

<ul>
<li>
<strong>ID</strong>: A unique ID selected by the user to identify a process.  This can be whatever you'd like, but must be unique.</li>
<li>
<strong>Command</strong>: This is the actual command that will be run by Marathon.  This is the process that will be monitored and restarted if it fails.</li>
</ul>
<p>Using this information, you can set up a simple service that just prints "hello" and sleeps for 10 seconds.  We will call this "hello":</p>

<p><img src="https://assets.digitalocean.com/articles/mesos_cluster/simple_app.png" alt="Marathon simple app"></p>

<p>When you return to the interface, the service will go from "Deploying" to "Running":</p>

<p><img src="https://assets.digitalocean.com/articles/mesos_cluster/running.png" alt="Marathon app running"></p>

<p>Every 10 seconds or so, the "Tasks/Instances" reading will go from "1/1" to "0/1" as the sleep amount passes and the service stops.  Marathon then automatically restarts the task again.  We can see this process more clearly in the Mesos web interface at port <code>5050</code>:</p>
<pre><code langs="">http://<span class="highlight">192.168.2.1</span>:5050
</code></pre>
<p>Here, you can see the process finishing and being restarted:</p>

<p><img src="https://assets.digitalocean.com/articles/mesos_cluster/restart_task.png" alt="Mesos restart task"></p>

<p>If you click on "Sandbox" and then "stdout" on any of the tasks, you can see the "hello" output being produced:</p>

<p><img src="https://assets.digitalocean.com/articles/mesos_cluster/output.png" alt="Mesos output"></p>

<h3 id="starting-a-service-through-the-api">Starting a Service through the API</h3>

<p>We can also submit services through Marathon's API.  This involves passing in a JSON object containing all of the fields that the overlay contained.</p>

<p>This is a relatively simple process.  Again, the only required fields are <code>id</code> for the process identifier and <code>cmd</code> which contains the actual command to run.</p>

<p>So we could create a JSON file called <code>hello.json</code> with this information:</p>
<pre class=""><code class="code-highlight language-bash">nano hello.json
</code></pre>
<p>Inside, the bare minimum specification would look like this:</p>
<pre class=""><code class="code-highlight language-json">{
    "id": "hello2",
    "cmd": "echo hello; sleep 10"
}
</code></pre>
<p>This service will work just fine.  However, if we truly want to emulate the service we created in the web UI, we have to add some additional fields.  These were defaulted in the web UI and we can replicate them here:</p>
<pre class=""><code class="code-highlight language-json">{
    "id": "hello2",
    "cmd": "echo hello; sleep 10",
    "mem": 16,
    "cpus": 0.1,
    "instances": 1,
    "disk": 0.0,
    "ports": [0]
}
</code></pre>
<p>Save and close the JSON file when you are finished.</p>

<p>Next, we can submit it using the Marathon API.  The target is one of our master's Marathon service at port <code>8080</code> and the endpoint is <code>/v2/apps</code>.  The data payload is our JSON file, which we can read into <code>curl</code> by using the <code>-d</code> flag with the <code>@</code> flag to indicate a file.</p>

<p>The command to submit will look like this:</p>
<pre><code langs="">curl -i -H 'Content-Type: application/json' -d@hello2.json <span class="highlight">192.168.2.1</span>:8080/v2/apps
</code></pre>
<p>If we look at the Marathon interface, we can see that it was successfully added.  It seems to have the exact same properties as our first service:</p>

<p><img src="https://assets.digitalocean.com/articles/mesos_cluster/two_services.png" alt="Marathon two services"></p>

<p>The new service can be monitored and accessed in exactly the same way as the first service.</p>
