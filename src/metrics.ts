/**
 * GENERATED using JavaClientGeneratorMain.java
 */
/**
 * Follower represents
 *   Table [follower]
 *   in Keyspace [ig_app_data]
 * 
 * Name: follower
 * Description:
 *   stores the users that follow each user ordered by the most recent 
 *   followers 
 * 
 * Columns:
 *   user_id : uuid
 *   follower_time : bigint
 *   follower_user_id : uuid
 * Partition Keys: user_id, follower_time, follower_user_id
 * Secondary Keys: 
 * Caching: ALL
 * Order By:
 *   follower_time : DESC
 * Queries:
 *   - Name: insert
 *   Description:
 *     inserts a new follower 
 *   Prepared Statement:
 *     INSERT INTO ig_app_data.follower (user_id, follower_time, 
 *     follower_user_id) VALUES (:user_id, :follower_time, 
 *     :follower_user_id); 
 *   - Name: delete
 *   Description:
 *     deletes an unfollowing follower 
 *   Prepared Statement:
 *     DELETE FROM ig_app_data.follower WHERE user_id = :user_id AND 
 *     follower_time = :follower_time AND follower_user_id = 
 *     :follower_user_id; 
 *   - Name: select_recent_limit
 *   Description:
 *     selects the most recent follower users where the returned count is 
 *     limited by the value of limit (e.g.: 10) 
 *   Prepared Statement:
 *     SELECT follower_time, follower_user_id FROM ig_app_data.follower 
 *     WHERE user_id = :user_id LIMIT 30; 
 *   - Name: select_at_or_before_time_limit
 *   Description:
 *     selects follower users at-or-before a specified time where the 
 *     returned count is limited by the value of limit (e.g.: 10) 
 *   Prepared Statement:
 *     SELECT follower_time, follower_user_id FROM ig_app_data.follower 
 *     WHERE user_id = :user_id AND follower_time <= :follower_time 
 *     LIMIT 30; 
 *   - Name: select_all
 *   Description:
 *     selects all the followers of a user, NOTE: use paging when using 
 *     this query 
 *   Prepared Statement:
 *     SELECT follower_time, follower_user_id FROM ig_app_data.follower 
 *     WHERE user_id = :user_id; 
 * */
class Follower {

    
  
    /**
     * Query:
     * Name: insert
     * Description:
     *   inserts a new follower 
     * Prepared Statement:
     *   INSERT INTO ig_app_data.follower (user_id, follower_time, 
     *   follower_user_id) VALUES (:user_id, :follower_time, 
     *   :follower_user_id); 
     */
    kInsertName = "insert";
    kInsertDescription =
      "inserts a new follower ";
    kInsertPreparedStatement = "INSERT INTO ig_app_data.follower (user_id follower_time, " + "follower_user_id) VALUES (:user_id, :follower_time, " + ":follower_user_id); ";
  
    /**
     * Query:
     * Name: delete
     * Description:
     *   deletes an unfollowing follower 
     * Prepared Statement:
     *   DELETE FROM ig_app_data.follower WHERE user_id = :user_id AND 
     *   follower_time = :follower_time AND follower_user_id = 
     *   :follower_user_id; 
     */
    kDeleteName = "delete";
    kDeleteDescription = "deletes an unfollowing follower ";
    kDeletePreparedStatement = "DELETE FROM ig_app_data.follower WHERE user_id = :user_id AND " + "follower_time = :follower_time AND follower_user_id = " + ":follower_user_id; ";
  
    /**
     * Query:
     * Name: select_recent_limit
     * Description:
     *   selects the most recent follower users where the returned count is 
     *   limited by the value of limit (e.g.: 10) 
     * Prepared Statement:
     *   SELECT follower_time, follower_user_id FROM ig_app_data.follower 
     *   WHERE user_id = :user_id LIMIT 30; 
     */
    kSelectRecentLimitName = "select_recent_limit";
    kSelectRecentLimitDescription = "selects the most recent follower users where the returned count is " + "limited by the value of limit (e.g.: 10) ";
    kSelectRecentLimitPreparedStatement = "SELECT follower_time, follower_user_id FROM ig_app_data.follower WHERE " + "user_id = :user_id LIMIT 30; ";
  
