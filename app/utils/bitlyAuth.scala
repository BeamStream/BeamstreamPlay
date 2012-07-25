package utils
import play.libs.WS

object bitlyTest extends App {

  /*
   * bit.ly Authentication and URL return
   */

  def bitlyAuth(longUrl:String): String = {
    val apiKey = "R_6b9759ba74f1131661a2fd739b5f8b28"
    val URL = "https://api-ssl.bitly.com/v3/shorten"
    val promise = WS.url(URL).setQueryParameter("apiKey", apiKey).setQueryParameter("login", "beamstream").setQueryParameter("longUrl", longUrl).get
    val shortUrlJson = promise.get.asJson.toString
    shortUrlJson
  }

}