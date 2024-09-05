using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace FI.AtividadeEntrevista.DML
{
    public class Beneficiario
    {
        public long Id { get; set; }

        [Required]
        [RegularExpression(@"\d{3}\.\d{3}\.\d{3}-\d{2}", ErrorMessage = "Formato de CPF inválido. Usar o seguinte formato 010.011.111-00")]
        public string CPF { get; set; }
        [Required]
        public string Nome { get; set; }
        public long IdCliente { get; set; }  // Relaciona com o cliente
    }
}
