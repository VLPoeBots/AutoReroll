import pyautogui
import time
import pyperclip
import re
import sys
Counter = 0




PMods = sys.argv[1].split(".")
NMods = sys.argv[2].split(",")
NMods = [item for item in NMods if item]
NMods = [item for item in NMods if item.strip()]
CraftMaterial = sys.argv[3].split("/")
InitialModNumber = int(sys.argv[4])
if (sys.argv[5]==""):   
    MaxRolls = 9999 
else:
    MaxRolls = int(sys.argv[5])

Fracture = sys.argv[6]
SleepTimer = float(sys.argv[7])
Wisdom = sys.argv[8]
Scour = sys.argv[9]
Vaal = sys.argv[10]
print(Wisdom,Scour,Vaal, flush=True)
# CurrencyCoords = sys.argv[11].split(",")
# CurrencyCoords = (int(CurrencyCoords[0]), int(CurrencyCoords[1]))
# TabCoords = sys.argv[12].split(",")
CoordsArray = sys.argv[13].split(",")
InventorySizeX = int(CoordsArray[0])
InventorySizeY = int(CoordsArray[1])   
WisdomScrollCoords = [int(CoordsArray[2]),int(CoordsArray[3])]
AlchOrbCoords = [int(CoordsArray[4]),int(CoordsArray[5])]
ChaosOrbCoords = [int(CoordsArray[6]),int(CoordsArray[7])]
VaalCoords = [int(CoordsArray[8]),int(CoordsArray[9])]
ScourOrbCoords = [int(CoordsArray[10]),int(CoordsArray[11])]
MapsUpperLeft = [int(CoordsArray[12]),int(CoordsArray[13])]

CellSizeX = round(InventorySizeX/12)
CellSizeY = round(InventorySizeY/5)
Col = 12
Row = 5

ModNums = [int(num) for s in PMods for num in re.findall(r'\d+', s)]
ModName = [re.sub(r'\d+', '', s) for s in PMods]
if Fracture == "false":
    Fracture = False
if len(ModNums)>0:
    ModObject = dict(zip(ModName, ModNums))
StartX = MapsUpperLeft[0] + (CellSizeX / 2)
StartY = MapsUpperLeft[1] + (CellSizeY/2)
pyautogui.moveTo(StartX,StartY)

def GrabItem(ItemCoords):
    pyautogui.moveTo(ItemCoords)
    pyautogui.rightClick(ItemCoords)

def Reroll():
        global Counter, Check, Check_lines, ModNumber
        stop = False
        while stop == False:
            time.sleep(SleepTimer)
            ModNumber = InitialModNumber
            pyautogui.keyDown("shift")

            pyautogui.click()
            pyperclip.copy("")
            pyautogui.keyDown("ctrl")
            pyautogui.press("c")
            pyautogui.keyUp("ctrl") 
            Check = pyperclip.paste().lower()
            Check_lines = Check.split('\n')

            if Check == "":
                print("Item Not Found")
                break
            Counter = Counter+1
            for line in Check_lines:
                if Fracture:
                    if "fractured" in line:
                        continue

                for name in ModName:
                    if name.strip().lower() in line:
            
                        if len(NMods)>0:
                            Exclusion = False
                            for ExclMod in NMods:
                                if ExclMod in line:
                                    print("Found exclusion mod: ", line, flush=True)
                                    Exclusion = True
                                    break
                                else:
                                    ModNumber -= 1
                            if Exclusion:
                                print("Found mod, but exclusion triggered.")
                                continue
            
                        
                        if len(ModNums)>0:
                            NumberInLine = re.findall(r'\d+', line)  #[1,70]
                            NumberInLine = int(NumberInLine[-1])  #70
                            if NumberInLine is not None:
                                if name in ModObject and NumberInLine >= ModObject[name]:
                                    ModNumber -= 1                                    
                                    if ModNumber < 1:                                         
                                        stop = True
                                        break
                                    else: 
                                        continue
                        else: 
                            stop = True
                            break
                            
            
               
            if stop: 
                break             
            if Counter>=MaxRolls:
                print("Maximum number of rerolls reached", flush=True)
                break
    
def WalkMaps(ItemCoords, ItemName):
    GrabItem(ItemCoords)
    pyautogui.keyDown("shift")
    for Col in range(12):
        FoundEmpty = False  # Flag to track if an empty clipboard is found
        for Row in range(5):
            time.sleep(SleepTimer)
            pyperclip.copy("")
            if Col == 0 and Row == 0:
                continue
            
            X = StartX + Col * CellSizeX
            Y = StartY + Row * CellSizeX
            pyautogui.moveTo(X,Y)
            pyautogui.hotkey("ctrl", "c")
            MyText = pyperclip.paste().lower().strip()
          
            
            if MyText == "":
                FoundEmpty = True  
                break  
            if("maps" not in MyText):
                print("Map not found")
                continue
            if ItemName == "WisdomScroll":
                if "unidentified" in MyText:
                    pyautogui.click(X,Y)
            
            if ItemName == "Scour":
                if "corrupted" not in MyText:
                    Rarity = re.search(r'(?i)rarity:.*', MyText).group()
                    if "normal" not in Rarity:
                        pyautogui.click(X,Y)
            
            if ItemName == "Vaal":
                pyautogui.click(X,Y)           

            
            if ItemName =="Alch":
                if "normal" in MyText:
                    pyautogui.click(X,Y)
            if ItemName == "Chaos":
                Reroll()



        if FoundEmpty:  # Check flag to break out of outer loop if clipboard is empty
            break
    pyautogui.keyUp("shift")
if(isinstance(WisdomScrollCoords[0], (int))):
    if Wisdom == "true":
        WalkMaps(WisdomScrollCoords,"WisdomScroll")
time.sleep(0.2)
if(isinstance(ScourOrbCoords[0],(int))):
    if Scour == "true":
        WalkMaps(ScourOrbCoords, "Scour")
time.sleep(0.2)
if(isinstance(AlchOrbCoords[0], (int))):
    WalkMaps(AlchOrbCoords, "Alch")
time.sleep(0.2)
if(isinstance(ChaosOrbCoords[0], (int))):
    WalkMaps(ChaosOrbCoords,"Chaos")
time.sleep(0.2)
if(isinstance(VaalCoords[0], (int))):
    if Vaal == "true":
        WalkMaps(VaalCoords, "Vaal")





