package controllers

import play.api.mvc._

object Login extends Controller {

  def index = Action {
    Ok(views.html.login())
  }
    
}


