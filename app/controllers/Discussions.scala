package controllers

import play.api.mvc._

object Discussions extends Controller {

  def index = Action {
    Ok(views.html.discussions.index("Discussions Page."))
  }
    
}


