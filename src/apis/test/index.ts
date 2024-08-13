import axios from "axios";
import { connection } from "../../config/db/mysql";

let countErrors = 0;

export const TEST_MIGRATE = async () => {
    try {
        throw new Error('Error de prueba');
    } catch (error) {
        if (countErrors <= 5) {
            console.log(`error ${countErrors} veces`);
            countErrors++;
            TEST_MIGRATE();
        } else {
            console.log('ya no se ejecutara mas el error');
        }
    }
}