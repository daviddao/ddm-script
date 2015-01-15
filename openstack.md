---
layout: page
title: OpenStack Setup
permalink: /openstack/
---

### Lothars Instantiation Cheatsheet
1. Login in to dataminer with SOCKS Proxy
2. Login to OpenStack
3. create a router
1. assign a network: ext-net and select as gateway
4. create a network 172.16.2.0/24 and a subnetwork inside
5. add a connecting interface to the subnetwork to the router 172.16.2.1
6. switch to computing and create a vm:
1. under access and security: give a name and paste my public key in there
2. under networking add LR_network as networks
7. in Access & Securty of compute (left menue) configure firewall rules:
1. Rule: ALL ICMP, Direction: Ingress, Remote: CIDR CIDR: 0.0.0.0/0
2. Rule: SSH Remote:CIDR CIDR: 0.0.0.0/0
8. under compute instances: Actions: more -> associate floating IP, and assign 192.168.... IP to the machine 
(machine is visible in both networks)
9. login from dataminer with ssh to 192.168....) address (cirros, "cubswin:)")


<div class='fig figcenter'>
	<img src="{{'/assets/network.png' | prepend: site.baseurl }}">
</div>

### Automatic DNS Configuration
It can be annoying to configure DNS manually on each launched instance.
(Otherwise it is not possible to download essential linux tools)
Therefore, it is recommended to (additionally to the Cheatsheet) edit the network settings.

1. Edit Subnet
2. Go to Subnet details
3. Add the IP of publicly available DNS nameservers 

<div class='fig figcenter'>
	<img src="{{'/assets/editnet.png' | prepend: site.baseurl }}">
</div>

