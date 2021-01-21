using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BOD_DAL.Models
{
  public  class MenuModel
    {
        public List<MainMenu> MainMenuModel { get; set; }
        public List<SubMenu> SubMenuModel { get; set; }
    }

  public class MainMenu
  {
      public int? MenuId;
      public string MainMenuItem;
      public string MainMenuURL;
      public string MenuIcon;
      public string Checked;
  }
  public class SubMenu
  {
      public int? MenuId;
      public int? MainMenuID;
      public string SubMenuItem;
      public string SubMenuIcon;
      public string SubMenuURL;
      public string Checked;
  }
}
