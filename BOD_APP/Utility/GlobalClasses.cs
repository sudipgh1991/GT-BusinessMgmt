using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Data;
using System.Reflection;
using BOD_DAL;
using BOD_DAL.Models;

namespace BOD_APP.Utility
{
  public class GlobalClasses
  {
    public static UserModel UserModel { get; set; }
    public static UserModel SPUserModel { get; set; }
    public GlobalData global = new GlobalData();
    public static DataTable dt = new DataTable();
    DAL dl = new DAL();
    public DDLList ddl = new DDLList();
    public List<DDLList> DropDownPopulation(DDLList data)
    {

      List<DDLList> ddlList = dl.GetDDLList(data);
      return ddlList;

    }
    public  List<T> ConvertDataTable<T>(DataTable dt)
    {
      List<T> data = new List<T>();
      foreach (DataRow row in dt.Rows)
      {
        T item = GetItem<T>(row);
        data.Add(item);
      }
      return data;
    }
    public  T GetItem<T>(DataRow dr)
    {
      Type temp = typeof(T);
      T obj = Activator.CreateInstance<T>();

      foreach (DataColumn column in dr.Table.Columns)
      {
        foreach (PropertyInfo pro in temp.GetProperties())
        {
          if (pro.Name == column.ColumnName)
            pro.SetValue(obj, dr[column.ColumnName], null);
          else
            continue;
        }
      }
      return obj;
    }

    public  T GetItem1<T>(DataTable dt)
    {
      Type temp = typeof(T);
      T obj = Activator.CreateInstance<T>();

      T data = Activator.CreateInstance<T>();
      foreach (DataRow row in dt.Rows)
      {
        data = GetItem<T>(row);
      }


      return data;
    }
  }
}