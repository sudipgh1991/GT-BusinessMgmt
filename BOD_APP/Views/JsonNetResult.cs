using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace BOD_APP.Utility
{
    public class JsonNetResult : JsonResult
    {
        public object Data { get; set; }
        public JsonNetResult()
        {

        }

        public override void ExecuteResult(ControllerContext context)
        {
            //base.ExecuteResult(context);
            HttpResponseBase response = context.HttpContext.Response;
            response.ContentType = "application/json";
            if(ContentEncoding != null)
            {
                response.ContentEncoding = ContentEncoding;
            }
            if(Data != null)
            {
                JsonTextWriter writer = new JsonTextWriter(response.Output)
                {
                    Formatting = Formatting.Indented
                };
                JsonSerializer serialiser = JsonSerializer.Create(new JsonSerializerSettings());
                serialiser.Serialize(writer, Data);
                writer.Flush();
            }
        }
    }
}