package controllers

import play.api.mvc._
import play.api._
import play.api.data._
import play.api.data.Forms._
import models.ClassForm
import models.Class

object ClassController extends Controller {
  val classForm = Form(
    mapping(
      "className" -> nonEmptyText,
       "classCode" -> number,
        "classType" -> nonEmptyText,
         "schoolName" -> nonEmptyText)(ClassForm.apply)(ClassForm.unapply))
         
         
 def classes = Action {
      Ok(views.html.classes(classForm))
  }
  
   def addClass = Action { implicit request =>
   classForm.bindFromRequest.fold(
      errors => BadRequest(views.html.classes(errors)),
     classForm => {
       Class.addClass(classForm)
        Redirect(routes.ClassController.classes)
        

      })
  }

}