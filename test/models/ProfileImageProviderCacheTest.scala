/*
package models
import org.junit.runner.RunWith
import org.scalatest.BeforeAndAfter
import org.scalatest.FunSuite
import org.scalatest.junit.JUnitRunner
import org.bson.types.ObjectId

@RunWith(classOf[JUnitRunner])
class ProfileImageProviderCacheTest extends FunSuite with BeforeAndAfter {

  test("getting and setting the image in cache") {
    ProfileImageProviderCache.setImage("123456789123456789123456", "http://www.knoldus.com/neel.jpg")
    val mediaUrlObtained = ProfileImageProviderCache.getImage("123456789123456789123456")
    assert(mediaUrlObtained == "http://www.knoldus.com/neel.jpg")

    ProfileImageProviderCache.setImage("123456789123456789123456", "http://www.knoldus.com/neelkanth.jpg")
    val mediaUrlObtainedAfterChange = ProfileImageProviderCache.getImage("123456789123456789123456")
    assert(mediaUrlObtainedAfterChange === "http://www.knoldus.com/neelkanth.jpg")

    assert(ProfileImageProviderCache.profileImageMap.size === 1)

    ProfileImageProviderCache.setImage("123456789123456789123457", "http://www.knoldus.com/neelkanth2.jpg")
    assert(ProfileImageProviderCache.profileImageMap.size === 2)

  }

  test("Lets see the size of Map") {
    assert(ProfileImageProviderCache.profileImageMap.size === 2)
  }

}*/