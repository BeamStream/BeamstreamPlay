package controllers
import play.api.mvc._
import play.api._
import play.api.data._
import play.api.data.Forms._
import models.SchoolForm
import models.School

object SchoolController extends Controller {
  val schoolForm = Form(
    mapping(
      "schoolName" -> nonEmptyText)(SchoolForm.apply)(SchoolForm.unapply))


 def schools = Action {
      Ok(views.html.school(School.all(), schoolForm))
  }
  
   def addSchool = Action { implicit request =>
   schoolForm.bindFromRequest.fold(
      errors => BadRequest(views.html.school(School.all(), errors)),
     schoolForm => {
       School.addSchool(schoolForm)
        Redirect(routes.SchoolController.schools)
        

      })
  }
  
}