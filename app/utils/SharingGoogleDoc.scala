//package utils
//import com.google.gdata.client.DocumentQuery
//import java.net.URL
//import com.google.gdata.client.docs.DocsService
//import com.google.gdata.data.docs.DocumentListFeed
//import com.google.gdata.data.acl.AclFeed
//import collection.JavaConversions._
//
//object SharingGoogleDoc extends App {
//  val client = new DocsService("yourCo-yourAppName-v1")
//  val query = new DocumentQuery(new URL("https://docs.google.com/feeds/documents/private/full/-/mine"))
//  val resultFeed = client.getFeed(query, classOf[DocumentListFeed])
//  val documentEntry = resultFeed.getEntries().get(0)
//
//  val aclFeed = client.getFeed(new URL(documentEntry.getAclFeedLink().getHref()), classOf[AclFeed])
//
//  for (entry <- aclFeed.getEntries) {
//    println(entry.getScope.getValue + " (" + entry.getScope().getType() + ") : " + entry.getRole().getValue())
//  }
//}