"use strict";
import { GetLSSaves } from "./LocalStorageFn.js";
import {SendInventoryImage, MapEvListener} from "./MapCoords.js"
import {CreateCurrencyIcons} from  "./CreateCurrencyIcons.js"
export function LoadInitialState() {
  let VisibleElements = GetLSSaves("");
  let RemoveElements = [];

  VisibleElements = [...Object.keys(VisibleElements)];
  for (let i = 0; i < VisibleElements.length; i++) {
    VisibleElements[i] = VisibleElements[i].replace("Coords", "");
    if (VisibleElements[i].includes("Essence")) {
      VisibleElements[i] = VisibleElements[i].replace("DeafeningEssenceOf", "");
    }
  }
  let Currency = [...document.getElementsByClassName("Currency")];
  for (let i = 0; i < Currency.length; i++) {
    if (Currency[i].id.includes("Tab")) {
      Currency[i].remove();
      RemoveElements.push(document.getElementById(Currency[i]));
    }
    if (Currency[i]) {
      let CurrentID = Currency[i].id.replace("Group", "");
      if (!CurrentID.includes("Tab")) {
        if (!VisibleElements.includes(CurrentID)) {
          RemoveElements.push(document.getElementById(CurrentID + "Group"));
        }
      }
    }
  }

  let EssenceGroup = [...document.getElementsByClassName("EssenceGroup")];
  for (let i = 0; i < EssenceGroup.length; i++) {
    if (EssenceGroup[i]) {
      let CurrentID = EssenceGroup[i].id;
      CurrentID = CurrentID.replace("Group", "");
      if (!VisibleElements.includes(CurrentID)) {
        RemoveElements.push(document.getElementById(CurrentID+"Group"));
      }
    }
  }

  for (let i = 0; i < RemoveElements.length; i++) {
    if(RemoveElements[i]){
      RemoveElements[i].remove();
    }
  }
    let Deny = Array.from(document.getElementsByClassName("DenyHover"))
    for (let i = 0; i < Deny.length; i++) {
        Deny[i].classList.remove("DenyHover");
    }
  let Hover = [...document.getElementsByClassName("Hover")];
  if (Hover[0]) {
    Hover[0].classList.toggle("Hover");
  }

  let XYLabelList = [...document.getElementsByClassName("XYLabel")];
  for (let i = 0; i < XYLabelList.length; i++) {
    XYLabelList[i].remove();
  }
  ShowHiddenContent();
  let StoreCoordsButton = document.getElementById("StoreCoordsButton");
  StoreCoordsButton.remove();
  let MapIcon = document.getElementById("Maps");
  if(MapIcon){
    
    MapIcon.removeEventListener("click", SendInventoryImage)
  }
}

export function ShowHiddenContent() {
  let HiddenElements = Array.from(
    document.getElementsByClassName("InitiallyHidden")
  );
  for (let i = 0; i < HiddenElements.length; i++) {
    HiddenElements[i].classList.remove("InitiallyHidden");
    HiddenElements[i].style.display = "flex";
  }
}

// MapIcon.removeEventListener("click", SendInventoryImage)
export function DisplayAlchScour() {
  let AlchScourCoords = localStorage.getItem("AlchScourCoords");
  if(AlchScourCoords!==null && AlchScourCoords!==undefined ){
    
    let AlchScourGroup = document.getElementById("AlchScourGroup");
    AlchScourGroup.style.display = "flex";
  }


}
async function ExportLS(){
  let LSValue = new Promise((resolve, reject) => {
    resolve(GetLSSaves())
  })
  window.api.ExportLS(await LSValue)
}
CreateCurrencyIcons().then(() => {
  MapEvListener();
});
ExportLS()
DisplayAlchScour();
if(localStorage.length > 0 ){
  let TabCoords = document.getElementById("TabContainer");
  TabCoords.remove()
}