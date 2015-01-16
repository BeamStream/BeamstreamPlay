package utils

import play.api.mvc._
import org.apache.http.impl.client.DefaultHttpClient
import org.apache.http.client.methods.HttpGet

object LinkPreview {
  def getRestContent(url: String): String = {
    
    val httpClient = new DefaultHttpClient()
    val httpResponse = httpClient.execute(new HttpGet(url))
    val entity = httpResponse.getEntity()
    var content = ""
    var title =""
    /*var meta=""*/
    var sendData=""
    
    val inputStream = entity.getContent()
    content = io.Source.fromInputStream(inputStream).getLines.mkString
    val titlestartIndex = content.indexOf("<title>")
    val titlelastIndex = content.indexOf("</title>")
    title=content.substring(titlestartIndex + 7,titlelastIndex)
    
    /*val metastartIndex = content.indexOf("name=\"description\"")
    meta=content.substring(metastartIndex +10,metastartIndex+200)*/
    sendData="<div class=\"embed\"><h3><a>"+url+"</a></h3>"+"<br/>"+"<h5>"+title+"</h5>"+"<br/></div>"
    
    
    inputStream.close
    httpClient.getConnectionManager().shutdown()
   return sendData
    
  }
}