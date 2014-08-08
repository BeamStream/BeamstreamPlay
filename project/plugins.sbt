// Comment to get more information during initialization
logLevel := Level.Warn

// The Typesafe repository 
resolvers += "Typesafe repository" at "http://repo.typesafe.com/typesafe/releases/"

resolvers += "softprops-maven" at "http://dl.bintray.com/content/softprops/maven"

resolvers += "sonatype-releases" at "https://oss.sonatype.org/content/repositories/releases/"

// Use the Play sbt plugin for Play projects
addSbtPlugin("com.typesafe.play" % "sbt-plugin" % "2.2.0")

addSbtPlugin("com.sqality.scct" % "sbt-scct" % "0.3")

addSbtPlugin("org.scalastyle" %% "scalastyle-sbt-plugin" % "0.5.0")