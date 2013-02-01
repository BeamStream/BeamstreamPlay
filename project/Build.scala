import sbt._
import Keys._
import PlayProject._

object ApplicationBuild extends Build {

  val appName = "BeamstreamPlay"
  val appVersion = "1.0"

  val appDependencies = Seq(
    "com.mongodb.casbah" %% "casbah" % "2.1.5-1",
    "com.novus" %% "salat-core" % "0.0.8-20120223",
    "org.scalatest" %% "scalatest" % "1.6.1",
    "joda-time" % "joda-time" % "2.0",
    "javax.mail" % "mail" % "1.4.1",
    "org.scalatra" %% "scalatra-lift-json" % "2.0.4",
    "com.amazonaws" % "aws-java-sdk" % "1.2.1",
    "org.skife.com.typesafe.config" % "typesafe-config" % "0.3.0",
    "commons-codec" % "commons-codec" % "1.6",
    "org.neo4j" % "neo4j-remote-graphdb" % "0.9-1.3.M01",
    "org.apache.poi" % "poi" % "3.8",
    "org.apache.poi" % "poi-ooxml" % "3.8",
    "net.sf.opencsv" % "opencsv" % "2.1",
    "xuggle" % "xuggle-xuggler" % "5.4",
    "org.joda" % "joda-convert" % "1.1")

  resolvers += "xuggle repo" at "http://xuggle.googlecode.com/svn/trunk/repo/share/java/"
  resolvers += "repo.novus snaps" at "http://repo.novus.com/snapshots/"
  resolvers += "Novus Release Repository" at "http://repo.novus.com/releases/"

  def customLessEntryPoints(base: File): PathFinder = (
    (base / "app" / "assets" / "stylesheets" / "bootstrap" * "bootstrap.less") +++
    (base / "app" / "assets" / "stylesheets" / "bootstrap" * "main.less") +++
    (base / "app" / "assets" / "stylesheets" / "bootstrap" * "sprites.less") +++
    (base / "app" / "assets" / "stylesheets" * "*.less"))

  val main = PlayProject(appName, appVersion, appDependencies, mainLang = SCALA).settings(
    lessEntryPoints <<= baseDirectory(customLessEntryPoints),

    resolvers += "xuggle repo" at "http://xuggle.googlecode.com/svn/trunk/repo/share/java/").settings(

      resolvers += "Sonatype Nexus Snapshots" at "https://oss.sonatype.org/content/repositories/snapshots",

      resolvers += "Sonatype Nexus Releases" at "https://oss.sonatype.org/content/repositories/releases")
}
