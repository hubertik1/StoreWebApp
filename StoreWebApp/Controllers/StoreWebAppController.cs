using System.Data;
using Microsoft.Data.SqlClient;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace StoreWebApp.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class StoreWebAppController : ControllerBase
    {
        private IConfiguration _configuration;
        public StoreWebAppController(IConfiguration configuration)
        {
            _configuration = configuration;
        }

        [HttpGet]
        [Route("GetProducts")]
        public JsonResult GetProducts()
        {
            string query = "SELECT * FROM dbo.Product";
            DataTable table = new DataTable();

            string sqlDataSource = _configuration.GetConnectionString("StoreWebAppDBCon");

            string dbPassword = Environment.GetEnvironmentVariable("DB_PASSWORD");
            if (!string.IsNullOrEmpty(dbPassword))
            {
                sqlDataSource = sqlDataSource.Replace("%DB_PASSWORD%", dbPassword);
            }
            else
            {
                throw new Exception("Zmienna środowiskowa DB_PASSWORD nie została ustawiona.");
            }

            SqlDataReader myReader;
            using (SqlConnection myCon = new SqlConnection(sqlDataSource))
            {
                myCon.Open();
                using (SqlCommand myCommand = new SqlCommand(query, myCon))
                {
                    myReader = myCommand.ExecuteReader();
                    table.Load(myReader);
                    myReader.Close();
                }
            }

            return new JsonResult(table);
        }



    }
}
