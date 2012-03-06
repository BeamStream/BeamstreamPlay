import sbt._
import Keys._
import PlayProject._

object ApplicationBuild extends Build {

  val appName = "BeamstreamPlay"
  val appVersion = "1.0"

 

  resolvers += "Scala-Tools Sona  Repository" at "http://oss.sonatype.org/content/groups/scala-tools/"

  val appDependencies = Seq(
    "com.mongodb.casbah" %% "casbah" % "2.1.5-1",
    "com.novus" %% "salat-core" % "0.0.8-SNAPSHOT", // Add your project dependencies here,
    "org.scalatest" %% "scalatest" % "1.6.1",
    "joda-time" % "joda-time" % "2.0",
    "org.joda" % "joda-convert" % "1.1")

  def customLessEntryPoints(base: File): PathFinder = (
    (base / "app" / "assets" / "stylesheets" / "bootstrap" * "bootstrap.less") +++
    (base / "app" / "assets" / "stylesheets" * "*.less"))
  val main = PlayProject(appName, appVersion, appDependencies, mainLang = SCALA).settings(
    lessEntryPoints <<= baseDirectory(customLessEntryPoints))
}
