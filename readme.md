
# **db-query-builder**
NodeJS Express framework mysql query builder and executor library. Inspired by PHP Laravel Framework.


**Initialize:**

    var QueryBuilder = require('db-query-builder');  
    var db = new QueryBuilder(table, mysqlConnection));
    // mysqlConnection: Your mysql connection instance 
    // your primary table name to use after from
	
	
**SELECT:**		
   
   If you call select function **without arguments,** it selects **all columns** as default.

    var db = new QueryBuilder("address AS a", mysqlConnection));
    db.select()
      .where("address_id", "=", 1)
      .where("customer_id", "=", 134)
    
 If you want to select **specific** columns then:

	db.select(["address_id", "firstname", "lastname", "zipCode"])
      .where("address_id", "=", 1)
      .where("customer_id", "=", 134)

   **UPDATE:**
	   
If you want to update columns on a table then:

     db.where("customer_id", "=", 134)
       .update({"firstname" : "Hasan", "lastname" : "Karaoğlu"});


**INSERT:**
If you want to insert a record into a table then:

    db.insert({
	    "firstname"   : "Hasan", 
	    "lastname"    : "Karaoğlu",
	    "address_id"  : 2,
	    "customer_id" : 134 
    })

**DELETE:**
If you want to delete a record from a table then:

    db.where("customer_id", "=", 134)
      .where("address_id", "=", 1)
      .delete()

**JOIN:**

If you want to join a table, then:
	

    db.select()
      .join("customer AS c", { first : "c.customer_id", operator: "=", "second" : "a.customer_id"})
      .where("a.customer_id", "=", 134)

You can also use **leftJoin** and **rightJoin**	 functions to use other join types.

**ORDER BY:**
If you want to order results, then:

    db.select()
      .orderBy("firstname", "desc")

**GROUP BY:**
  If you want to group results, then:

      db.select("COUNT(address_id)")
        .groupBy("customer_id") 
or for multiple grouping:
		
	  db.select("COUNT(address_id)")
        .groupBy(["customer_id", "zipCode"]) 

**HAVING:**
If you want to filter group results, then:
	

    db.select("COUNT(address_id)")
      .groupBy("customer_id") 
      .having("zipCode", "<",  34000)

**LIMIT:**
If you want to limit records count then:

     db.select()
	   .limit(100)
or

    db.select()
      .limit(0, 100)

 

