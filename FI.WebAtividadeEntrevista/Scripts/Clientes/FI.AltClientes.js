$(document).ready(function () {
    var beneficiarios = [];  

    function carregarBeneficiarios(idCliente) {
        $.ajax({
            url: urlObterBeneficiarios,
            type: 'GET',
            data: { idCliente: idCliente },
            success: function (data) {
                if (data && data.length > 0) {
                    beneficiarios = data;  
                } else {
                    beneficiarios = []; 
                }
                atualizarTabelaBeneficiarios(); 
            },
            error: function (error) {
                console.error("Erro ao carregar beneficiários: ", error);
            }
        });
    }


    if (obj) {
        $('#formCadastro #Nome').val(obj.Nome);
        $('#formCadastro #CEP').val(obj.CEP);
        $('#formCadastro #Email').val(obj.Email);
        $('#formCadastro #Sobrenome').val(obj.Sobrenome);
        $('#formCadastro #Nacionalidade').val(obj.Nacionalidade);
        $('#formCadastro #Estado').val(obj.Estado);
        $('#formCadastro #Cidade').val(obj.Cidade);
        $('#formCadastro #Logradouro').val(obj.Logradouro);
        $('#formCadastro #Telefone').val(obj.Telefone);
        $('#formCadastro #CPF').val(obj.CPF);

        // Carrega os beneficiários existentes e atualiza o grid
        carregarBeneficiarios(obj.Id);  
    }

    // Função para adicionar beneficiário ao grid
    $('#salvarBeneficiario').off('click').on('click', function (event) {
        event.preventDefault();  

        var cpf = $('#BeneficiarioCPF').val();
        var nome = $('#BeneficiarioNome').val();
        var index = $(this).data('index'); 
        var id = $(this).data('id');  

        if (cpf && nome) {
            if (index !== undefined) {
                // Edita o beneficiário existente
                beneficiarios[index] = { Id: id, CPF: cpf, Nome: nome };  
                $(this).removeData('index'); 
                $(this).removeData('id');  
            } else {
                // Adiciona um novo beneficiário
                beneficiarios.push({ CPF: cpf, Nome: nome });
            }
            atualizarTabelaBeneficiarios();
            $('#BeneficiarioCPF').val('');
            $('#BeneficiarioNome').val('');
            $('#beneficiariosModal').modal('hide'); 
        } else {
            alert("Preencha ambos os campos de CPF e Nome para incluir ou editar o beneficiário.");
        }
    });

    // Função para abrir o modal de edição e carregar os dados do beneficiário
    window.editarBeneficiario = function (index) {
        var beneficiario = beneficiarios[index];  
        $('#BeneficiarioCPF').val(beneficiario.CPF);
        $('#BeneficiarioNome').val(beneficiario.Nome);
        $('#salvarBeneficiario').data('index', index);  
        $('#salvarBeneficiario').data('id', beneficiario.Id); 
        $('#beneficiariosModal').modal('show'); 
    };

    // Função para remover beneficiário da lista
    window.removerBeneficiario = function (index) {
        var beneficiario = beneficiarios[index];
        var id = beneficiario.Id;  

        if (confirm("Você tem certeza que deseja remover este beneficiário?")) {
            $.ajax({
                url: urlRemoverBeneficiario,
                type: 'POST',
                data: { id: id },
                success: function (response) {
                    if (response.success) {
                        beneficiarios.splice(index, 1);
                        atualizarTabelaBeneficiarios();
                        $('#beneficiariosModal').modal('hide');
                    } else {
                        alert("Ocorreu um erro ao tentar remover o beneficiário.");
                    }
                },
                error: function (error) {
                    console.error("Erro ao remover beneficiário: ", error);
                    alert("Ocorreu um erro ao tentar remover o beneficiário.");
                }
            });
        }
    };

    // Função para atualizar a tabela de beneficiários
    function atualizarTabelaBeneficiarios() {
        var tbody = $('#beneficiariosTable tbody');
        tbody.empty();  

        if (beneficiarios.length > 0) {
            beneficiarios.forEach(function (beneficiario, index) {
                var row = `
                    <tr>
                        <td>${beneficiario.CPF}</td>
                        <td>${beneficiario.Nome}</td>
                        <td>
                            <button type="button" class="btn btn-sm btn-primary" onclick="editarBeneficiario(${index})">Editar</button>
                            <button type="button" class="btn btn-sm btn-primary" onclick="removerBeneficiario(${index})">Remover</button>
                        </td>
                    </tr>`;
                tbody.append(row);
            });
        } else {
            tbody.append(`
                <tr>
                    <td colspan="3">Nenhum beneficiário encontrado.</td>
                </tr>`);
        }
    }

    // Submissão do formulário de cliente, incluindo os beneficiários
    $('#formCadastro').off('submit').on('submit', function (e) {
        e.preventDefault();  
        // Coleta os dados do formulário de cliente
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

        // Envia os dados ao backend 
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
                $('#beneficiariosModal').modal('hide'); 
                window.location.href = urlRetorno;  
            },
            error: function (r) {
                if (r.status === 400)
                    ModalDialog("Ocorreu um erro", r.responseJSON);
                else if (r.status === 500)
                    ModalDialog("Ocorreu um erro", "Ocorreu um erro interno no servidor.");
            }
        });
    });

    // Função de exibição do modal de diálogo
    function ModalDialog(titulo, texto) {
        var random = Math.random().toString().replace('.', '');
        var modalHtml = `
            <div id="${random}" class="modal fade">
                <div class="modal-dialog">
                    <div class="modal-content">
                        <div class="modal-header">
                            <button type="button" class="close" data-dismiss="modal" aria-hidden="true">×</button>
                            <h4 class="modal-title">${titulo}</h4>
                        </div>
                        <div class="modal-body">
                            <p>${texto}</p>
                        </div>
                        <div class="modal-footer">
                            <button type="button" class="btn btn-default" data-dismiss="modal">Fechar</button>
                        </div>
                    </div>
                </div>
            </div>`;

        $('body').append(modalHtml);
        $('#' + random).modal('show');
    }
});

