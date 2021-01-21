using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BOD_DAL.Models

{
   public class DDLJoinList
    {
       public string tableName1 { get; set; }
       public string tableName2 { get; set; }
       public string ColumnName{ get; set; }
       public string ColumnName1 { get; set; }
       public string Text { get; set; }
       public string Value { get; set; }
       public string Param { get; set; }
       public string PId { get; set; }
        public string Param1 { get; set; }
        public string PId1 { get; set; }
    }
}
