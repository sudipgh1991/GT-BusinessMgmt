﻿using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BOD_DAL.Models
{
  public  class ProjectIndustryMaster:ModelBase
    {
       
        public string Name { get; set; }
        public string Description { get; set; }
        public override string Abbr
        {
            get
            {
                return "PIM_";
            }
        }
    }
}
