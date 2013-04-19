import play.api._
import utils.ReadingSpreadsheetUtil
import play.api.mvc.RequestHeader
import play.api.mvc._
import play.api.mvc.SimpleResult._
import play.api.mvc.Result
import play.api.mvc.Results._
object Global extends GlobalSettings {

  override def onStart(app: Application) {
    //    ReadingSpreadsheetUtil.readCSVOfSchools
  }

   override def onHandlerNotFound(request: RequestHeader): Result = {
    InternalServerError(views.html.error())
  }
}