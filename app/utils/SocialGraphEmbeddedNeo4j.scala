package utils

import java.io.File
import java.io.IOException
import org.neo4j.graphdb.factory.GraphDatabaseFactory
import org.neo4j.graphdb.Direction
import org.neo4j.graphdb.GraphDatabaseService
import org.neo4j.graphdb.Node
import org.neo4j.graphdb.Relationship
import org.neo4j.graphdb.RelationshipType
import org.neo4j.graphdb.Transaction
import org.neo4j.kernel.impl.util.FileUtils
import scala.language.implicitConversions
import play.api.Logger

//Code By Daniel Hew

object SocialGraphEmbeddedNeo4j {
  //val DB_PATH:String = "/Users/danielhew/Documents/bin/neo4j-community-1.8.M07/data/graph.db"
  val DB_PATH: String = "data/BeamStreamGraph.db"
  val USER_KEY = "userId"
  val INDEX_NAME = "allNodes"

  var graphDb: GraphDatabaseService = _
  var firstNode: Node = _
  var secondNode: Node = _
  var relationship: Relationship = _

  object RelTypes extends Enumeration {
    type RelTypes = Value
    val FRIEND, CLASSMATE, TEACHER = Value

    implicit def conv(rt: RelTypes): RelationshipType = new RelationshipType() { def name: String = rt.toString }
  }

  import RelTypes._

  //MAIN CLASS used for testing only
  def main(args: Array[String]) {
    this.clearDb()
    this.createDb()
    //this.removeData()
    //this.createBSNode(24, "daniel", "hew", null)
    var node: Node = this.findOrCreateBSNode(24, "daniel", "hew")
    var node2: Node = this.createBSNode(72, "lena", "yan", node)
    print("node1: " + node.getProperty("firstName"))
    print("node2: " + node2.getProperty("firstName"))
    print("relationship: " + node2.getRelationships())
    this.shutDown()
  }

  def createDb() {
    //startDb
    graphDb = new GraphDatabaseFactory().newEmbeddedDatabase(DB_PATH)
  }

  def clearDb() {
    try {
      FileUtils.deleteFile(new File(DB_PATH))
    } catch {
      case ioe: IOException =>
        throw new RuntimeException(ioe)
    }
  }

  def removeData() {
    val tx: Transaction = graphDb.beginTx()
    try {
      firstNode.getSingleRelationship(RelTypes.FRIEND, Direction.OUTGOING).delete()
      firstNode.delete()
      secondNode.delete()

      tx.success()
    } finally {
      tx.close()
    }
  }

  def shutDown() {
    graphDb.shutdown()
  }

  //shutdownHook
  def registerShutdownHook(graphDb: GraphDatabaseService) {
    def act() {
      graphDb.shutdown();
    }
  }

  /*
   * Find a BeamStream Node by UserId. If node does not exist return NULL
   */
  def findBSNode(userId: Long): Node = {
    if (graphDb == null) {
      createDb()
    }
    var nodeIndex = graphDb.index().forNodes(INDEX_NAME)
    var node: Node = nodeIndex.get(USER_KEY, userId).getSingle()

    node
  }

  /*
   * Find a BeamStream Node by UserId. If node does not exist save it
   * to Neo4j along with the users first and last name
   */
  def findOrCreateBSNode(userId: Long, firstName: String, lastName: String): Node = {
    if (graphDb == null) {
      createDb()
    }
    var nodeIndex = graphDb.index().forNodes(INDEX_NAME)
    var node: Node = nodeIndex.get(USER_KEY, userId).getSingle()

    if (node == null) {
      node = createBSNode(userId, firstName, lastName, null)
    }
    node
  }

  /*
   * Create a BeamStream Node with userId, firstName, and lastName.  Make
   * it a FRIEND of parentNode.
   */
  def createBSNode(userId: Long, firstName: String, lastName: String, parentNode: Node): Node = {
    if (graphDb == null) {
      createDb()
    }

    val tx: Transaction = graphDb.beginTx()
    val nodeIndex = graphDb.index().forNodes(INDEX_NAME)
    try {
      // addData
      secondNode = graphDb.createNode()
      secondNode.setProperty("userId", userId)
      secondNode.setProperty("firstName", firstName)
      secondNode.setProperty("lastName", lastName)
      nodeIndex.add(secondNode, USER_KEY, userId)

      if (firstNode != null) {
        relationship = parentNode.createRelationshipTo(secondNode, RelTypes.FRIEND)
        relationship.setProperty("connection", "friend")
      }

      tx.success()
      secondNode
    } catch {
      case ioe: Exception =>
        Logger.error("This error occured while Creating a BS Node :- ", ioe)
        null
    } finally {
      tx.close()
    }
  }
}
