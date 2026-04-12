import { ipcMain } from "electron";


export let LSPromise = new Promise((resolve, reject) => {
    ipcMain.on("ExportLS", (event, data) => {
        let LSData = data
          resolve(LSData)
    }

)})