using Microsoft.Owin;
using Owin;

[assembly: OwinStartupAttribute(typeof(BOD_APP.Startup))]
namespace BOD_APP
{
    public partial class Startup
    {
        public void Configuration(IAppBuilder app)
        {
            ConfigureAuth(app);
        }
    }
}
