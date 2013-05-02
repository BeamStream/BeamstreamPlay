import play.api._
import play.api.mvc.Results.InternalServerError
import play.api.Logger
import play.api.mvc.RequestHeader
import play.api.mvc.SimpleResult
import play.api.mvc.Result
import play.api.mvc.Results.Redirect
object Global extends GlobalSettings {

  override def onStart(app: Application) {
    //    ReadingSpreadsheetUtil.readCSVOfSchools
  }

  override def onError(request: RequestHeader, ex: Throwable) = {
//     Redirect("/error")
     InternalServerError(views.html.error())
  }
  override def onHandlerNotFound(request: RequestHeader): Result = {
    InternalServerError(views.html.error())
  }

  override def onBadRequest(request: RequestHeader, error: String) = {
    InternalServerError(views.html.error())
  }

}