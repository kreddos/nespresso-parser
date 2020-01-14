import fs from "fs";
import path from "path";

function checkPath(path: string) {
    return new Promise((resolve) => {
        fs.access(path, fs.constants.F_OK, (err) => {
            return err ? resolve(false) : resolve(true);
        });
    });
}

function createDir(path: string) {
    return new Promise((res, rej) => {
        fs.mkdir(path, {recursive: true}, (err) => {
            if (!err) {
                res();
                return;
            }
            rej(err);
        });
    })
}

function stringify(data: any) {
    return new Promise((res, rej) => {
        try {
            const result = JSON.stringify(data);
            res(result);
        } catch (e) {
            rej(e);
        }
    });
}

async function createFile(directory: string, data: any) {
    const fileName = `data-${new Date().getTime()}.json`;

    const jsonString = await stringify(data);
    return new Promise((res, rej) => {
        const filePath = path.join(directory, fileName);
        fs.writeFile(filePath, jsonString, (err) => {
            if (!err) {
                res();
                return;
            }
            rej(err);
        });
    });
}

export async function saveToFile(directory: string, data: any) {
    const isExistsResultsDirectory = await checkPath(directory);

    if (!isExistsResultsDirectory) {
        await createDir(directory);
    }

    await createFile(directory, data);
}
