using BOD_DAL.Model.Interface;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BOD_DAL.Models
{
    public abstract class ModelBase : IModelBase
    {
        public int Id { get; set; }
        //public DateTime CreatedDate { get; set; }
        //public DateTime EditedDate { get; set; }
        //public string CreatedBy { get; set; }
        //public string EditedBy { get; set; }

        public abstract string Abbr { get; }
       
        public int? UserId { get; set; }
        //public string SpName { get; }
    }
}
