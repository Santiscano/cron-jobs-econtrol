import { schedule } from 'node-cron';
import { 
    MIGRATE_TB_PEDIDOS_DIGITALIZADO, 
    MIGRATE_TB_PRELIQUIDACION_TMP_HISTORICO 
} from './apis/migrate/migrate-data';

console.log('los cronjobs estan activos');
// * ================== POR MINUTOS ================== * //
// * ================== POR HORAS ================== * //
// * ================== POR DIAS ================== * //


// * ================== POR DIAS DE LA SEMANA ================== * //
// migrar tb_pedidos_digitalizado cada domingo a las 06:00 am, mayor a 3 meses
schedule( '0 6 * * 0', () => MIGRATE_TB_PEDIDOS_DIGITALIZADO() );

// migrar tb_preliquidacion_tmp_historico cada domingo a las 07:00 am, mayor a 3 meses
schedule( '0 7 * * 0', () => MIGRATE_TB_PRELIQUIDACION_TMP_HISTORICO() );