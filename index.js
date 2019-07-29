class QueryBuilder
{
  constructor(table, dbInstance)
  {
    this.isFirstWhere = true;
    this.table = table;
    this.db = dbInstance;
    this.sql = "";
    this.values = [];
  }
  select(columns)
  {
    if(columns === undefined)
    {
      columns = ["*"];
    }
    this.sql = [this.sql, "SELECT", columns.join(", "), "FROM", this.table].join(" ");
    return this;
  }

  insert(data)
  {
    let parameters = [];
    Object.keys(data).forEach(function (item)
    {
      parameters.push([item, "=", "?"].join(" "));
    });
    this.table = this.table.split(" ")[0];
    this.values = Object.values(data);
    this.sql = [this.sql, "INSERT INTO", this.table, "SET",  parameters.join(", ")].join(" ");
    return this.get();
  }

  update(data)
  {
    let parameters = [];
    Object.keys(data).forEach(function (item)
    {
      parameters.push([item, "=", "?"].join(" "));
    });
    this.values = Object.values(data);
    this.sql = ["UPDATE", this.table, "SET",  parameters.join(", "), this.sql].join(" ");
    return this.get();
  }

  delete()
  {
    this.table = this.table.split(" ")[0];
    this.sql = ["DELETE", "FROM", this.table, this.sql].join(" ");
    return this.get();
  }

  join(table, values)
  {
    return this.joinCommon(table, values);
  }

  leftJoin(table, values)
  {
    return this.joinCommon(table, values);
  }

  rightJoin(table, values)
  {
    return this.joinCommon(table, values);
  }

  joinCommon(table, values)
  {
    let onValues =[];
    if(!Array.isArray(values))
    {
      onValues.push([values.first, values.operator, values.second].join(" "));
    }
    else
    {
      values.forEach(function (item) {
        onValues.push([item.first, item.operator, item.second].join(" "));
      });
    }
    this.sql = [this.sql, "INNER JOIN", table, "ON", onValues.join(" AND ")].join(" ");
    return this;
  }

  whereCommon(first, operator, second, type)
  {
    if(this.isFirstWhere)
    {
      this.isFirstWhere = false;
      this.sql = [this.sql, "WHERE", first, operator, second].join(" ");
    }
    else
    {
      this.sql = [this.sql, type, first, operator, second].join(" ");
    }
    return this;
  };

  where(first, operator, second)
  {
    return this.whereCommon(first, operator, second, 'AND');
  }

  whereOr(first, operator, second)
  {
    return this.whereCommon(first, operator, second, 'OR')
  }

  whereIn(column, values)
  {
    if(this.isFirstWhere)
    {
      this.isFirstWhere = false;
      this.sql = [this.sql, "WHERE", column, "IN(", values.join(", "), ")"].join(" ");
    }
    else
    {
      this.sql = [this.sql, "AND", column, "IN(", values.join(", "), ")"].join(" ");
    }
    return this;
  }

  orderBy(column, order)
  {
    this.sql = [this.sql, "ORDER BY", column, order].join(" ");
    return this;
  }

  groupBy(columns)
  {
    if(!Array.isArray(columns))
    {
      columns = [columns];
    }
    this.sql = [this.sql, "GROUP BY", columns.join(", ")].join(" ");
    return this;
  }

  having(first, operator, second)
  {
    this.sql = [this.sql, "HAVING", first, operator, second].join(" ");
    return this;
  }

  limit(start, length)
  {
    if(length === undefined)
    {
      this.sql = [this.sql, "LIMIT", start].join(" ");
    }
    else
    {
      this.sql = [this.sql, "LIMIT", start, ",", length].join(" ");
    }
    return this;
  }

  async get()
  {
    let result = await this.execute(this.sql, this.values);
    this.sql = "";
    return {err: result.message, results: result.data, success: result.success};
  }


  async execute(sql, values)
  {
    var connection = this.db;
    var result = {success : false, message : "", error_code: -1, data:{}};
    return new Promise(async function (resolve, reject)
    {
      try
      {
        var results = await connection.query(sql, values, async function (error, results, fields) {
          if (error)
          {
            console.log(error);
            result.message = error.message;
          }
          else
          {
            if(results.affectedRows !== undefined)
            {
              if(results.affectedRows > 0)
              {
                result.success = true;
              }
            }
            else
            {
              result.data = results;
            }
          }
          resolve(result);
        });

      }
      catch (e) {
        console.log(e);
        result.message = e.message;
        resolve(result);
      }
    });
  }

}
module.exports = QueryBuilder;
