package template.otherTemplates

import org.specs2.mutable.Specification
import play.api.test.Helpers._

class OtherTemplatesTest extends Specification {

  "render calendar template" in {
    val html = views.html.calendar.calendar("Hello")
    contentType(html) must equalTo("text/html")
    contentAsString(html) must contain("Calendar")
  }
  
  "render deadlines template" in {
    val html = views.html.deadlines.deadlines("Hello")
    contentType(html) must equalTo("text/html")
    contentAsString(html) must contain("Recover")
  }
  
  "render discussions template" in {
    val html = views.html.discussions.discussions("Hello")
    contentType(html) must equalTo("text/html")
    contentAsString(html) must contain("Discussion")
  }
  
  "render overview template" in {
    val html = views.html.overview.overview("Hello")
    contentType(html) must equalTo("text/html")
    contentAsString(html) must contain("Overview")
  }
  
  "render questions template" in {
    val html = views.html.questions.questions("Hello")
    contentType(html) must equalTo("text/html")
    contentAsString(html) must contain("Questions")
  }
  
}