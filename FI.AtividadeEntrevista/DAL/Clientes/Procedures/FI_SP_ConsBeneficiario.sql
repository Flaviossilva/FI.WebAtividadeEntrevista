﻿CREATE PROCEDURE FI_SP_ConsBeneficiario
    @IdCliente INT
AS
BEGIN
    SELECT ID, CPF, NOME
    FROM BENEFICIARIOS
    WHERE IDCLIENTE = @IdCliente;
END
