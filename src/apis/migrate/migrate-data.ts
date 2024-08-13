import axios from "axios";

import { HOST, PATH1, PATH2 } from './config-apiTriggerEcontrol';
import { connection } from '../../config/db/mysql';

const url = `${HOST}/api/count-pedidos-digitalizados`;
const cantidad = 1;
let countErrors = 0;

export const PROMISE_MIGRATE_TB_PEDIDOS_DIGITALIZADO = async () => {
    try {
        const response = await (await axios.get(url)).data;
        const { data } = response;

        const totalQuerys = Math.ceil(data / cantidad);
        console.log('totalQuerys', totalQuerys);

        for (let i = 0; i < totalQuerys; i++) {
            setTimeout(() => {
                console.log('espera 5 segundos');
            }, 30 * 60 * 60 * 1000); // cada 30 segundos
            const offset = i * cantidad;
            console.log(`inicia con offset: ${offset} y cantidad: ${cantidad}`);
            await MIGRATE_TB_PEDIDOS_DIGITALIZADO(offset, cantidad);
            console.log('finaliza este ciclo');
        }
    } catch (error) {
        console.log('error', error);
    } finally {
        const countQuerysPending = await (await axios.get(url)).data;
        if (countQuerysPending.data > 0) {
            console.log(`quedan querys pendientes`);

            countErrors++;
            if (countErrors > 20) {
                countErrors = 0;
                console.log('no se repetira la auto-invocacion');
                return;
            } else {
                PROMISE_MIGRATE_TB_PEDIDOS_DIGITALIZADO();
            }

        } else {
            console.log('no hay querys pendientes, finalizado todo');
        }
    }
}

export const MIGRATE_TB_PEDIDOS_DIGITALIZADO = async (offset:number, limit:number) => {
    try {
        const url = `${HOST}/${PATH1}`;
        const response = await axios.post(url, {
            offset,
            limit
        });

        if (response.data.message === "no hay pedidos" || response.data.message === "no hay barcodes") {
            console.log('no hay pedidos o barcodes');
            return;
        }

        let consecutivos = response.data.data.data.map((item:any) => item.CONSECUTIVO).join('-');
        console.log('consecutivos', consecutivos);
        
        const MAX_LOG_LENGTH = 5500;
        let log = JSON.stringify(`inserts:${JSON.stringify(response.data.data.result_insert)}
        delete:${JSON.stringify(response.data.data.responseEliminados)}
        update:${JSON.stringify(response.data.data.responseActualizados)}
        comprobantes:${JSON.stringify(response.data.data.actualizaciones_comprobantes)}`);
        if (log.length > MAX_LOG_LENGTH) {
            log = log.substring(0, MAX_LOG_LENGTH);
        }

        const sentence = `INSERT INTO TB_CRONJOB (CONSECUTIVO, LOG) 
            VALUES (${JSON.stringify(consecutivos)}, ${log})
        `;
        const updateRes = await connection.query(sentence);
        console.log('updateRes', updateRes);
    } catch (error) {
        // @ts-ignore
        if (error.response) {
            // @ts-ignore
            const errorMessage = error.response?.data;
            // @ts-ignore
            const response = await connection.query('INSERT INTO TB_CRONJOB (LOG) VALUES (?)', [JSON.stringify(errorMessage)]);
            // @ts-ignore
            console.log(error.response.status, 'response', response);
        } else {
            // @ts-ignore
            const cause = error.cause ? error.cause : error;
            console.log('error desconocido', cause);
            const insert = await connection.query('INSERT INTO TB_CRONJOB (LOG) VALUES (?)', [JSON.stringify(cause)]);
            console.log('insert', insert);
        }
    }
};


export const MIGRATE_TB_PRELIQUIDACION_TMP_HISTORICO = async () => {
    try {
        const url = `${HOST}/${PATH2}`;
        const response = await axios.get(url);
        await connection.query('INSERT INTO TB_CRONJOB (LOG) VALUES (?)', [JSON.stringify(response.data)]);
    } catch (error) {
        // @ts-ignore
        await connection.query('INSERT INTO TB_CRONJOB (LOG) VALUES (?)', [JSON.stringify(error.response.data.message)]);
    }
};
