import sbt._
import Keys._
import PlayProject._

object ApplicationBuild extends Build {

  val appName = "BeamstreamPlay"
  val appVersion = "1.0"

  val appDependencies = Seq(
    "com.mongodb.casbah" %% "casbah" % "2.1.5-1",
    //"com.novus" %% "salat-core" % "0.0.8-SNAPSHOT",
    "com.novus" %% "salat-core" % "0.0.8-20120223",
    "org.scalatest" %% "scalatest" % "1.6.1",
    "joda-time" % "joda-time" % "2.0",
    "javax.mail" % "mail" % "1.4.1",
    "org.scalatra" %% "scalatra-lift-json" % "2.0.4",
    "org.joda" % "joda-convert" % "1.1")

  resolvers += "repo.novus snaps" at "http://repo.novus.com/snapshots/"
  resolvers += "Novus Release Repository" at "http://repo.novus.com/releases/"

  def customLessEntryPoints(base: File): PathFinder = (
    (base / "app" / "assets" / "stylesheets" / "bootstrap" * "bootstrap.less") +++
    (base / "app" / "assets" / "stylesheets" / "bootstrap" * "main.less") +++
    (base / "app" / "assets" / "stylesheets" / "bootstrap" * "sprites.less") +++
    (base / "app" / "assets" / "stylesheets" * "*.less"))

  val main = PlayProject(appName, appVersion, appDependencies, mainLang = SCALA).settings(
    lessEntryPoints <<= baseDirectory(customLessEntryPoints))
}
