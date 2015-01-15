---
layout: page
title: Mesos architecture
permalink: /architecture/
---

In the following we provide you with a technical description of the Mesos Architecture.
The picture and its scheduling example are directly taken from the Apache Mesos Project Page.

<div class='fig figcenter fighighlight'>
  <img src="{{'/assets/mesosarchitecture.jpg' | prepend: site.baseurl }}">
</div>

The above figure shows the main components of Mesos. Mesos consists of a master daemon that manages slave daemons running on each cluster node, and mesos applications (also called frameworks) that run tasks on these slaves.

The master enables fine-grained sharing of resources (cpu, ram, …) across applications by making them resource offers. Each resource offer contains a list of . The master decides how many resources to offer to each framework according to a given organizational policy, such as fair sharing, or strict priority. To support a diverse set of policies, the master employs a modular architecture that makes it easy to add new allocation modules via a plugin mechanism.

A framework running on top of Mesos consists of two components: a scheduler that registers with the master to be offered resources, and an executor process that is launched on slave nodes to run the framework’s tasks (/documentation/latest/see the App/Framework development guide for more details about application schedulers and executors). While the master determines how many resources are offered to each framework, the frameworks' schedulers select which of the offered resources to use. When a frameworks accepts offered resources, it passes to Mesos a description of the tasks it wants to run on them. In turn, Mesos launches the tasks on the corresponding slaves.


<div class='fig figcenter fighighlight'>
  <img src="{{ '/assets/architecture-example.jpg' | prepend: site.baseurl }}">
</div>

Let’s walk through the events in the figure.

1. Slave 1 reports to the master that it has 4 CPUs and 4 GB of memory free. 
2. The master then invokes the allocation policy module, which tells it that framework 1 should be offered all available resources.
3. The master sends a resource offer describing what is available on slave 1 to framework 1.
4. The framework’s scheduler replies to the master with information about two tasks to run on the slave, using <2 CPUs, 1 GB RAM> for the first task, and <1 CPUs, 2 GB RAM> for the second task.
5. Finally, the master sends the tasks to the slave, which allocates appropriate resources to the framework’s executor, which in turn launches the two tasks (depicted with dotted-line borders in the figure). Because 1 CPU and 1 GB of RAM are still unallocated, the allocation module may now offer them to framework 2.

In addition, this resource offer process repeats when tasks finish and new resources become free.
