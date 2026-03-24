import { spawn } from "child_process";
import { WriteToFile } from "./LogFiles.js";
import { win, LogFilePath } from "../main.js";
// console.log("Write file path: ", LogFilePath);  
/**
 * 
 * @param {*} ScriptPath 
 * @param {*} MyArgs 
 * @param {*} Counter
 *    HarvestRerollPath[0], 
      ModName[1], 
      MaxRolls[2], 
      CurrencyCoords[3],
      TabCoords[4], 
      CraftMaterial[5], 
      Fracture[6], 
      ExclusionMods[7],
      SleepTimer[8], 
      ModNumber[9], 
 */
export function StartCraft (ScriptPath, MyArgs, Counter) {

    const MyCraft = spawn("python", [
          ScriptPath,
          MyArgs[0], 
          MyArgs[1], 
          MyArgs[2], 
          MyArgs[3], 
          MyArgs[4], 
          MyArgs[5], 
          MyArgs[6], 
          MyArgs[7], 
          MyArgs[8], 
        ]);

    MyCraft.stdout.on("data", (data) => {
        HandleData(data, Counter);
    });
    MyCraft.stderr.on("data", (data) => {
        HandleError(data);
    });
    MyCraft.on("exit", (code, signal) => {
        HandleExit(code, signal , Counter);
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

function HandleExit(code, signal, Counter) {

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