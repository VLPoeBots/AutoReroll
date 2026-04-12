import pyautogui
import time
import pyperclip
import sys
import traceback
import re 
Rarity = None
Check = None
for i, arg in enumerate(sys.argv):
    print(f"{i}: {arg}")
pyperclip.copy("")
Orbs = {
    "OrbOfAlteration": "magic",
    "ChaosOrb": "rare",
    "essence" : "rare"
}
def CheckRarity(Mats, Rarity):

    if Rarity == Orbs[Mats]:
        return True
    else:
        return False


try:
    PMods = sys.argv[1].split(",")
    NMods = sys.argv[2].split(",")
    NMods = [item for item in NMods if item]
    NMods = [item for item in NMods if item.strip()]
    CraftMaterial = sys.argv[3]
    InitialModNumber = int(sys.argv[4])
    if (sys.argv[5]==""):   
        MaxRolls = 9999
    else:
        MaxRolls = int(sys.argv[5])
    Fracture = sys.argv[6]
    SleepTimer = float(sys.argv[7])
    CurrencyCoords = sys.argv[11].split(",")
    TabCoords = sys.argv[12].split(",")


        
    ModNums = [int(num) for s in PMods for num in re.findall(r'\d+', s)]
    ModName = [re.sub(r'\d+', '', s) for s in PMods]
    if Fracture == "false":
        Fracture = False
    CurrencyCoords = (int(CurrencyCoords[0]), int(CurrencyCoords[1]))
    TabCoords = (int(TabCoords[0]),int(TabCoords[1]))
    if len(ModNums)>0:
        ModObject = dict(zip(ModName, ModNums))
        # print("ModObject: ", ModObject)


    Counter = 0

    def Reroll():
        print("DEBUG NMods at start:", NMods)
        global Counter, Check, Check_lines, ModNumber
        stop = False
        while stop == False:
            time.sleep(SleepTimer)
            ModNumber = InitialModNumber
            # print("ModNumber: ", ModNumber)
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
            print("MyCounter",flush=True)
            for line in Check_lines:
                if Fracture:
                    if "fractured" in line:
                        continue

                for name in ModName:
                    if name.strip().lower() in line:
                        print(NMods)
                        print(len(NMods))

                        if len(NMods)>0:
                            Exclusion = False
                            for ExclMod in NMods:
                                if ExclMod in line:
                                    print("Found exclusion mod: ", line, flush=True)
                                    Exclusion = True
                                    break
                                else:
                                    ModNumber -= 1
                                    # print("Reducing Mod Number: ", ModNumber)
                            if Exclusion:
                                print("Found mod, but exclusion triggered.")
                                continue
            
                        
                        if len(ModNums)>0:
                            NumberInLine = re.findall(r'\d+', line)  #[1,70]
                            NumberInLine = int(NumberInLine[-1])  #70
                            if NumberInLine is not None:
                                # print("ModNumber: ", ModNumber, flush= True)
                                if name in ModObject and NumberInLine >= ModObject[name]:
                                    ModNumber -= 1
                                    # print("Reducing ModNumber2: ", ModNumber, flush= True)
                                    
                                    if ModNumber < 1:
                                         
                                        # print("Stopped because of this!",flush= True)
                                        stop = True
                                        break
                                    else: 
                                        # print(name in ModObject)
                                        continue
                        else: 
                            stop = True
                            break
                            
            
               
            if stop: 
                break             
            if Counter>=MaxRolls:
                print("Maximum number of rerolls reached", flush=True)
                break


    pyautogui.moveTo(CurrencyCoords)
    pyautogui.rightClick(CurrencyCoords)
    pyautogui.moveTo(TabCoords)
    
    pyautogui.keyDown("ctrl")
    pyautogui.press("c")
    pyautogui.keyUp("ctrl") 
    print("InitialBase", pyperclip.paste(), flush=True)

    Check = pyperclip.paste().lower()
    # print("CurrentBase: "+Check)
    lines = Check.splitlines()
    for line in lines:
        if "rarity" in line:
            Rarity = line.replace("rarity:", "").strip().lower()
            break

    
    pyperclip.copy("")
    if "essence" in CraftMaterial.lower():
        CraftMaterial = "essence"
    if CheckRarity(CraftMaterial,Rarity):
        Reroll()
    else: 
        print("RarityError")
    pyautogui.keyUp("shift")





except Exception as e:
    traceback.print_exc()
    print(f"Python Error: {str(e)}", file=sys.stderr)
    sys.exit(1)


