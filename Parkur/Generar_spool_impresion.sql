

declare
    ret varchar2(200);
    cont numeric := 0;

    cursor cur_polizas is
        SELECT id_cotizacion cotizacion
          FROM rh.cotiza
         --WHERE seccion = '01'
         --and poliza in ('000003299983',
--'000003300000'
--);
         WHERE  id_cotizacion in ('JNT-0018391073'
         );     
         
    PROCEDURE Modificar_Parametros_Impresion (varParametro IMP.PARAMETROS_IMPRESION.PAI_NOMBRE_PARAMETRO%type, varValor IMP.PARAMETROS_IMPRESION.PAI_VALOR%type) IS
        PRAGMA AUTONOMOUS_TRANSACTION;
    BEGIN

        Update IMP.PARAMETROS_IMPRESION
        Set PAI_VALOR = varValor
        Where PAI_NOMBRE_PARAMETRO = varParametro;
        
        Commit;

    END;

begin                                       
    
    Modificar_Parametros_Impresion('ERROR_LOG_ACTIVO','S');
    
    for c in cur_polizas
    loop
        delete imp.cotizacion_spool where cos_cotizacion = c.cotizacion;
        delete imp.cotizacion_estado_impresion where cei_cotizacion = c.cotizacion;
        delete imp.cotizacion_bpp where cbp_cotizacion = c.cotizacion;
        
        imp.pa_interface_imp.PROCESAR_COMPROBANTE(c.cotizacion,ret);
        dbms_output.put_line(ret);
        
    end loop;

    Commit;        
   
    Modificar_Parametros_Impresion('ERROR_LOG_ACTIVO','N');

end;
/