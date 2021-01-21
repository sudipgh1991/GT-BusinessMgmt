using System.Web;
using System.Web.Optimization;

namespace BOD_APP
{
    public class BundleConfig
    {
        // For more information on bundling, visit http://go.microsoft.com/fwlink/?LinkId=301862
        public static void RegisterBundles(BundleCollection bundles)
        {
            bundles.Add(new ScriptBundle("~/bundles/jquery").Include(
                        "~/Scripts/jquery-{version}.js"));

            bundles.Add(new ScriptBundle("~/bundles/jqueryval").Include(
                        "~/Scripts/jquery.validate*"));

            // Use the development version of Modernizr to develop with and learn from. Then, when you're
            // ready for production, use the build tool at http://modernizr.com to pick only the tests you need.
            bundles.Add(new ScriptBundle("~/bundles/modernizr").Include(
                        "~/Scripts/modernizr-*"));
            bundles.Add(new ScriptBundle("~/bundles/dtjquery").Include("~/Content/app-assets/vendors/js/tables/datatable/datatables.min.js",
"~/Content/app-assets/vendors/js/tables/datatable/dataTables.buttons.min.js",
"~/Content/app-assets/vendors/js/tables/datatable/buttons.bootstrap4.min.js",
"~/Content/app-assets/vendors/js/tables/jszip.min.js",
"~/Content/app-assets/vendors/js/tables/pdfmake.min.js",
"~/Content/app-assets/vendors/js/tables/vfs_fonts.js",
"~/Content/app-assets/vendors/js/tables/buttons.html5.min.js",
"~/Content/app-assets/vendors/js/tables/buttons.print.min.js",
"~/Content/app-assets/vendors/js/tables/buttons.colVis.min.js", "~/Scripts/utility/datatablecommon.js"));



            bundles.Add(new ScriptBundle("~/bundles/dtjqueryproject").Include("~/Content/app-assets/vendors/js/tables/jquery.dataTables.min.js"
, "~/Content/app-assets/vendors/js/tables/datatable/dataTables.bootstrap4.min.js"
, "~/Content/app-assets/js/core/libraries/jquery_ui/jquery-ui.min.js"
, "~/Content/app-assets/js/scripts/ui/jquery-ui/date-pickers.js"
, "~/Content/app-assets/vendors/js/forms/select/select2.min.js"));


            bundles.Add(new StyleBundle("~/datatable/css").Include("~/Content/app-assets/vendors/css/tables/datatable/datatables.min.css",
"~/Content/app-assets/vendors/css/tables/extensions/buttons.dataTables.min.css",
"~/Content/app-assets/vendors/css/tables/datatable/buttons.bootstrap4.min.css"));
            bundles.Add(new ScriptBundle("~/bundles/bootstrap").Include(
                      "~/Scripts/bootstrap.js",
                      "~/Scripts/respond.js"));

            bundles.Add(new StyleBundle("~/Content/css").Include(
                      "~/Content/bootstrap.css",
                      "~/Content/site.css"));

            bundles.Add(new StyleBundle("~/datatableproject/css").Include(
                      "~/Content/app-assets/vendors/css/tables/datatable/dataTables.bootstrap4.min.css"
, "~/Content/app-assets/vendors/css/ui/jquery-ui.min.css"
, "~/Content/app-assets/vendors/css/forms/selects/select2.min.css"));



           
            // Set EnableOptimizations to false for debugging. For more information,
            // visit http://go.microsoft.com/fwlink/?LinkId=301862
            BundleTable.EnableOptimizations = true;
        }
    }
}
