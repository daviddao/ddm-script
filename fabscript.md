---
layout: page
title: "Cluster management: Automatic Setup using FabScript (Coming soon)"
permalink: fabscript 
---

View this on [Github](https://github.com/greenify/hadoop-auto-conf)

[Fabric](https://github.com/fabric/fabric Fabric)
--------------------------------------------------

* like chef, but more fine-controlled and in Python
* no recipes, but awesome (light-weight) [https://github.com/sebastien/cuisine cuisine](cuisine is a high-level API for fabric)

```
apt-get install fabric
```

Small tasks (without python script)
----------------------------------

```
fab -H cip19,cip20 -- uname -a
```

### More complicated stuff (use python)

fabfile.py

```
from fabric.api import *  # e.g. run, env, local

def host():
    run('uname -a')
```


`> fab -H cip19,cip20 host`

```
[cip19] Executing task 'host'
[cip19] run: uname -a
[cip19] out: Linux gallenroehrling.cip.ifi.lmu.de 3.13.0-40-generic #69-Ubuntu SMP Thu Nov 13 17:53:56 UTC 2014 x86_64 x86_64 x86_64 GNU/Linux
[cip19] out: 

[cip20] Executing task 'host'
[cip20] run: uname -a
[cip20] out: Linux gelbfuss.cip.ifi.lmu.de 3.13.0-40-generic #69-Ubuntu SMP Thu Nov 13 17:53:56 UTC 2014 x86_64 x86_64 x86_64 GNU/Linux
[cip20] out: 


Done.
Disconnecting from wilzbach@gallenroehrling... done.
Disconnecting from wilzbach@gelbfuss... done.
```

### More fancy stuff

#### 1. Capture output

```
result = run("ls -l /var/www")
```

#### 2. Upload data

```
# download
get("/backup/db.gz", "./db.gz")
# upload
put("/local/path/to/app.tar.gz", "/tmp/trunk/app.tar.gz", mode=644)
```

### 3. Contexts

```
with cd("/tmp/trunk"):
    items = sudo("ls -l")
# locally
with lcd("/tmp/trunk"):
    items = local("ls -l", capture=True)
```

### 4. Roles (Master, Client)

```
> fab -R webservers get_version()
```

```

env.roledefs = {
    'webservers': ['www1', 'www2', 'www3', 'www4', 'www5'],
    'databases': ['db1', 'db2']
}
def get_version():
    run('cat /etc/issue')
    print env.roles
```


Cuisine 
-------------

```
import cuisine

cuisine.package_ensure("python", "python-dev", "django")
cuisine.user_ensure("hadoop", uid=2000)
cuisine.upstart_ensure("django")
```

* File I/O (-> update files)
* Group management
* Package management
* Text templates (ensure_line)
* SSH (ssh_authorize, ssh_keygen)

### Fabric commands

#### SSH

* run (fabric.operations.run)
* sudo (fabric.operations.sudo)
* local (fabric.operations.local)
* get (fabric.operations.get)
* put (fabric.operations.put)
* prompt (fabric.operations.prompt)
* reboot (fabric.operations.reboot)

#### Context

* cd (fabric.context_managers.cd)
* lcd (fabric.context_managers.lcd)
* path (fabric.context_managers.path)
* settings (fabric.context_managers.settings)
* prefix (fabric.context_managers.prefix)

#### pssh

* does not read the global sshrc
* very limited options
