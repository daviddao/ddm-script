---
layout: page
mathjax: true
permalink: /mahout/
---

This is section gives important hints for how to install and use Mahout.

#### Get Maven

1. Get [Maven](http://maven.apache.org/download.cgi)
2. Extract the distribution archive, i.e. `apache-maven-3.2.5-bin.tar.gz` to the directory you wish to install Maven 3.2.5. These instructions assume you chose `/usr/local/apache-maven`. The subdirectory apache-maven-3.2.5 will be created from the archive.
3. In a command terminal, add the `M2_HOME` environment variable, e.g. export `M2_HOME=/usr/local/apache-maven/apache-maven-3.2.5`.
4. Add the M2 environment variable, e.g. export `M2=$M2_HOME/bin`.
5. Optional: Add the `MAVEN_OPTS` environment variable to specify JVM properties, e.g. `export MAVEN_OPTS="-Xms256m -Xmx512m"`. This environment variable can be used to supply extra options to Maven.
6. Add M2 environment variable to your path, e.g. `export PATH=$M2:$PATH`.
7. Make sure that `JAVA_HOME` is set to the location of your JDK, e.g. `export JAVA_HOME=/usr/java/jdk1.7.0_51` and that `$JAVA_HOME/bin` is in your `PATH` environment variable.
8. Run `mvn --version` to verify that it is correctly installed.

#### Install Mahout

1. Get Mahout from [Github](https://github.com/apache/mahout)
2. To compile, do `mvn -DskipTests clean install`
3. To run tests do `mvn test`
4. To set up your IDE, do `mvn eclipse:eclipse` or `mvn idea:idea`