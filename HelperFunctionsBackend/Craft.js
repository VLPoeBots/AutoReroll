import { app, ipcMain } from "electron";
import { win,  LogFilePath, RerollPath, HarvestRerollPath, AlchScourPath } from "../main.js";
import { WriteToFile } from "./LogFiles.js";
import { StartCraft } from "./SpawnPython.js";


let Counter;


ipcMain.on("StartCrafting", (event, args) => {
  win.webContents.send("Counter", "reset");
  Counter = 0;
  WriteToFile(LogFilePath, "");
  WriteToFile(LogFilePath, "{~~~~~~~~~~~~New Crafting Project~~~~~~~~~~~~");

 let ModName = args[0];
 let CraftMaterial = args[4];
 let ExclusionMods = args[6];

  WriteToFile(LogFilePath, `ModName: ${ModName}`);
  WriteToFile(LogFilePath, `CraftMaterial: ${CraftMaterial}`);
  if (ExclusionMods.length > 0) {
    WriteToFile(LogFilePath, `ExclusionMods: ${ExclusionMods}`);
  }
  
  if (CraftMaterial === "Harvest") {
    StartCraft(HarvestRerollPath, args);
  } else if(CraftMaterial === "AlchScour") {
    StartCraft(AlchScourPath, args, Counter);
  }
  else {
    StartCraft(RerollPath, args, Counter);
  }
});
