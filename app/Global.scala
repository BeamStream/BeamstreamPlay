import java.io.File
import scala.concurrent.Future
import com.typesafe.config.ConfigFactory
import actors.Cleaner
import models.SchoolDAO
import models.School
import play.api.Application
import play.api.Configuration
import play.api.GlobalSettings
import play.api.Logger
import play.api.Mode
import play.api.mvc.RequestHeader
import play.api.mvc.Results.InternalServerError
import play.api.mvc.Results.NotFound
import play.api.mvc.Results.Redirect
import play.api.mvc.SimpleResult
import scala.concurrent.Future
import play.api.mvc.SimpleResult
import utils.ReadingSpreadsheetUtil
import java.io.InputStream
import org.bson.types.ObjectId
import utils.MongoHQConfig._

object Global extends GlobalSettings {

  override def onStart(app: Application) {
    try {
      mongoDB.dropDatabase()
      val filePath = Global.getClass().getClassLoader().getResourceAsStream("ListofSchools.csv")
      SchoolDAO.insert(new School(new ObjectId, "", ""))
      if (School.getAllSchools.length < 7487) {
        ReadingSpreadsheetUtil.readCSVOfSchools(filePath)
      }
    } catch {
      case ex: Exception => Logger.error("This error occured while Reading School List CSV file :- ", ex) //for Reading CSV of schools
    }
    val listOfAllSchools = School.getAllSchools
    School.allSchoolsInDatabase = Nil
    School.allSchoolsInDatabase ++= listOfAllSchools
    Cleaner.makeUsersOfflineIfNotAvailable
  }

  override def onError(request: RequestHeader, ex: Throwable): Future[SimpleResult] = {
    Future.successful(Redirect("/error"))
  }

  override def onHandlerNotFound(request: RequestHeader): Future[SimpleResult] = {
    Future.successful(NotFound(
      views.html.error()))
  }

  override def onBadRequest(request: RequestHeader, error: String): Future[SimpleResult] = {
    Future.successful(InternalServerError(views.html.error()))
  }

}
