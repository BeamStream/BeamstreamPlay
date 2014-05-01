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
import java.io.InputStream

object Global extends GlobalSettings {

  override def onStart(app: Application) {
    try {
      //      val filePath = Play.classloader.getResource("ListofSchools.csv")//.getFile("conf/csv/ListofSchools.csv")
      val filePath = Global.getClass().getClassLoader().getResourceAsStream("ListofSchools.csv")
      Logger.info("Reading CSV file>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>")
      println("1111111111111111111111")
//      if (School.getAllSchools.length < 7487) {
        println(filePath + ">>>>>>>>>>>>>>>>>>>>>>>")
        println("2222222222222222222222222222") //InputStream)
        ReadingSpreadsheetUtil.readCSVOfSchools(filePath)
        println("33333333333333333333333")
//      }
    } catch {
      case ex: Exception => println("444444444444444444444444");ex.printStackTrace() //for Reading CSV of schools
    }
    val i = 5/0;	
    println("55555555555555555555")
    val listOfAllSchools = School.getAllSchools
    println("66666666666666666666666")
    School.allSchoolsInDatabase = Nil
    println("77777777777777777")
    School.allSchoolsInDatabase ++= listOfAllSchools
    println("8888888888888888888888888")
    Cleaner.makeUsersOfflineIfNotAvailable
    println("9999999999999999999999999999999999")
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