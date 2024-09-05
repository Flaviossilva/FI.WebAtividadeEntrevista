using FI.AtividadeEntrevista.DAL;
using FI.AtividadeEntrevista.DML;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace FI.AtividadeEntrevista.BLL
{
    public class BoBeneficiario
    {
        public void InserirBeneficiario(DML.Beneficiario beneficiario)
        {
            if (!VerificarExistencia(beneficiario))
            {
                throw new Exception("CPF inválido.");
            }

            DaoBeneficiario daoBeneficiario = new DaoBeneficiario();
            daoBeneficiario.InserirBeneficiario(beneficiario);
        }

        public void AlterarBeneficiario(DML.Beneficiario beneficiario)
        {
            DaoBeneficiario daoBeneficiario = new DaoBeneficiario();
            daoBeneficiario.AlterarBeneficiario(beneficiario);
        }

        public void ExcluirBeneficiario(long idCliente)
        {
            DaoBeneficiario daoBeneficiario = new DaoBeneficiario();
            daoBeneficiario.ExcluirBeneficiario(idCliente);
        }

        public List<Beneficiario> ListarBeneficiario(long idCliente)
        {
            DaoBeneficiario daoBeneficiario = new DaoBeneficiario();
            return daoBeneficiario.ListarBeneficiario(idCliente);
        }
        public bool VerificarExistencia(Beneficiario beneficiario)
        {
            DAL.DaoBeneficiario cli = new DAL.DaoBeneficiario();
            return !cli.VerificarExistencia(beneficiario);
        }
    }
}
