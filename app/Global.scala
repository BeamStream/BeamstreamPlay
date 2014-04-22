import java.io.File
import scala.concurrent.Future
import com.typesafe.config.ConfigFactory
import actors.Cleaner
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

object Global extends GlobalSettings {

  override def onStart(app: Application) {
    try {
      val filePath = Global.getClass().getClassLoader().getResource("ListofSchools.csv")
      if (School.getAllSchools.length == 0)
        ReadingSpreadsheetUtil.readCSVOfSchools(new File(filePath.toURI()))
    } catch {
      case ex: Exception => ex.printStackTrace() //for Reading CSV of schools
    }
    val listOfAllSchools = School.getAllSchools
    School.allSchoolsInDatabase = Nil
    School.allSchoolsInDatabase ++= listOfAllSchools
    Cleaner.makeUsersOfflineIfNotAvailable
  }

  /* override def onLoadConfig(config: Configuration, path: File, classloader: ClassLoader, mode: Mode.Mode): Configuration = {
    Logger.info("Apllication  configuration file is loading with " + mode.toString + "  mode")
    val modeSpecificConfig = config ++ Configuration(ConfigFactory.load(s"${mode.toString.toLowerCase}.conf"))
    super.onLoadConfig(modeSpecificConfig, path, classloader, mode)
  }*/

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