package controllers
import play.libs.WS
import scala.util.parsing.json.JSON
import play.api.libs.json.JsObject
import play.api.libs.json.JsValue
import com.codahale.jerkson.Json
import net.liftweb.json.{ parse, DefaultFormats }
import play.api.mvc.Controller





object Authentication extends Controller {
  
  implicit val formats = DefaultFormats
  
  def Auth(token:String)={
    
      val apiKey="cc38e5cc0a71f8795733254be3cc28d8b0678a69"
       val URL="https://rpxnow.com/api/v2/auth_info"
    
      val promise = WS.url( URL ).setQueryParameter("format","json").setQueryParameter("token",token).setQueryParameter("apiKey",apiKey).get
      val res = promise.get
      val body = res.getBody
      
      println(body)
      
      val jsonData=net.liftweb.json.parse(body)
        
      jsonData.children.contains("email")
      
        val userName=(jsonData \\ "profile" \\ "preferredUsername").extract[String]
        val name=(jsonData \\ "profile" \\ "displayName").extract[String]
        //val email=(jsonData \\ "profile" \\ "email").extract[String]
      
        Redirect(routes.BasicRegistration.basicRegistrationViaSocialSites("",userName,name))
     
  
  }

}