    /**
     * Query:
     * Name: select_at_or_before_time_limit
     * Description:
     *   selects follower users at-or-before a specified time where the 
     *   returned count is limited by the value of limit (e.g.: 10) 
     * Prepared Statement:
     *   SELECT follower_time, follower_user_id FROM ig_app_data.follower 
     *   WHERE user_id = :user_id AND follower_time <= :follower_time 
     *   LIMIT 30; 
     */
    kSelectAtOrBeforeTimeLimitName = "select_at_or_before_time_limit";
    kSelectAtOrBeforeTimeLimitDescription = "selects follower users at-or-before a specified time where the " + "returned count is limited by the value of limit (e.g.: 10) ";
    kSelectAtOrBeforeTimeLimitPreparedStatement = "SELECT follower_time, follower_user_id FROM ig_app_data.follower WHERE " + "user_id = :user_id AND follower_time <= :follower_time LIMIT " + "30; ";
  
    /**
     * Query:
     * Name: select_all
     * Description:
     *   selects all the followers of a user, NOTE: use paging when using 
     *   this query 
     * Prepared Statement:
     *   SELECT follower_time, follower_user_id FROM ig_app_data.follower 
     *   WHERE user_id = :user_id; 
     */
    kSelectAllName = "select_all";
    kSelectAllDescription = "selects all the followers of a user, NOTE: use paging when using this " + "query ";
    kSelectAllPreparedStatement = "SELECT follower_time, follower_user_id FROM ig_app_data.follower WHERE " + "user_id = :user_id; ";
  
    /**
     * Constructor Follower
     * @return new Follower Object
     * @throws Exception
     */
    constructor() {
      super (
        kKeySpaceName,
        kTableName,
        new Query (
          kInsertDescription,
          kInsertName,
          kInsertPreparedStatement),
        new Query (
          kDeleteDescription,
          kDeleteName,
          kDeletePreparedStatement),
        new Query (
          kSelectRecentLimitDescription,
          kSelectRecentLimitName,
          kSelectRecentLimitPreparedStatement),
        new Query (
          kSelectAtOrBeforeTimeLimitDescription,
          kSelectAtOrBeforeTimeLimitName,
          kSelectAtOrBeforeTimeLimitPreparedStatement),
        new Query (
          kSelectAllDescription,
          kSelectAllName,
          kSelectAllPreparedStatement));
    }
  
    instance: Follower = null;
  
    /**
     * loadTable
     * OPTIONAL method
     * instance is created either upon calling this method or upon the first call
     *   to singleton instance method i
     * this method is useful for loading upon program start instead of loading
     *   it upon the first use since there's a small time overhead for loading
     *   since all queries are prepared synchronously in a blocking network
     *   operation with Cassandra's server
     * @throws Exception
     */
    public static void loadTable () throws Exception {
  
      if (instance == null) {
  
        instance = new Follower();
      }
    }
  
    /**
     * i
     * @return singleton static instance of Follower
     * @throws Exception
     */
    public static Follower i () throws Exception {
  
      if (instance == null) {
  
        instance = new Follower();
      }
  
      return instance;
    }
  
    // Query: Insert
    // Description:
    //   inserts a new follower 
    // Parepared Statement:
    //   INSERT INTO ig_app_data.follower (user_id, follower_time, 
    //   follower_user_id) VALUES (:user_id, :follower_time, 
    //   :follower_user_id); 
  
    /**
     * getQueryInsert
     * @return Insert Query in the form of
     *           a Query Object
     * @throws Exception
     */
    public Query getQueryInsert (
      ) throws Exception {
  
      return this.getQuery(kInsertName);
    }
  
