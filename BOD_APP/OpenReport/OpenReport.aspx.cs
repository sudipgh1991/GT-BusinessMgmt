using System;
using System.Configuration;
using CrystalDecisions.CrystalReports;
using CrystalDecisions.CrystalReports.Engine;
using CrystalDecisions.ReportSource;
using CrystalDecisions;
using CrystalDecisions.Shared;
using System.Web.Services;
using System.Web;
using System.Data.SqlClient;
using System.Data;
using Newtonsoft.Json;
using System.Collections.Generic;
using Newtonsoft.Json.Linq;
using System.Linq;
using BOD_DAL.Models;

namespace BOD_APP.OpenReport
{
    public partial class OpenReport : System.Web.UI.Page
    {
        ExportFormatType formatType = ExportFormatType.NoFormat;
        CrystalDecisions.CrystalReports.Engine.ReportDocument crystalReport = new ReportDocument();
        string conString = ConfigurationManager.ConnectionStrings["ConStr"].ConnectionString;
        SqlConnectionStringBuilder builder = new SqlConnectionStringBuilder();
        string Type;
        Dictionary<string, string> Params;
        public static UserModel UserModel { get; set; }

        protected void Page_Load(object sender, EventArgs e)
        {
            UserModel = (UserModel)System.Web.HttpContext.Current.Session["UserDataModel"];

            if (UserModel == null)
            {
                Response.Redirect("/Account/AppLogin", true);
                return;
            }

            var keys = Request.QueryString["ReportName"];
            if (keys != null)
            {
                JObject obj = JObject.Parse(keys);
                var master = (JArray)obj.SelectToken("Master");
                var detal = (JArray)obj.SelectToken("Detail");

                GenerateReport(master, detal);
            }
        }
        private void GenerateReport(JArray master, JArray detal)
        {
            try
            {
                string reportName = master[0]["ReportName"].ToString();
                string FileName = master[0]["FileName"].ToString();

                crystalReport.Load(Server.MapPath("~/Reports/" + reportName));
                crystalReport.Refresh();

                builder.ConnectionString = conString;

                string server = builder.DataSource;
                string database = builder.InitialCatalog;
                string userid = builder.UserID;
                string password = builder.Password;

                crystalReport.DataSourceConnections[0].SetConnection(server, database, userid, password);
                crystalReport.DataSourceConnections[0].IntegratedSecurity = false;
                crystalReport.SetDatabaseLogon(server, database, userid, password);

                for (int i = 0; i < crystalReport.Subreports.Count; i++)
                {
                    crystalReport.Subreports[i].DataSourceConnections[0].SetConnection(server, database, userid, password);
                    crystalReport.Subreports[i].DataSourceConnections[0].IntegratedSecurity = false;
                    crystalReport.Subreports[i].SetDatabaseLogon(server, database, userid, password);
                }
                crystalReport.VerifyDatabase();

                foreach (var item in detal)
                {
                    string a = item.ToString();
                    string noNewLines = a.Replace("\n", "");
                    Params = JsonConvert.DeserializeObject<Dictionary<string, string>>(noNewLines);
                }
                Params.Add("CompanyID", UserModel.CompanyID.ToString());
                Params.Add("FYId", UserModel.FyId.ToString());
                Params.Add("UserID", UserModel.UserID.ToString());

                foreach (KeyValuePair<string, string> entry in Params)
                {
                    crystalReport.SetParameterValue("@" + entry.Key, entry.Value == "" ? DBNull.Value : (object)entry.Value);
                }
                formatType = ExportFormatType.PortableDocFormat;
                crystalReport.ExportToHttpResponse(formatType, Response, false, FileName);

            }
            catch (Exception ex)
            {
                throw ex;
            }
            finally
            {
                crystalReport.Close();
                crystalReport.Dispose();
                GC.Collect();
            }
        }
    }
}