---
layout: page
mathjax: true
permalink: /ubuntu/
---


## Include Ubuntu into OpenStack  

One requirement for this course is good knowledge in unix and experience in working with the terminal.
The course-provided Debian System suffered from many disk partition problems and missed elementary unix tools.
However, it is possible to include a new OS in OpenStack. 
Therefore, we decided to include a [ubuntu cloud image version](https://cloud-images.ubuntu.com/).
Ubuntu offers a cloud-optimized version which comes with useful pre-settings and saved a lot of configuration time.

1. Login to OpenStack
2. Go to Images
3. Create a new Image
4. Download an ubuntu image or save the image location
5. Choose as format QCOW2

Now you are ready to start virtual machines based on ubuntu

## Saving snapshots 

Launch your ubuntu instance with minimal flavor and set it up for your purposes. Now save it as a snapshot.
This snapshot can now be used as a new starting image and saves you the setup time. It can also be extended regarding its memory allocation and CPUs.
However, it can not be reduced and therefore we recommend to snapshot instances with minimal flavor.

## Unknown Host Problem

Using our provided Ubuntu LTE distribution, you will encounter a "unknown host" problem using sudo. 
Fix this by editing `/etc/hosts` and add `127.0.1.1 [hostname].localdomain [hostname]`
This is like a local DNS to the machine. It maps `[hostname]` to 127.0.1.1 and also maps `[hostname].localdomain` to 127.0.1.1 You might need to also map `localhost` to 127.0.1.1, in that case the line to add becomes : `127.0.1.1 [hostname].localdomain [hostname] `