    /**
     * getQueryDispatchableInsert
     * @param userid
     * @param followertime
     * @param followeruserid
     * @return Insert Query in the form of
     *           a QueryDisbatchable Object
     *           (e.g.: to be passed on to a worker instance)
     * @throws Exception
     */
    public QueryDispatchable getQueryDispatchableInsert (
      Object userid,
      Object followertime,
      Object followeruserid) throws Exception {
  
      return
        this.getQueryDispatchable(
          kInsertName,
          userid,
          followertime,
          followeruserid);
    }
  
    /**
     * getBoundStatementInsert
     * @param userid
     * @param followertime
     * @param followeruserid
     * @return Insert Query in the form of
     *           a BoundStatement ready for execution or to be added to
     *           a BatchStatement
     * @throws Exception
     */
    public BoundStatement getBoundStatementInsert (
      Object userid,
      Object followertime,
      Object followeruserid) throws Exception {
  
      return
        this.getQuery(kInsertName).getBoundStatement(
          userid,
          followertime,
          followeruserid);
    }
  
    /**
     * executeAsyncInsert
     * executes Insert Query asynchronously
     * @param userid
     * @param followertime
     * @param followeruserid
     * @return ResultSetFuture
     * @throws Exception
     */
    public ResultSetFuture executeAsyncInsert (
      Object userid,
      Object followertime,
      Object followeruserid) throws Exception {
  
      return
        this.getQuery(kInsertName).executeAsync(
          userid,
          followertime,
          followeruserid);
    }
  
    /**
     * executeSyncInsert
     * BLOCKING-METHOD: blocks till the ResultSet is ready
     * executes Insert Query synchronously
     * @param userid
     * @param followertime
     * @param followeruserid
     * @return ResultSet
     * @throws Exception
     */
    public ResultSet executeSyncInsert (
      Object userid,
      Object followertime,
      Object followeruserid) throws Exception {
  
      return
        this.getQuery(kInsertName).executeSync(
          userid,
          followertime,
          followeruserid);
    }
  
    // Query: Delete
    // Description:
    //   deletes an unfollowing follower 
    // Parepared Statement:
    //   DELETE FROM ig_app_data.follower WHERE user_id = :user_id AND 
    //   follower_time = :follower_time AND follower_user_id = 
    //   :follower_user_id; 
  
    /**
     * getQueryDelete
     * @return Delete Query in the form of
     *           a Query Object
     * @throws Exception
     */
    public Query getQueryDelete (
      ) throws Exception {
  
      return this.getQuery(kDeleteName);
    }
  
    /**
     * getQueryDispatchableDelete
     * @param userid
     * @param followertime
     * @param followeruserid
     * @return Delete Query in the form of
     *           a QueryDisbatchable Object
     *           (e.g.: to be passed on to a worker instance)
     * @throws Exception
     */
    public QueryDispatchable getQueryDispatchableDelete (
      Object userid,
      Object followertime,
      Object followeruserid) throws Exception {
  
      return
        this.getQueryDispatchable(
          kDeleteName,
          userid,
          followertime,
          followeruserid);
    }
  
    /**
     * getBoundStatementDelete
     * @param userid
     * @param followertime
     * @param followeruserid
     * @return Delete Query in the form of
     *           a BoundStatement ready for execution or to be added to
     *           a BatchStatement
     * @throws Exception
     */
    public BoundStatement getBoundStatementDelete (
      Object userid,
      Object followertime,
      Object followeruserid) throws Exception {
  
      return
        this.getQuery(kDeleteName).getBoundStatement(
          userid,
          followertime,
          followeruserid);
    }
  
    /**
     * executeAsyncDelete
     * executes Delete Query asynchronously
     * @param userid
     * @param followertime
     * @param followeruserid
     * @return ResultSetFuture
     * @throws Exception
     */
    public ResultSetFuture executeAsyncDelete (
      Object userid,
      Object followertime,
      Object followeruserid) throws Exception {
  
      return
        this.getQuery(kDeleteName).executeAsync(
          userid,
          followertime,
          followeruserid);
    }
  
