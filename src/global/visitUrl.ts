import axios from 'axios';
import cron from 'node-cron';
import { HOST_VISIT } from '../apis/migrate/config-apiTriggerEcontrol';

const route = `${HOST_VISIT}/go-exito-ebox`;

export const VISIT_URL = async (urls: string[], data?: any) => {
    try {
        const response = await axios.post(route,{
            urls,
            data
        });
        console.log('response', response.data);
        return;
    } catch (error) {
        console.log('error', error);
    }
};