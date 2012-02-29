import sbt._
import Keys._
import PlayProject._

object ApplicationBuild extends Build {

  val appName = "BeamstreamPlay"
  val appVersion = "1.0"

  val appDependencies = Seq(
    "com.mongodb.casbah" %% "casbah" % "2.1.5-1",
    "com.novus" %% "salat-core" % "0.0.8-SNAPSHOT" // Add your project dependencies here,
    )
  // Only compile the bootstrap bootstrap.less file and any other *.less file in the stylesheets directory
  def customLessEntryPoints(base: File): PathFinder = (
    (base / "app" / "assets" / "stylesheets" / "bootstrap" * "bootstrap.less") +++
    (base / "app" / "assets" / "stylesheets" * "*.less"))

  val main = PlayProject(appName, appVersion, mainLang = SCALA).settings(
   lessEntryPoints <<= baseDirectory(customLessEntryPoints)
 )

}
