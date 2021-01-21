﻿using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BOD_DAL.Models
{
    public class RegisterClientUserNextStep
    {
        public int Id { get; set; }
        public string CorporateName { get; set; }
        public string TradingName { get; set; }
        public string CIPC_RegistrationNo { get; set; }
        public string SARS_VATNo { get; set; }
        public string Address { get; set; }
        public string Zipcode { get; set; }
        public string PostalAddress { get; set; }
        public string PhoneNo { get; set; }
        public string Email { get; set; }
        public string ContactPersonName { get; set; }
        public int CompanyId { get; set; }
        public int FyId { get; set; }

        public int IndustryId { get; set; }
        public List<QA> QA { get; set; }
    }

    
}
