package controllers
import play.api.mvc._
import play.api._
import play.api.data._
import play.api.data.Forms._
import models.SchoolForm
import models.School

object SchoolController extends Controller {
  
  /*
   * Map the fields from the html page
   */
  
  
  val schoolForm = Form(
    mapping(
      "schoolName" -> nonEmptyText)(SchoolForm.apply)(SchoolForm.unapply))

  /*
   * Will display all the Schools
   */

  def schools = Action { implicit request =>
    Ok(views.html.school(School.allSchools(), schoolForm))
  }

  /*
   * Sends the obtained fields value from html to model for saving it
   */

  def addSchool = Action { implicit request =>
   
    schoolForm.bindFromRequest.fold(
      errors => BadRequest(views.html.school(School.allSchools(), errors)),
      schoolForm => {
        //School.addSchool(schoolForm)
        Redirect(routes.MessageController.messages)
      })
  }

}