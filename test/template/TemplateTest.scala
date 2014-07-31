package template

import scala.language.postfixOps
import org.specs2.mutable.Specification
import play.api.data.Forms._
import play.api.data.Forms.email
import play.api.data.Forms.nonEmptyText
import play.api.data.Forms.text
import play.api.templates.Html
import play.api.test.Helpers._
import play.api.mvc.Session
import play.api.mvc.Flash
import play.api.mvc.RequestHeader
import play.mvc.Results.Redirect
import play.api.test.TestServer
import play.api.libs.ws.WS

class TemplateTest extends Specification {

  "render betaUser template" in {
    val html = views.html.betaUser()
    contentType(html) must equalTo("text/html")
    contentAsString(html) must contain("Classwall")
  }

  "render browsemedia template" in {
    val html = views.html.browsemedia()
    contentType(html) must equalTo("text/html")
    contentAsString(html) must contain("Media")
  }

  "render classpage template" in {
    val html = views.html.classpage()
    contentType(html) must equalTo("text/html")
    contentAsString(html) must contain("Class")
  }

  "render error template" in {
    val html = views.html.error()
    contentType(html) must equalTo("text/html")
  }

  "render fetchtoken template" in {
    val html = views.html.fetchtoken()
    contentType(html) must equalTo("text/html")
  }

  "render header template" in {
    val html = views.html.header()
    contentType(html) must equalTo("text/html")
    contentAsString(html) must contain("Settings")
  }

  "render index template" in {
    val html = views.html.index("Himanshu")
    contentType(html) must equalTo("text/html")
    contentAsString(html) must contain("TEST")
  }

  "render login template" in {
    val html = views.html.login()
    contentType(html) must equalTo("text/html")
    contentAsString(html) must contain("Login")
  }

  "render main template" in {
    def data: Html = Html("")
    val html = views.html.main("Himanshu", "Body", data, data, data, data, data, data, data, data)(data)
    contentType(html) must equalTo("text/html")
    contentAsString(html) must contain("Himanshu")
  }

  "render plain template" in {
    val html = views.html.plain("Himanshu", "Title")(Html(""))
    contentType(html) must equalTo("text/html")
    contentAsString(html) must contain("Himanshu")
  }

  "render profile template" in {
    val html = views.html.profile()
    contentType(html) must equalTo("text/html")
    contentAsString(html) must contain("Profile")
  }

  "render recoverPassword template" in {
    val html = views.html.recoverPassword("Himanshu")
    contentType(html) must equalTo("text/html")
    contentAsString(html) must contain("Recover")
  }

  "render registration template" in {
    val html = views.html.registration("", None)
    contentType(html) must equalTo("text/html")
    contentAsString(html) must contain("Registration")
  }
  
  "render resetAccount template" in {
    val html = views.html.resetaccount()
    contentType(html) must equalTo("text/html")
    contentAsString(html) must contain("Reset")
  }

  "render showgoogledocs template" in {
    val html = views.html.showgoogledocs(List(("","")))
    contentType(html) must equalTo("text/html")
    contentAsString(html) must not contain("docs")
  }
  
  "render sidebar template" in {
    val html = views.html.sidebar()
    contentType(html) must equalTo("text/html")
    contentAsString(html) must contain("stream")
  }

  "render signup template" in {
    val html = views.html.signup()
    contentType(html) must equalTo("text/html")
    contentAsString(html) must contain("Sign up")
  }

  /**
   * TODO testing of stream page
   */
/*  "render stream template" in {
    implicit request => RequestHeader
    val html = views.html.stream("Ok")(Session(), Flash(), RequestHeader)
    contentType(html) must equalTo("text/html")
    contentAsString(html) must contain("Sign up")
  }
*/
  "render uploadgoogledocs template" in {
    val html = views.html.uploadgoogledocs()
    contentType(html) must equalTo("text/html")
    contentAsString(html) must contain("upload")
  }
  
  /*"run in a server" in {
  running(TestServer(9000)) {
  
    await(WS.url("http://localhost:9000/login").get).status must equalTo(OK)
  
  }*/
  
  /*"run in a browser" in {
  running(TestServer(9000), HTMLUNIT) { browser =>
    
    browser.goTo("http://localhost:9000/login")
    browser.$("#title").getTexts().get(0) must equalTo("Login")*/
    
    /*browser.$("a").click()
    
    browser.url must equalTo("http://localhost:3333/Coco")
    browser.$("#title").getTexts().get(0) must equalTo("Hello Coco")*/

  /*}
}*/
  
}
