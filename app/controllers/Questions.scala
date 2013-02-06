package controllers

import play.api.mvc._

object Questions extends Controller {

  def index = Action {
    Ok(views.html.questions.index("Questions Page."))
  }
    
}


