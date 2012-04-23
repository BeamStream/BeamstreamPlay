package controllers

import java.io.File
import models.DetailedRegForm
import models.User
import play.api.data.Forms._
import play.api.data._
import play.api.mvc._
import play.api._
import java.io.InputStream
import java.io.FileInputStream
import org.bson.types.ObjectId

object DetailedRegistration extends Controller {

  /*
   * Map the field values from html
   */
  val detailed_regForm = Form(
    mapping(
      "schoolName" -> nonEmptyText)(DetailedRegForm.apply)(DetailedRegForm.unapply))

  

  def users = Action {
    Ok(views.html.detailed_reg(detailed_regForm))
  }

  /*
   * Sends the field values & profile related info to User Model for adding the info of a User
   */

 

  def addInfo = Action(parse.multipartFormData) { implicit request =>
    detailed_regForm.bindFromRequest.fold(
      errors => BadRequest(views.html.detailed_reg(errors)),

      detailed_regForm => {
         
        request.body.file("picture").map { picture =>
          
          val fileObtained: File = picture.ref.file.asInstanceOf[File]
          val inputStream = new FileInputStream(fileObtained)
          User.addInfo(detailed_regForm, new ObjectId(request.session.get("userId").get) ,inputStream,picture.filename)
        }
        Redirect(routes.MessageController.messages)
        
 
      })
  }
}