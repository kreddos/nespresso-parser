import { parseNespresso } from "./parseNespresso";
import { saveToFile } from './saveToFile';

async function main() {
    console.log('start parsing');
    try {
        const capsulesData = await parseNespresso();
        const directory = './results';
        await saveToFile(directory, capsulesData);
        console.log('parsing success')
    } catch (e) {
        console.log('parsing failure')
    }
}

main();