    /**
     * executeSyncDelete
     * BLOCKING-METHOD: blocks till the ResultSet is ready
     * executes Delete Query synchronously
     * @param userid
     * @param followertime
     * @param followeruserid
     * @return ResultSet
     * @throws Exception
     */
    public ResultSet executeSyncDelete (
      Object userid,
      Object followertime,
      Object followeruserid) throws Exception {
  
      return
        this.getQuery(kDeleteName).executeSync(
          userid,
          followertime,
          followeruserid);
    }
  
    // Query: SelectRecentLimit
    // Description:
    //   selects the most recent follower users where the returned count is 
    //   limited by the value of limit (e.g.: 10) 
    // Parepared Statement:
    //   SELECT follower_time, follower_user_id FROM ig_app_data.follower 
    //   WHERE user_id = :user_id LIMIT 30; 
  
    /**
     * getQuerySelectRecentLimit
     * @return SelectRecentLimit Query in the form of
     *           a Query Object
     * @throws Exception
     */
    public Query getQuerySelectRecentLimit (
      ) throws Exception {
  
      return this.getQuery(kSelectRecentLimitName);
    }
  
    /**
     * getQueryDispatchableSelectRecentLimit
     * @param userid
     * @return SelectRecentLimit Query in the form of
     *           a QueryDisbatchable Object
     *           (e.g.: to be passed on to a worker instance)
     * @throws Exception
     */
    public QueryDispatchable getQueryDispatchableSelectRecentLimit (
      Object userid) throws Exception {
  
      return
        this.getQueryDispatchable(
          kSelectRecentLimitName,
          userid);
    }
  
    /**
     * getBoundStatementSelectRecentLimit
     * @param userid
     * @return SelectRecentLimit Query in the form of
     *           a BoundStatement ready for execution or to be added to
     *           a BatchStatement
     * @throws Exception
     */
    public BoundStatement getBoundStatementSelectRecentLimit (
      Object userid) throws Exception {
  
      return
        this.getQuery(kSelectRecentLimitName).getBoundStatement(
          userid);
    }
  
    /**
     * executeAsyncSelectRecentLimit
     * executes SelectRecentLimit Query asynchronously
     * @param userid
     * @return ResultSetFuture
     * @throws Exception
     */
    public ResultSetFuture executeAsyncSelectRecentLimit (
      Object userid) throws Exception {
  
      return
        this.getQuery(kSelectRecentLimitName).executeAsync(
          userid);
    }
  
    /**
     * executeSyncSelectRecentLimit
     * BLOCKING-METHOD: blocks till the ResultSet is ready
     * executes SelectRecentLimit Query synchronously
     * @param userid
     * @return ResultSet
     * @throws Exception
     */
    public ResultSet executeSyncSelectRecentLimit (
      Object userid) throws Exception {
  
      return
        this.getQuery(kSelectRecentLimitName).executeSync(
          userid);
    }
  
    // Query: SelectAtOrBeforeTimeLimit
    // Description:
    //   selects follower users at-or-before a specified time where the 
    //   returned count is limited by the value of limit (e.g.: 10) 
    // Parepared Statement:
    //   SELECT follower_time, follower_user_id FROM ig_app_data.follower 
    //   WHERE user_id = :user_id AND follower_time <= :follower_time 
    //   LIMIT 30; 
  
    /**
     * getQuerySelectAtOrBeforeTimeLimit
     * @return SelectAtOrBeforeTimeLimit Query in the form of
     *           a Query Object
     * @throws Exception
     */
    public Query getQuerySelectAtOrBeforeTimeLimit (
      ) throws Exception {
  
      return this.getQuery(kSelectAtOrBeforeTimeLimitName);
    }
  
    /**
     * getQueryDispatchableSelectAtOrBeforeTimeLimit
     * @param userid
     * @param followertime
     * @return SelectAtOrBeforeTimeLimit Query in the form of
     *           a QueryDisbatchable Object
     *           (e.g.: to be passed on to a worker instance)
     * @throws Exception
     */
    public QueryDispatchable getQueryDispatchableSelectAtOrBeforeTimeLimit (
      Object userid,
      Object followertime) throws Exception {
  
      return
        this.getQueryDispatchable(
          kSelectAtOrBeforeTimeLimitName,
          userid,
          followertime);
    }
  
