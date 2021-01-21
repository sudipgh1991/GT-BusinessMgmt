using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BOD_DAL.Models
{
    public class DDLList
    {
        public string tableName { get; set; }

        public string Text { get; set; }
        public string Value { get; set; }
        public string param { get; set; }
        public string ColumnName { get; set; }
        public decimal? PId { get; set; }
        public string ColumnName1 { get; set; }
        public decimal? PId1 { get; set; }
        public List<DDLList> ddlList { get; set; }
        public  DDLList()
        {
            ddlList = new List<DDLList>();
        }
    }
}
