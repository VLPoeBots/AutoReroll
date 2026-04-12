import { CreateElementFn } from "../HelperFunctionsFrontend/HelperFn.js";

// Add divines
let ManualParent = document.getElementById("ManualContainer");
let AutoParent = document.getElementById("AutoContainer");
let EssenceParentLeft = document.getElementById("LeftEssence");  
let EssenceParentRight = document.getElementById("RightEssence");
let TabParent = document.getElementById("TabContainer");

let ManualItemList = ["RegalOrb", "AnnulOrb", "ScourOrb", "TransmuteOrb", "AlchOrb", "AugOrb",
   "VaalOrb","WisdomScroll"]; 

let AutoItemList = ["AlchScour", "Harvest", "ChaosOrb", "OrbOfAlteration","Maps"]

let EssenceListRight = ["EssenceOfAnguish", "EssenceOfDread","EssenceOfEnvy","EssenceOfLoathing",
  "EssenceOfMisery","EssenceOfScorn","EssenceOfSpite","EssenceOfZeal"]
  
let EssenceListLeft = ["EssenceOfGreed","EssenceOfContempt", "EssenceOfHatred","EssenceOfWoe",
  "EssenceOfFear","EssenceOfAnger","EssenceOfTorment","EssenceOfSorrow","EssenceOfRage","EssenceOfSuffering",
"EssenceOfWrath", "EssenceOfDoubt"]

let ItemTabs = ["CurrencyTab", "EssenceTab", "HarvestTab","MapsTab"];

export async function CreateCurrencyIcons() {

  for (let i = 0; i<ManualItemList.length; i++) {
    if(document.getElementById(`${ManualItemList[i]}Group`)){
    continue;
  }
let Group = CreateElementFn("div", `${ManualItemList[i]}Group`, ["Currency"], "", ManualParent)
let Icon = CreateElementFn("img", `${ManualItemList[i]}`, ["Image","Currency", "Manual"], "", Group);  
Icon.src = `../renderer/CurrencyPics/${ManualItemList[i]}.png`
let XYLabel = CreateElementFn("label", `${ManualItemList[i]}Label`, ["XYLabel", "AddBorder"], "X:, Y:", Group);
}

for (let i = 0; i<AutoItemList.length; i++) {
  if(document.getElementById(`${AutoItemList[i]}Group`)){
    continue;
  }
  let Group = CreateElementFn("div", `${AutoItemList[i]}Group`, ["Image", "Currency"], "", AutoParent)
  let Icon = CreateElementFn("img", `${AutoItemList[i]}`, ["Image","Currency", "Auto"], "", Group);    
  Icon.src = `../renderer/CurrencyPics/${AutoItemList[i]}.png`
  let XYLabel = CreateElementFn("label", `${AutoItemList[i]}Label`, ["XYLabel", "AddBorder"], "X:, Y:", Group);
  if(AutoItemList[i] == "Maps"){
Group.classList.add("DenyHover");
Icon.classList.add("DenyHover");
XYLabel.classList.add("DenyHover");
}
  }

for (let i = 0; i<EssenceListLeft.length; i++) {
  if(document.getElementById(`${EssenceListLeft[i]}Group`)){
    continue;
  } 
  let Group = CreateElementFn("div", `${EssenceListLeft[i]}Group`, ["Image", "Currency", "EssenceGroup"], "", EssenceParentLeft)
  let Icon = CreateElementFn("img", `${EssenceListLeft[i]}`, ["Image","Currency", "Essence"], "", Group);    
  Icon.src = `../renderer/EssencePics/${EssenceListLeft[i]}.png`
  let XYLabel = CreateElementFn("label", `${EssenceListLeft[i]}Label`, ["XYLabel", "AddBorder"], "X:, Y:", Group);
}

for (let i = 0; i<EssenceListRight.length; i++) { 
  if(document.getElementById(`${EssenceListRight[i]}Group`)){
    continue;
  }
  let Group = CreateElementFn("div", `${EssenceListRight[i]}Group`, ["Image", "Currency", "EssenceGroup"], "", EssenceParentRight)
  let Icon = CreateElementFn("img", `${EssenceListRight[i]}`, ["Image","Currency", "Essence"], "", Group);    
  Icon.src = `../renderer/EssencePics/${EssenceListRight[i]}.png`
  let XYLabel = CreateElementFn("label", `${EssenceListRight[i]}Label`, ["XYLabel", "AddBorder"], "X:, Y:", Group); 
}

for (let i = 0; i<ItemTabs.length; i++) {
  let Group = CreateElementFn("div", `${ItemTabs[i]}`, ["Currency", "Break"], `${ItemTabs[i]}\r\nItem spot`,TabParent);
  let XYLabel = CreateElementFn("label", `${ItemTabs[i]}Label`, ["XYLabel"], "X:, Y:", Group);
} 

  }