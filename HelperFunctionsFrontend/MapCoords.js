export async function MapEvListener() {

    if(localStorage.length<1){
        
    let MapIcon = document.getElementById("Maps");
    if(MapIcon){
    MapIcon.addEventListener("click", SendInventoryImage)
    
    window.api.MapCoords((event, data) => {
        let XYLabel = document.getElementById("MapsLabel");
        XYLabel.textContent = `X:${data[0]}, Y:${data[1]}`;
        XYLabel.style.color = "aliceblue";
        XYLabel.style.opacity = "1";
    })  
}
}else{
    let Deny = Array.from(document.getElementsByClassName("DenyHover"))
    for (let i = 0; i < Deny.length; i++) {
        Deny[i].classList.remove("DenyHover");
    }
}
}

export function SendInventoryImage(){    
    window.api.InventoryImage("awd")
}
