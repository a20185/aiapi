import { get as httpGet } from "http";
import { get as httpsGet } from 'https'

export async function getFile(filename: string) {
    const get = filename.startsWith('https') ? httpsGet : httpGet
    return new Promise((resolve, reject) => {
      get(filename, res => {
        res.setEncoding("utf8");
        let rawData = "";
        res.on("data", chunk => {
          rawData += chunk;
        });
        res.on("end", () => {
          try {
            const parsedData = rawData;
            resolve(parsedData);
          } catch (e) {
            console.error((e as any).message);
            reject(e);
          }
        });
      }).on("error", e => {
        console.error(`Load Config Error: ${e.message}`);
        reject(e);
      });
    });
  }