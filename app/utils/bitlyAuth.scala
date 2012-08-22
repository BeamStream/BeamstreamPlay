package utils
import play.libs.WS
import play.api.Play

object bitlyAuth extends App {

  /*
   * bit.ly Authentication and URL return
   */

  def returnShortUrlViabitly(longUrl:String): String = {
    val apiKey = ConversionUtility.decodeMe(Play.current.configuration.getString("bitly_apiKey").get) // Encrypted Key
    val URL = "https://api-ssl.bitly.com/v3/shorten"
    val promise = WS.url(URL).setQueryParameter("apiKey", apiKey).setQueryParameter("login", "beamstream").setQueryParameter("longUrl", longUrl).get
    val shortUrlJson = promise.get.asJson.toString
    shortUrlJson
  }
}