    /**
     * getBoundStatementSelectAtOrBeforeTimeLimit
     * @param userid
     * @param followertime
     * @return SelectAtOrBeforeTimeLimit Query in the form of
     *           a BoundStatement ready for execution or to be added to
     *           a BatchStatement
     * @throws Exception
     */
    public BoundStatement getBoundStatementSelectAtOrBeforeTimeLimit (
      Object userid,
      Object followertime) throws Exception {
  
      return
        this.getQuery(kSelectAtOrBeforeTimeLimitName).getBoundStatement(
          userid,
          followertime);
    }
  
    /**
     * executeAsyncSelectAtOrBeforeTimeLimit
     * executes SelectAtOrBeforeTimeLimit Query asynchronously
     * @param userid
     * @param followertime
     * @return ResultSetFuture
     * @throws Exception
     */
    public ResultSetFuture executeAsyncSelectAtOrBeforeTimeLimit (
      Object userid,
      Object followertime) throws Exception {
  
      return
        this.getQuery(kSelectAtOrBeforeTimeLimitName).executeAsync(
          userid,
          followertime);
    }
  
    /**
     * executeSyncSelectAtOrBeforeTimeLimit
     * BLOCKING-METHOD: blocks till the ResultSet is ready
     * executes SelectAtOrBeforeTimeLimit Query synchronously
     * @param userid
     * @param followertime
     * @return ResultSet
     * @throws Exception
     */
    public ResultSet executeSyncSelectAtOrBeforeTimeLimit (
      Object userid,
      Object followertime) throws Exception {
  
      return
        this.getQuery(kSelectAtOrBeforeTimeLimitName).executeSync(
          userid,
          followertime);
    }
  
    // Query: SelectAll
    // Description:
    //   selects all the followers of a user, NOTE: use paging when using 
    //   this query 
    // Parepared Statement:
    //   SELECT follower_time, follower_user_id FROM ig_app_data.follower 
    //   WHERE user_id = :user_id; 
  
    /**
     * getQuerySelectAll
     * @return SelectAll Query in the form of
     *           a Query Object
     * @throws Exception
     */
    public Query getQuerySelectAll (
      ) throws Exception {
  
      return this.getQuery(kSelectAllName);
    }
  
    /**
     * getQueryDispatchableSelectAll
     * @param userid
     * @return SelectAll Query in the form of
     *           a QueryDisbatchable Object
     *           (e.g.: to be passed on to a worker instance)
     * @throws Exception
     */
    public QueryDispatchable getQueryDispatchableSelectAll (
      Object userid) throws Exception {
  
      return
        this.getQueryDispatchable(
          kSelectAllName,
          userid);
    }
  
    /**
     * getBoundStatementSelectAll
     * @param userid
     * @return SelectAll Query in the form of
     *           a BoundStatement ready for execution or to be added to
     *           a BatchStatement
     * @throws Exception
     */
    public BoundStatement getBoundStatementSelectAll (
      Object userid) throws Exception {
  
      return
        this.getQuery(kSelectAllName).getBoundStatement(
          userid);
    }
  
    /**
     * executeAsyncSelectAll
     * executes SelectAll Query asynchronously
     * @param userid
     * @return ResultSetFuture
     * @throws Exception
     */
    public ResultSetFuture executeAsyncSelectAll (
      Object userid) throws Exception {
  
      return
        this.getQuery(kSelectAllName).executeAsync(
          userid);
    }
  
    /**
     * executeSyncSelectAll
     * BLOCKING-METHOD: blocks till the ResultSet is ready
     * executes SelectAll Query synchronously
     * @param userid
     * @return ResultSet
     * @throws Exception
     */
    public ResultSet executeSyncSelectAll (
      Object userid) throws Exception {
  
      return
        this.getQuery(kSelectAllName).executeSync(
          userid);
    }
  
  }