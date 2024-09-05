using FI.AtividadeEntrevista.DML;
using System;
using System.Collections.Generic;
using System.Data.SqlClient;
using System.Data;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace FI.AtividadeEntrevista.DAL
{
    internal class DaoBeneficiario : AcessoDados
    {

        /// <summary>
        /// Inclui um novo beneficiário para um cliente
        /// </summary>
        /// <param name="beneficiario">Objeto de beneficiário</param>
        public void InserirBeneficiario(DML.Beneficiario beneficiario)
        {
            List<SqlParameter> parametros = new List<SqlParameter>
            {
                new SqlParameter("CPF", beneficiario.CPF),
                new SqlParameter("Nome", beneficiario.Nome),
                new SqlParameter("IdCliente", beneficiario.IdCliente)
            };

            base.Executar("FI_SP_IncBeneficiario", parametros);
        }


        internal bool VerificarExistencia(Beneficiario beneficiario)
        {
            List<System.Data.SqlClient.SqlParameter> parametros = new List<System.Data.SqlClient.SqlParameter>();

            parametros.Add(new System.Data.SqlClient.SqlParameter("CPF", beneficiario.CPF));
            parametros.Add(new System.Data.SqlClient.SqlParameter("IdCliente", beneficiario.IdCliente));

            DataSet ds = base.Consultar("FI_SP_VerificaBeneficiarios", parametros);

            return ds.Tables[0].Rows.Count > 0;
        }


        /// <summary>
        /// Lista os beneficiários de um cliente específico
        /// </summary>
        public List<DML.Beneficiario> ListarBeneficiario(long idCliente)
        {
            List<SqlParameter> parametros = new List<SqlParameter>
            {
                new SqlParameter("IdCliente", idCliente)
            };

            DataSet ds = base.Consultar("FI_SP_ConsBeneficiario", parametros);
            List<DML.Beneficiario> beneficiarios = new List<DML.Beneficiario>();

            if (ds.Tables[0].Rows.Count > 0)
            {
                foreach (DataRow row in ds.Tables[0].Rows)
                {
                    DML.Beneficiario ben = new DML.Beneficiario
                    {
                        Id = row.Field<long>("ID"),
                        CPF = row.Field<string>("CPF"),
                        Nome = row.Field<string>("Nome"),
                    };
                    beneficiarios.Add(ben);
                }
            }

            return beneficiarios;
        }

        /// <summary>
        /// Altera um beneficiário existente
        /// </summary>
        /// <param name="beneficiario">Objeto de beneficiário</param>
        public void AlterarBeneficiario(DML.Beneficiario beneficiario)
        {
            List<SqlParameter> parametros = new List<SqlParameter>
            {
                new SqlParameter("Id", beneficiario.Id),
                new SqlParameter("IdCliente", beneficiario.IdCliente),
                new SqlParameter("CPF", beneficiario.CPF),
                new SqlParameter("Nome", beneficiario.Nome)
            };

            base.Executar("FI_SP_AltBeneficiario", parametros);
        }

        /// <summary>
        /// Exclui um beneficiário existente
        /// </summary>
        /// <param name="id">ID do beneficiário</param>
        public void ExcluirBeneficiario(long id)
        {
            List<SqlParameter> parametros = new List<SqlParameter>
            {
                new SqlParameter("Id", id)
            };

            base.Executar("FI_SP_DelBeneficiario", parametros);
        }
    }
}



