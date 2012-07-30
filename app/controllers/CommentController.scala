package controllers
import play.api.mvc.Controller
import net.liftweb.json.DefaultFormats
import play.api.mvc.Action


object CommentController extends Controller {
  
  implicit val formats = DefaultFormats
  
  
   def newComment = Action { implicit request =>
     
     Ok
     
   }

}