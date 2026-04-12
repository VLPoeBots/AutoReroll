import { app, ipcMain } from "electron";
import { win,  LogFilePath, RerollPath, HarvestRerollPath, AlchScourPath,SoundPath,MapsPath } from "../main.js";
import { WriteToFile } from "./LogFiles.js";
import { StartCraft } from "./SpawnPython.js";
import { LSPromise } from "./LocalStorageImport.js";

let Counter;
let Coords;
LSPromise.then((data) => { 
  
  
    Coords = data
    for (let [Key,Value] of Object.entries(Coords)) {
        if(!Key.includes("Coords")){
            delete Coords[Key]
        }else{
            let NewKey = Key.replace("Coords", "")
            Coords[NewKey] = Value
            delete Coords[Key]
        } 
    }



  

ipcMain.on("StartCrafting", async (event, args) => {
  win.webContents.send("Counter", "reset");
  Counter = 0;
  WriteToFile(LogFilePath, "");
  WriteToFile(LogFilePath, "{~~~~~~~~~~~~New Crafting Project~~~~~~~~~~~~");

 let ModName = args[0];
 let CraftMaterial = args[2];
 let ExclusionMods = args[4];
 let MapRollOptions = [args[7], args[8], args[9]];

  WriteToFile(LogFilePath, `ModName: ${ModName}`);
  WriteToFile(LogFilePath, `CraftMaterial: ${CraftMaterial}`);
  if (ExclusionMods.length > 0) {
    WriteToFile(LogFilePath, `ExclusionMods: ${ExclusionMods}`);
  }
  if (CraftMaterial === "Harvest") {
    StartCraft(HarvestRerollPath,args,  Coords["Harvest"],Coords["HarvestTab"], args, Counter, SoundPath);
  } else if(CraftMaterial === "AlchScour") {
    StartCraft(AlchScourPath,args,`${Coords["AlchOrb"]}/${Coords["ScourOrb"]}`,Coords["CurrencyTab"], Counter, SoundPath);
  
  }else if (CraftMaterial === "Maps") {

    let MapRollCoords = [Coords["Maps"], Coords["WisdomScroll"], Coords["AlchOrb"], Coords["ChaosOrb"],
  Coords["VaalOrb"], Coords["ScourOrb"],Coords["MapsTab"]]

    StartCraft(MapsPath, args,"",Coords["MapsTab"], MapRollCoords, SoundPath,);

  }
  else {
 
    StartCraft(RerollPath,args, Coords[`${CraftMaterial}`],Coords["CurrencyTab"], Counter, SoundPath);
  }
});
})