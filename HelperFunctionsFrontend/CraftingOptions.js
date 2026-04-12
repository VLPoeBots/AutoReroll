
let HideInstructions = document.getElementById("HideInstructions");
let MapOptionsCheckBox = document.getElementById("MapOptionsCheckBox")
let CraftingOptions = document.getElementById("CraftingOptions");
HideInstructions.addEventListener("click", (e) => {
    if(e.target.id === "CraftingOptionsLabel"){
    CraftingOptions.classList.toggle("Hidden");
    }})