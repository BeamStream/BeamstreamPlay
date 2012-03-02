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
 
  
  def customLessEntryPoints(base: File): PathFinder = (
      (base  / "app" / "assets" / "stylesheets" / "bootstrap" * "bootstrap.less") +++
      (base / "app" / "assets" / "stylesheets" * "*.less")
  )

  val main = PlayProject(appName, appVersion, appDependencies).settings(
      lessEntryPoints <<= baseDirectory(customLessEntryPoints())
  )

}