using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BOD_DAL.Models
{
    public class GlobalDelete
    {
        public string tableName { get; set; }
        public string ColumnName { get; set; }
        public string param { get; set; }
    }
}
