---
layout: page
mathjax: true
permalink: /hints/
---

This is an introductory section designed to give important hints for working on a virtual cluster. 

#### Course Setup
OpenStack is running on a remote machine called dataminer with 24 cores. Every participant has access dataminer via SSH on Port 8574.
In order to access the OpenStack Dashboard Horizon, we need to call a specific ip address from the remote machine.
From Horizon, we can then launch our virtual instances. 


#### SOCKS Proxy to Dataminer
In the first weeks, the proposed (X11 redirection) way turned out to be fairly slow, especially when not in the Uni network. 
Lags in the magnitude of seconds are the norm and hence working remotely (for example at home) was nearly impossible.

Hence we proposed an alternative which turned out to be an essential hack for general lab course:

We will use a SOCKS Proxy to forward HTTP Requests from our server to dataminer

````
ssh -TND [LOCALPORT] -p 8574 [USERNAME]@dataminer.informatik.tu-muenchen.de
````

(Hint: We recommend to use a Chrome Extension called Proxy Helper to easily switch back and forth)

#### Screen
Working remotely via SSH but having bad/unstable internet access? Using screen allows you to save your progress. 

````
screen     # to enter a new screen session and open a new window
screen -ls     # to list all screen sessions currently active for your user
screen -r <pid>   # reconnect to a detached session
Ctral+a then Ctrl+d     # detach from screen session but keep it running 
Ctrl+a then type :quit    # to destroy current screen session
````

#### Max number of cores
Try not to launch more VCPUs than physical cores in total (Otherwise the virtual network will be paused).


<a name='reading'></a>
#### Further Reading

Here are some (optional) links you may find interesting for further reading:

- [A Few Useful Things to Know about Machine Learning](http://homes.cs.washington.edu/~pedrod/papers/cacm12.pdf), where especially section 6 is related but the whole paper is a warmly recommended reading.

- [SOCKS Proxy](http://wiki.vpslink.com/Instant_SOCKS_Proxy_over_SSH), how-to setup a SOCKS Proxy
