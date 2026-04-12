
let BoxArray = Array.from(document.getElementsByClassName("CheckBox"))
import{GetLSSaves} from "./LocalStorageFn.js"
let LS = GetLSSaves()
try{

    for(let i = 0;i<BoxArray.length;i++){
        BoxArray[i].addEventListener("change", function(){
            if(BoxArray[i].checked){
                localStorage.setItem(`${BoxArray[i].id}`,"Checked")
            }else {
                localStorage.setItem(`${BoxArray[i].id}`, "");
            }
        })
    }
    
    

        
  
    for (let [Key,Value] of Object.entries(LS)) {
        if(!Key.includes("CheckBox")){
            delete LS[Key]
        }
          if(Key.includes("CheckBox")&& Value === "Checked"){
            document.getElementById(`${Key}`).checked = true
        }else if(Key.includes("CheckBox"&&Value!=="Checked")){
            document.getElementById(`${Key}`).checked = false
        }
  
    }

}catch(error){
    console.error(error)
}

    