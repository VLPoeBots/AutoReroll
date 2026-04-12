import { ipcMain, clipboard } from "electron";
import {win} from "../main.js"

ipcMain.on("InventoryImage",  (event, args) => {
    console.log(args)
let InventoryImage = clipboard.readImage().getSize()
console.log(InventoryImage.width, InventoryImage.height )
win.webContents.send("MapCoords", [InventoryImage.width,InventoryImage.height])
}
)