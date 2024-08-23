import { schedule } from 'node-cron';
import { 
    MIGRATE_TB_PRELIQUIDACION_TMP_HISTORICO, 
    MIGRATE_TB_TRACKING_PAQUETEO, 
    PROMISE_MIGRATE_TB_PEDIDOS_DIGITALIZADO
} from './apis/migrate/migrate-data';
import { TEST_MIGRATE } from './apis/test';
import { VISIT_URL } from './global/visitUrl';

// * ================== POR MINUTOS ================== * //
// migrar cada 10 minutos la tabla TB_TRACKING_PAQUETEO de madre a espejo
schedule( '*/10 * * * *', MIGRATE_TB_TRACKING_PAQUETEO );

// * ================== POR HORAS ================== * //
// * ================== POR DIAS ================== * //


// * ================== POR DIAS DE LA SEMANA ================== * //
schedule( '0 0 15 * * 5', PROMISE_MIGRATE_TB_PEDIDOS_DIGITALIZADO ); // *API-TRIGGER-ECONTROL* //

// migrar tb_preliquidacion_tmp_historico cada domingo a las 07:00 am, mayor a 3 meses
// schedule( '0 7 * * 0', () => MIGRATE_TB_PRELIQUIDACION_TMP_HISTORICO() );



// * ================== TEST ================== * //
// TEST_MIGRATE();

// schedule( '*/15 * * * *', () => VISIT_URL( // Se ejecuta cada 15 minutos
//     [
//         'https://desarrolloenviexpress.site/api_package/go-exito/',
//         'https://enviexpress.app/scanner.php',
//         'https://www.e-control.com.co/api/evidences/imgebox.php'
//     ]
// ));




console.log('los cronjobs estan activos');
