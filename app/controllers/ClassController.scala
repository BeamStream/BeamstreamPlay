package controllers

import play.api.mvc._
import play.api._
import play.api.data._
import play.api.data.Forms._
import models.ClassForm
import models.Class

object ClassController extends Controller {
  /*
 * Map the fields value from html form
 */
  val classForm = Form(
    mapping(
      "className" -> nonEmptyText,
      "classCode" -> nonEmptyText,
      "classType" -> nonEmptyText,
      "schoolName" -> nonEmptyText)(ClassForm.apply)(ClassForm.unapply))

  /*
  * Displays all the classes        
  */
  def classes = Action {
    Ok(views.html.classes(classForm))
  }

  /*
   * Sends the value of fields to the model for saving
   */
//
//  def addClass = Action { implicit request =>
//    classForm.bindFromRequest.fold(
//      errors => BadRequest(views.html.classes(errors)),
//      classForm => {
//        Class.addClass(classForm)
//        Redirect(routes.MessageController.messages)
//
//      })
//  }
  
  def addClass = Action { implicit request =>
    println("Class JSON is ready too"+request.body)
    
    Class.createClass(List())
    Ok
  }
  

}