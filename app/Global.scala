import scala.concurrent.Future
import models.School
import play.api.Application
import play.api.GlobalSettings
import play.api.mvc.RequestHeader
import play.api.mvc.Results.InternalServerError
import play.api.mvc.Results.NotFound
import play.api.mvc.Results.Redirect
import actors.Cleaner

object Global extends GlobalSettings {

  override def onStart(app: Application) {
    //    ReadingSpreadsheetUtil.readCSVOfSchools      //for Reading CSV of schools
    val listOfAllSchools = School.getAllSchools
    School.allSchoolsInDatabase = Nil
    println(">>>>>>>>>> Before" + School.allSchoolsInDatabase.size)
    School.allSchoolsInDatabase ++= listOfAllSchools
    println(">>>>>>>>>> After" + School.allSchoolsInDatabase.size)
    Cleaner.makeUsersOfflineIfNotAvailable

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