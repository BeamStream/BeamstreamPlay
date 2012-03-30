package tester

object EnumerationTest extends App {
  
  object WeekDay extends Enumeration {
    type WeekDay = Value
    val Mon = Value(0,"Mon")
    val Tue = Value(1,"Tue")
  }
  
  val abc:Seq[(String,String)] = Seq()
  
  val c = for(value<-WeekDay.values) yield (value.id.toString,value.toString)//println (value.id + ":"+value)
  val v = c.toSeq

}