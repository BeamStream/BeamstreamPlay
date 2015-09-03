package controllers

import play.api.mvc._
import org.bson.types.ObjectId
import models.SystemCode

object SystemCodeController extends Controller {

  def systemCode: Action[AnyContent] = Action { implicit request =>
     Ok(views.html.systemcode("create system code"))
  }
  
  def createSystemCode: Action[AnyContent] = Action { implicit request =>
    val data = request.body.asFormUrlEncoded.get
    val systemCode = data("systemCode").toList(0)
    val systemCodeObj = SystemCode(new ObjectId,systemCode,true)
    SystemCode.createSystemCode(systemCodeObj)
    Redirect("/systemCode")
  }

}