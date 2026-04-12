import { spawn } from "child_process";
import { WriteToFile } from "./LogFiles.js";
import { win, LogFilePath,LiftKeysPath, SoundMuted } from "../main.js";
import { PlaySound } from "./Sound.js";
/**
 * 
 * @param {*} ScriptPath 
 * @param {*} CurrencyCoords
 * @param {*} TabCoords
 * @param {*} MyArgs 
 * @param {*} Counter
 * @param {*} SoundPath
 * @param {*} MapRollingCoords
 *    PModArray[0],
 *    NModArray[1],
 *    CraftingMaterial[2],
      MinimumNumberOfMods[3], 
      MaximumRerolls[4], 
      Fracture[5], 
      Delay[6],
 */
export function StartCraft (ScriptPath, MyArgs, CurrencyCoords, TabCoords,  MapRollCoords, SoundPath, Counter) {
  const MyCraft = spawn("python", [
          ScriptPath, //0 Path to script
          MyArgs[0], //1 PModArray
          MyArgs[1], //2 NModArray
          MyArgs[2], //3 CraftingMaterial <-- used for coords in other py files.
          MyArgs[3], //4 MinimumNumberOfMods
          MyArgs[4], //5 MaximumRerolls
          MyArgs[5], //6 Fracture
          MyArgs[6], //7 Delay
          MyArgs[7], //8 WisdomScrollCheckBox
          MyArgs[8], //9 ScourOrbCheckBox
          MyArgs[9], //10 VaalOrbCheckBox
          CurrencyCoords, //11
          TabCoords, //12  
          MapRollCoords,//13
        ]);

    MyCraft.stdout.on("data", (data) => {
        HandleData(data, Counter);
    });
    MyCraft.stderr.on("data", (data) => {
        HandleError(data);
    });
    MyCraft.on("exit", (code, signal) => {
        HandleExit(code, signal , Counter, SoundPath);
    });
}


function HandleData(data, Counter) {
       let PrintThis = String(data);
      console.log(PrintThis);
      if (PrintThis.includes("MyCounter")) {
        Counter += 1;
        win.webContents.send("Counter", "+");
      }
      if (PrintThis.includes("InitialBase")) {
        PrintThis = PrintThis.replace("InitialBase", "");
        PrintThis = "----------\n" + PrintThis + "\n----------";
        WriteToFile(LogFilePath, PrintThis);
      }
      if (PrintThis.includes("Matching Line")) {
        WriteToFile(LogFilePath, `MatchLine: ${PrintThis}`);
      }
      if (PrintThis.includes("RarityError")) {
        win.webContents.send(
          "RarityError",
          "The currency you're trying to use does not match the rarity of your item"
        );
      }
      if (PrintThis.includes("Item Not Found")) {
        console.log("Item not found: ");
        win.webContents.send("ItemError", "Item Not Found");
      }
}

function HandleError(data) {
     console.error("error: ", String(data));
      let FailSafeArray = [
        "failSafeCheck",
        "fail-safe",
        "mouse moving to a corner",
        "FailSafeException",
        "FAILSAFE",
      ];
      let MyError = `Error with crafting: ${String(data)}`;
      WriteToFile(LogFilePath, `MyError: ${MyError}`);

      if (!FailSafeArray.some((element) => MyError.includes(element))) {
        WriteToFile(LogFilePath, `${MyError}`);
        win.webContents.send("ItemError", MyError);
      };}

function HandleExit(code, signal, Counter, SoundPath) {
  LiftKeys(LiftKeysPath)
    if(!SoundMuted){
      if (code === 0 || code === "0") {
        PlaySound(SoundPath);
      }}
    if (code !== null && code !== "0" && code !== 0) {
      console.log(`Crafting script exited with code ${code}`);
      WriteToFile(LogFilePath, `Crafting script exited with code ${code}`);
    } else if (signal !== null) {
      console.log(`Crafting script was killed by signal ${signal}`);
      WriteToFile(
        LogFilePath,
        `Crafting script was killed by signal ${signal}`
      );
    }
      WriteToFile(LogFilePath, `Counter: ${Counter}`);
      WriteToFile(LogFilePath, "~~~~~~~~~~~~Crafting Project End~~~~~~~~~~~~}");
    }

export function LiftKeys(Path) { 
  const LiftKeys = spawn("python", [Path]);
      LiftKeys.stderr.on("data", (data) => {
        console.error("Error with liftkeys: ", String(data));
        WriteToFile(LogFilePath, `${String(data)}`);
      });
}