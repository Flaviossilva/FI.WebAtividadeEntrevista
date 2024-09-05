$(document).ready(function () {
    var beneficiarios = []; 
    $('#CPF').mask('000.000.000-00', { reverse: true });
    $('#BeneficiarioCPF').mask('000.000.000-00', { reverse: true });
    // Função para adicionar beneficiário ao grid
    $('#salvarBeneficiario').click(function () {
        var cpf = $('#BeneficiarioCPF').val();
        var nome = $('#BeneficiarioNome').val();

        // Adiciona o beneficiário na lista 
        if (cpf && nome) {
            beneficiarios.push({ CPF: cpf, Nome: nome });
            atualizarTabelaBeneficiarios();
            $('#BeneficiarioCPF').val('');
            $('#BeneficiarioNome').val('');
        } else {
            alert("Preencha ambos os campos de CPF e Nome para incluir o beneficiário.");
        }
    });

    function atualizarTabelaBeneficiarios() {
        var tbody = $('#beneficiariosTable tbody');
        tbody.empty();  
        beneficiarios.forEach(function (beneficiario, index) {
            var row = `
            <tr>
                <td>${beneficiario.CPF}</td>
                <td>${beneficiario.Nome}</td>
                <td>
                    <button class="btn btn-sm btn-danger" onclick="removerBeneficiario(${index})">Remover</button>
                </td>
            </tr>`;
            tbody.append(row);
        });
    }

    // Função para remover beneficiário da lista
    window.removerBeneficiario = function (index) {
        beneficiarios.splice(index, 1);  
        atualizarTabelaBeneficiarios();  
    };

    // Função para enviar os dados ao servidor quando o formulário de cliente for salvo
    $('#formCadastro').submit(function (e) {
        e.preventDefault(); 

        var clienteData = {
            "NOME": $(this).find("#Nome").val(),
            "CEP": $(this).find("#CEP").val(),
            "Email": $(this).find("#Email").val(),
            "Sobrenome": $(this).find("#Sobrenome").val(),
            "Nacionalidade": $(this).find("#Nacionalidade").val(),
            "Estado": $(this).find("#Estado").val(),
            "Cidade": $(this).find("#Cidade").val(),
            "Logradouro": $(this).find("#Logradouro").val(),
            "Telefone": $(this).find("#Telefone").val(),
            "CPF": $(this).find("#CPF").val(),
            "Beneficiarios": beneficiarios 
        };

        // Envia os dados ao backend via AJAX
        $.ajax({
            url: urlPost, 
            method: "POST",
            data: JSON.stringify(clienteData),
            contentType: 'application/json',
            success: function (r) {
                ModalDialog("Sucesso!", "Cliente e beneficiários salvos com sucesso!");
                $("#formCadastro")[0].reset();  
                beneficiarios = []; 
                atualizarTabelaBeneficiarios(); 
            },
            error: function (r) {
                if (r.status === 400)
                    ModalDialog("Ocorreu um erro", r.responseJSON);
                else if (r.status === 500)
                    ModalDialog("Ocorreu um erro", "Ocorreu um erro interno no servidor.");
            }
        });
    });
});

// Função de exibição do modal de diálogo
function ModalDialog(titulo, texto) {
    var random = Math.random().toString().replace('.', '');
    var texto = '<div id="' + random + '" class="modal fade">                                                               ' +
        '        <div class="modal-dialog">                                                                                 ' +
        '            <div class="modal-content">                                                                            ' +
        '                <div class="modal-header">                                                                         ' +
        '                    <button type="button" class="close" data-dismiss="modal" aria-hidden="true">×</button>         ' +
        '                    <h4 class="modal-title">' + titulo + '</h4>                                                    ' +
        '                </div>                                                                                             ' +
        '                <div class="modal-body">                                                                           ' +
        '                    <p>' + texto + '</p>                                                                           ' +
        '                </div>                                                                                             ' +
        '                <div class="modal-footer">                                                                         ' +
        '                    <button type="button" class="btn btn-default" data-dismiss="modal">Fechar</button>             ' +
        '                </div>                                                                                             ' +
        '            </div><!-- /.modal-content -->                                                                         ' +
        '        </div><!-- /.modal-dialog -->                                                                              ' +
        '    </div> <!-- /.modal -->                                                                                        ';

    $('body').append(texto);
    $('#' + random).modal('show');
}
