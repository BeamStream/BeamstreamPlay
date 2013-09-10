import play.api._
import play.api.mvc.Results.InternalServerError
import play.api.Logger
import play.api.mvc.RequestHeader
import play.api.mvc.SimpleResult
import play.api.mvc.Result
import play.api.mvc.Results.Redirect
import models.School
import akka.actor.ActorSystem
import akka.actor.Props
import actors.ChatActorObject

object Global extends GlobalSettings {

  override def onStart(app: Application) {
    //    ReadingSpreadsheetUtil.readCSVOfSchools
    println("***Before" + School.allSchoolsInDatabase.size)
    val listOfAllSchools = School.getAllSchools
    School.allSchoolsInDatabase ++= listOfAllSchools
    println("***After" + School.allSchoolsInDatabase.size)

  }

  override def onError(request: RequestHeader, ex: Throwable) = {
    Redirect("/error")

  }
  override def onHandlerNotFound(request: RequestHeader): Result = {
    InternalServerError(views.html.error())
  }

  override def onBadRequest(request: RequestHeader, error: String) = {
    InternalServerError(views.html.error())
  }

}