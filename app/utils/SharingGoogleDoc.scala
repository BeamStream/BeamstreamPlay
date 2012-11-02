//package utils
//
//import com.google.gdata.client._
//import com.google.gdata.client.docs._
//import com.google.gdata.data.docs._
//import com.google.gdata.data.acl._
//import com.google.gdata.util._
//import java.net.URL
//import collection.JavaConversions._
//
//object SharingGoogleDoc {
//
//  val client = new DocsService("Knoldus-beamstream-v1")
//  client.setProtocolVersion(DocsService.Versions.V2)
//
//  def showAllDocs {
//    val feedUri = new URL("https://docs.google.com/feeds/documents/private/full/");
//    val feed = client.getFeed(feedUri, classOf[DocumentListFeed]);
//
//    for (entry <- feed.getEntries()) {
//      println(entry)
//    }
//  }
//  def main(args: Array[String]) {
//    showAllDocs
//  }
//}


