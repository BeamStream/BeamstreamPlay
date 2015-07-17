name := "BeamstreamPlay"

version := "1.0-SNAPSHOT"

libraryDependencies ++= Seq(
   "org.mongodb"    %% "casbah"                 % "2.6.3",
   "com.novus"      % "salat-core_2.10"         % "1.9.2",
   "org.scalatest"  % "scalatest_2.10"          % "2.0.M8",
   "joda-time"      % "joda-time"               % "2.0",
   "org.scalatra"   % "scalatra-lift-json_2.10" % "2.0.5",
   "com.amazonaws"  % "aws-java-sdk"            % "1.2.1",
 //"commons-codec"  % "commons-codec"           % "1.8",
 //"org.neo4j"      % "neo4j-remote-graphdb"    % "0.9-1.3.M01",
   "org.apache.poi" % "poi"                     % "3.8",
   "org.apache.poi" % "poi-ooxml"               % "3.8",
   "net.sf.opencsv" % "opencsv"                 % "2.1",
   "xuggle"         % "xuggle-xuggler"          % "5.4",
   "org.joda"       % "joda-convert"            % "1.1",
   "org.twitter4j"  % "twitter4j-core"          % "4.0.2",
   "org.scribe"     % "scribe"                  % "1.3.5",
   "org.neo4j"      % "neo4j-kernel"            % "2.1.3",
   "com.googlecode.json-simple" % "json-simple" % "1.1.1",
   "com.restfb"     % "restfb"                  % "1.6.14",
	jdbc,
    anorm,
    cache,
    "com.sksamuel.scrimage" %% "scrimage-core" % "2.0.1",
    "com.sksamuel.scrimage" %% "scrimage-io" % "2.0.1",
    "com.sksamuel.scrimage" %% "scrimage-filters" % "2.0.1",
    "com.drewnoakes" % "metadata-extractor" % "2.6.2",
    "org.apache.xmlgraphics" % "batik-codec" % "1.7"
) 

 

 
javaOptions in Test += "-Dconfig.file=conf/test.conf"

resolvers += "xuggle repo" at "http://xuggle.googlecode.com/svn/trunk/repo/share/java/"

resolvers += "Google Api client" at "http://mavenrepo.google-api-java-client.googlecode.com/hg/"

resolvers += "Sonatype Nexus Snapshots" at "https://oss.sonatype.org/content/repositories/snapshots"

resolvers += "Sonatype Nexus Releases" at "https://oss.sonatype.org/content/repositories/releases"

org.scalastyle.sbt.ScalastylePlugin.Settings

ScctPlugin.instrumentSettings

parallelExecution in Test := false

parallelExecution in ScctTest := false

play.Project.playScalaSettings

scalacOptions += "-feature"