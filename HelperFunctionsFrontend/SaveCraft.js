import {
  CreateElementFn,
  GetCurrentItem,
  DisplayInsertionMsg,
  BlurBG,
  RemoveBlur,
  CenterItem,
  CloseSaveWindow,
  DeleteSavedItem,
  RemoveElementByClass,
} from "./HelperFn.js";
import {
  ChangeLSSaves,
  DeleteLSSaveItem,
  GetLSSaves,
  GetSavedItem,
  CreateLocalStorageSave,
} from "./LocalStorageFn.js";
import { DisplayItemMods } from "./DisplayItemMods.js";
let SaveGallery = document.getElementById("Gallery");
let GalleryImageArray = document.getElementsByClassName("GalleryImage");

//#region Save item
SaveCraftButton.addEventListener("click", function () {
  let SavedSelectedIcon = document.getElementsByClassName("SavedSelectedIcon");

  // Adds / removes mods from existing saves
  let Mods = GetCurrentItem();
  if(Mods!== null){
    
  
  if (SavedSelectedIcon.length > 0) {
    let IconName = SavedSelectedIcon[0].src.split("/").pop();
    let SelectedName = SavedSelectedIcon[0].id;
    if (Mods !== null) {
      let SaveString = `SaveIconName${IconName}PositiveMods${JSON.stringify(
        Mods[0]
      )}NegativeMods${JSON.stringify(Mods[1])}`;
      ChangeLSSaves(SelectedName, SaveString);
      DisplayInsertionMsg(
        "Successfully saved changes to the selected existing item",
        "green"
      );
    } 
  } else {
    
    const SaveCraftContainer = document.getElementById("SaveCraftContainer");
    if (!SaveCraftContainer) {
      let SaveCraftContainer = CreateElementFn(
        "div",
        "SaveCraftContainer",
        ["SaveCraft", "SelectNone"],
        "Select an icon",
        document.body
      );
      BlurBG();
      CenterItem(SaveCraftContainer);
      window.api.LoadSaveIconPics("InitialRequest");
      SaveGallery.style.display = "grid";
      SaveCraftContainer.appendChild(SaveGallery);

      SaveGallery.addEventListener("mousedown", (e) => {
        if (e.target.classList.contains("Image")) {
          e.target.style.transform = "scale(0.6)";
          e.target.style.opacity = "1";
          e.target.classList.add("SelectedIcon");
          for (let i = 0; i < GalleryImageArray.length; i++) {
            if (e.target !== GalleryImageArray[i]) {
              GalleryImageArray[i].style.opacity = "0.35";
              GalleryImageArray[i].classList.remove("SelectedIcon");
            }
          }
        }
      });
      SaveGallery.addEventListener("mouseup", (e) => {
        if (e.target.classList.contains("Image")) {
          e.target.style.transform = "scale(1)";
        }
      });
      SaveGallery.addEventListener("mouseout", (e) => {
        if (e.target.classList.contains("Image")) {
          e.target.style.transform = "scale(1)";
        }
      });
      let NameSaveSelector = CreateElementFn(
        "input",
        "NameSaveSelectorInput",
        ["SaveCraft", "Input"],
        "",
        SaveCraftContainer
      );
      NameSaveSelector.placeholder = "Select a name";

      NameSaveSelector.addEventListener("keydown", async (e) => {
        if (e.key === "Enter") {
          let SaveName = NameSaveSelector.value;
          let SaveIcon = document.getElementsByClassName("SelectedIcon")[0];
          let NameTaken = false; // used to check if the name is already taken
          if (e.key === "Enter" && SaveIcon != null) {
            if (SaveName !== "") {
              let LSSave = GetLSSaves("Save");
              if (Object.keys(LSSave).length > 0) {
                // If object exists, extract its name from the LS save and compare it and assign a value to NameTaken.
                for (const key of Object.keys(LSSave)) {
                  if (SaveName === key) {
                    NameTaken = true; // Break out of the loop without setting NameTaken to true
                    break;
                  }
                }
              }
              //
              //
              //
              //
              if (!NameTaken) {
                RemoveBlur();
                CloseSaveWindow();

                let SaveIconName = SaveIcon.src.split("/").pop();
                // && GetMods[1].length > 0
                let GetMods = GetCurrentItem();
                if (GetMods[0].length > 0) {
                  RemoveBlur();
                  CloseSaveWindow();
                  let SaveString = `SaveIconName${SaveIconName}PositiveMods${JSON.stringify(
                    GetMods[0]
                  )}NegativeMods${JSON.stringify(GetMods[1])}`;
                  let SavedItem = await CreateLocalStorageSave(
                    SaveName,
                    SaveString
                  );
                  let NewSave = CreateElementFn(
                    "img",
                    SaveName,
                    ["Saved", "Image"],
                    "",
                    MyProjects
                  );
                  NewSave.src = `${SaveIcon.src}`;
                  MyProjects.appendChild(NewSave);
                  SaveCraftContainer.remove();
                } else {
                  RemoveBlur();
                  CloseSaveWindow();

                  DisplayInsertionMsg(
                    "Please select mods for the craft you want  to save",
                    "red"
                  );
                }
              } else {
                RemoveBlur();
                CloseSaveWindow();

                DisplayInsertionMsg(
                  "Name already taken, please select another one",
                  "red"
                );
              }
            } else if (e.key === "Enter" && SaveName === "") {
              RemoveBlur();
              CloseSaveWindow();

              DisplayInsertionMsg("Please select a name for the save", "red");
            }
          } else if (e.key === "Enter" && SaveIcon === undefined) {
            CloseSaveWindow();

            RemoveBlur();
            DisplayInsertionMsg("Please select an icon for the save", "red");
          }
        }
      });
    }
  }
}else {
      DisplayInsertionMsg("Please select at least one mod", "red");
    }});
//#endregion




//#region Display Icons
window.api.SaveIconsData((event, data) => {
  let IconFolderPath = data[0];
  let IconNameArray = data[1];

  for (let i = 0; i < IconNameArray.length; i++) {
    let NewElement = document.getElementById(IconNameArray[i]);
    if (!NewElement) {
      let NewImg = CreateElementFn(
        "img",
        `${IconNameArray[i]}`,
        ["Image", "GalleryImage"],
        "",
        SaveGallery
      );
      let NewImgSrc = IconFolderPath + "\\" + IconNameArray[i];
      NewImg.src = NewImgSrc;
    }
  }
});
//#endregion
