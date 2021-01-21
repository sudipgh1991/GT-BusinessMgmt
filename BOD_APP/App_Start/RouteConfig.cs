using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using System.Web.Routing;

namespace BOD_APP
{
    public class RouteConfig
    {
        public static void RegisterRoutes(RouteCollection routes)
        {
            routes.IgnoreRoute("{resource}.axd/{*pathInfo}");

            routes.MapRoute(
                name: "Default",
                url: "{controller}/{action}/{id}",
                defaults: new { controller = "Account", action = "AppLogin", id = UrlParameter.Optional }
            );
            routes.MapRoute(
               name: "Task",
               url: "{controller}/{action}/{id}/{taskid}",
               defaults: new { controller = "Account", action = "AppLogin", id = UrlParameter.Optional, taskid=UrlParameter.Optional }
           );
        }
    }
}
