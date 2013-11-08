import scala.concurrent.Future
import models.School
import play.api.Application
import play.api.GlobalSettings
import play.api.mvc.RequestHeader
import play.api.mvc.Results.InternalServerError
import play.api.mvc.Results.NotFound
import play.api.mvc.Results.Redirect
import utils.ChatAvailiblity

object Global extends GlobalSettings {

  override def onStart(app: Application) {
    //    ReadingSpreadsheetUtil.readCSVOfSchools      //for Reading CSV of schools
    val listOfAllSchools = School.getAllSchools
    School.allSchoolsInDatabase ++= listOfAllSchools

  }

  override def onError(request: RequestHeader, ex: Throwable) = {
    Future.successful(Redirect("/error"))

  }

  override def onHandlerNotFound(request: RequestHeader) = {
    Future.successful(NotFound(
      views.html.error()))
  }

  override def onBadRequest(request: RequestHeader, error: String) = {
    Future.successful(InternalServerError(views.html.error()))
  }

}