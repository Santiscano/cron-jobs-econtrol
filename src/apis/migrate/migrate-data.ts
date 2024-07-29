import axios from "axios";

import { HOTS, PATH1, PATH2 } from './api-trigger-econtrol';
import { connection } from '../../config/db/mysql';

export const MIGRATE_TB_PEDIDOS_DIGITALIZADO = async () => {
    try {
        const url = `${HOTS}/${PATH1}`;
        const response = await axios.post(url);
        await connection.query('INSERT INTO TB_CRONEJOB (log) VALUES (?)', [JSON.stringify(response.data)]);
    } catch (error) {
        await connection.query('INSERT INTO TB_CRONEJOB (log) VALUES (?)', [JSON.stringify(error)]);
    }
};


export const MIGRATE_TB_PRELIQUIDACION_TMP_HISTORICO = async () => {
    try {
        const url = `${HOTS}/${PATH2}`;
        const response = await axios.post(url);
        await connection.query('INSERT INTO TB_CRONEJOB (log) VALUES (?)', [JSON.stringify(response.data)]);
    } catch (error) {
        await connection.query('INSERT INTO TB_CRONEJOB (log) VALUES (?)', [JSON.stringify(error)]);
    }
};
