package utils
import play.api.Play
import play.api.libs.ws.WS
import scala.concurrent.ExecutionContext.Implicits.global
import scala.concurrent.Await
import scala.concurrent.duration._
object BitlyAuthUtil {

  /**
   * bit.ly Authentication and URL return
   * param longUrl is the URL that needs to be shortened
   */

  def returnShortUrlViabitly(longUrl: String): String = {
    val apiKey = ConversionUtility.decodeMe(Play.current.configuration.getString("bitly_apiKey").get) // Encrypted Key
    val URL = "https://api-ssl.bitly.com/v3/shorten"
    val promise = WS.url(URL).withQueryString("apiKey" -> apiKey).withQueryString("login" -> "beamstream").withQueryString("longUrl" -> longUrl).get
    val a = promise.map { response =>
      response.json.toString
    }
    Await.result(a, 10 seconds)

  }
}