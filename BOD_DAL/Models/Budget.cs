using System;
using System.Collections.Generic;

namespace BOD_DAL.Models
{
    public class Budget
    {
        public int ItemId { get; set; }
        public int Accounting { get; set; }
        public int UnitId { get; set; }
        public string Desc { get; set; }

        public List<MonthList> MonthList { get; set; }

    }

    public class MonthList
    {
        public int Id { get; set; }

        public int Year { get; set; }

        public decimal Value { get; set; }
        public decimal InputNumber { get; set; }
        public int Group { get; set; }
    }
}
