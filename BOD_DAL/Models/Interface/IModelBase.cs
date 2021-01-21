using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BOD_DAL.Model.Interface
{
    public  interface IModelBase
    {
        int Id { get; set; }
        //DateTime CreatedDate { get; set; }
        //DateTime EditedDate { get; set; }
        //string CreatedBy { get; set; }
        //string EditedBy { get; set; }
        string Abbr { get; }
        //string SpName { get; }
    }
}
