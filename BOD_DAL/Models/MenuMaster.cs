using BOD_DAL.Model.Interface;

namespace BOD_DAL.Models
{
    public class MenuMaster : ModelBase
    {
        public int? MenuId { get; set; }
        public string MenuName { get; set; }
        public string MenuURL{ get; set; }
        public int? ParentMenuId { get; set; }
        public int? ModuleId { get; set; }
        public override string  Abbr
        {
            get
            {
                return "";
            }
        }

    }
}
