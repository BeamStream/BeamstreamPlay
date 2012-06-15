
logLevel := Level.Warn


resolvers += "Typesafe repository" at "http://repo.typesafe.com/typesafe/releases/"
 resolvers += Classpaths.typesafeResolver
           

libraryDependencies <+= sbtVersion(v => "com.github.siasia" %% "xsbt-web-plugin" % (v+"-0.2.11"))
addSbtPlugin("com.typesafe.startscript" % "xsbt-start-script-plugin" % "0.5.1")
addSbtPlugin("play" % "sbt-plugin" % "2.0")

