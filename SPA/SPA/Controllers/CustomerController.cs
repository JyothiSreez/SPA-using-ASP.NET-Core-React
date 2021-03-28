using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using System.Data;
using System.Data.SqlClient;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Configuration;
using SPA.Model;

namespace SPA.Controllers
{
    [Route("api/[controller]")]
    public class CustomerController : Controller
    {
        IConfiguration _config;

        public CustomerController(IConfiguration config)
        {

            _config = config;
        }

        [HttpGet ("action"), Route("Customers")]
        public IActionResult Customers()
        {
            string connStr = _config.GetSection("Configuration").GetSection("ConnString").Value;
            List<Customer> customers = new List<Customer>();
            using (SqlConnection conn = new SqlConnection(connStr))
            {
                SqlCommand cmd = new SqlCommand();
                conn.Open();
                cmd = new SqlCommand("select * from Customer", conn);
                SqlDataReader reader = cmd.ExecuteReader();

                while(reader.Read())
                {
                    Customer customer = new Customer
                    {
                        CustomerId = Convert.ToInt32(reader["CustomerId"].ToString()),
                        Name = reader["Name"].ToString(),
                        Address = reader["Address"].ToString(),
                        State = reader["State"].ToString(),
                        City = reader["City"].ToString(),
                        Country = reader["Country"].ToString(),
                        Email = reader["Email"].ToString()
                    };

                    customers.Add(customer);
                }
            }

                 return Json(customers);
        }

        [HttpGet("action"), Route("SaveCustomer")]
        public IActionResult SaveCustomer([FromBody] Customer c)
        {

            string connStr = _config.GetSection("Configuration").GetSection("ConnString").Value;
            using (SqlConnection conn = new SqlConnection(connStr))
            {
                SqlCommand cmd = new SqlCommand();
                conn.Open();
                cmd = new SqlCommand("[sp_updateCustomer]", conn);
                cmd.CommandType = CommandType.StoredProcedure;
                cmd.Parameters.Add("@customerId", SqlDbType.Int).Value = c.CustomerId;
                cmd.Parameters.Add("@name", SqlDbType.NVarChar).Value = c.Name;
                cmd.Parameters.Add("@address", SqlDbType.NVarChar).Value = c.Address;
                cmd.Parameters.Add("@city", SqlDbType.NVarChar).Value = c.City;
                cmd.Parameters.Add("@state", SqlDbType.NVarChar).Value = c.State;
                cmd.Parameters.Add("@country", SqlDbType.NVarChar).Value = c.Country;
                cmd.Parameters.Add("@email", SqlDbType.NVarChar).Value = c.Email;
                cmd.ExecuteNonQuery();
                return Json(true);

            }
        }


    }
}