package controllers

import play.api.mvc._
import org.bson.types.ObjectId
import models.SystemCode
import play.api.libs.json.Json

object SystemCodeController extends Controller {

  def systemCode: Action[AnyContent] = Action { implicit request =>
     val systemCode = SystemCode.findAll
     Ok(views.html.systemcode("create system code", systemCode))
  }
  
  def createSystemCode: Action[AnyContent] = Action { implicit request =>
    val data = request.body.asFormUrlEncoded.get
    val systemCode = data("systemCode").toList(0)
    val systemCodeObj = SystemCode(new ObjectId,systemCode,true)
    SystemCode.createSystemCode(systemCodeObj)
    Redirect("/systemCode")
  }
  
  def updateSystemCode: Action[AnyContent] = Action { implicit request =>
    SystemCode.update(new ObjectId("55ed5c43c83007f8137a296a"),false)
    Redirect("/systemCode")
  }
  
  def changeSystemCodeStatus: Action[AnyContent] = Action { implicit request =>
    val data = request.body.asFormUrlEncoded.get
    val status = data("status").toList(0)
    val id = data("id").toList(0)
    SystemCode.update(new ObjectId(id), status.toBoolean)
    Ok(Json.obj("status" -> "success")).as("application/json")
  }
  
  def deleteSystemCode: Action[AnyContent] = Action { implicit request =>
    val data = request.body.asFormUrlEncoded.get
    val id = data("id").toList(0)
    SystemCode.removeById(new ObjectId(id))
    Ok(Json.obj("status" -> "success")).as("application/json")
  }

}