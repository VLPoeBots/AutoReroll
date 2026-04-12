import { RemoveElementByClass, DisplayInsertionMsg } from "./HelperFn.js";

/**
 * 
 * @param {Array} CraftMaterial 
 */
export function StartCrafting(CraftMaterial) {
  let InfoArray = []; //Array to send data to backend
  let LagInputNumber;
  if (LagCheckBox.checked) {
    LagInputNumber = Number(LagInput.value);
  } else {
    LagInputNumber = 0;
  }

  const ExclusionModClass = document.getElementsByClassName("ExclusionMod");
  const ModClass = document.getElementsByClassName("ModName");
  let ModNumber = document.getElementById("ModNumber"); // Minimum number of mods to look for
  let Hover = document.getElementsByClassName("Hover");
  if (localStorage.length < 1) {
    RemoveElementByClass("HoverTooltip");
    DisplayInsertionMsg("Select coords first!", "red");
  } else if (Hover.length > 0) {
    InfoArray.length = 0;
    if (ModClass.length > 0) {
      
      let Fracture = document.getElementById("FractureCheckBox").checked;
      let ScourCheckBox = document.getElementById("ScourCheckBox").checked;
      let WisdomScrollCheckBox = document.getElementById("WisdomScrollCheckBox").checked;
      let VaalCheckBox = document.getElementById("VaalCheckBox").checked;
      let PModArray = [];
      let NModArray = [];
      if (ExclusionModClass.length > 0) {
        for (let i = 0; i < ExclusionModClass.length; i++) {
          NModArray.push(
            ExclusionModClass[i].textContent.toLocaleLowerCase().trim()
          );
        }
      }
      for (let i = 0; i < ModClass.length; i++) {
        let MyMod = ModClass[i].textContent.toLocaleLowerCase().trim();
        let HasNumber = /\d/.test(MyMod);
        if (!HasNumber) {
          MyMod = MyMod + "0";
        }
        PModArray.push(MyMod);
      }
 
       
    

      InfoArray.push(PModArray); //0
      InfoArray.push(NModArray); //1
      InfoArray.push(CraftMaterial); //2
      InfoArray.push(Number(ModNumber.value)); //3 - Minimum number of mods to look for
      InfoArray.push(MaxRerolls.value); //4
      InfoArray.push(Fracture); //5
      InfoArray.push(Number(LagInputNumber)); //6
      InfoArray.push(WisdomScrollCheckBox)//7
      InfoArray.push(ScourCheckBox)//8
      InfoArray.push(VaalCheckBox)//9
      console.log("InfoArray: ", InfoArray); 
      window.api.StartCrafting(InfoArray);
    } else {
      RemoveElementByClass("HoverTooltip");

      DisplayInsertionMsg("No mods selected", "red");
    }
  } else {
    RemoveElementByClass("HoverTooltip");

    DisplayInsertionMsg(
      "Select currency to roll with by clicking (Chaos, alt or essence)",
      "red"
    );
  }
}
