package utils

import play.api.Play
import java.net.URL
import java.io.BufferedReader
import java.io.InputStreamReader

object FetchLocationUtil {

  def getLocation(ipAddress: String): String = {
    val key: String = Play.current.configuration.getString("ipinfodb_api_key").get;
    val ipInfoDBURL = new URL("http://api.ipinfodb.com/v3/ip-city" + "/?key=" + key + "&ip=" + ipAddress + "&format=" + "json")
    val conn = ipInfoDBURL.openConnection

    val in = new BufferedReader(
      new InputStreamReader(conn.getInputStream))
    val response = new StringBuffer
    for (i <- 0 to 6) {
      response.append(in.readLine)
    }
    in.close()
    val nullExpr = "null".r
    val dataString = nullExpr.replaceAllIn(response.toString, "")
    val dataList = dataString.split(",").toList
    val cityName = dataList(5).split(":")(1).toString()
    cityName
  }
  
}
