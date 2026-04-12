import pyautogui
import time
import pyperclip
import sys
import traceback
import re 

Rarity = None
Check = None

pyperclip.copy("")

try:
    PModArray = sys.argv[1].split(",")
    NModArray = sys.argv[2].split(",")
    NModArray = [item for item in NModArray if item]
    NModArray = [item for item in NModArray if item.strip()]
    CraftMaterial = sys.argv[3]
    InitialModNumber = int(sys.argv[4])
    if (sys.argv[5]==""):   
        MaxRolls = 9999
    else:
        MaxRolls = int(sys.argv[5])
    Fracture = sys.argv[6]
    SleepTimer = float(sys.argv[7])
    CurrencyCoords = sys.argv[11].split("/")
    print(CurrencyCoords, flush=True)
    TabCoords = sys.argv[12].split(",")

    print("InitialCoords: ", sys.argv[3])
    AlchCoords = CurrencyCoords[0].split(",")
    AlchCoords = [int(AlchCoords[0]), int(AlchCoords[1])]
    print("AlchCoords: ", AlchCoords)
    ScourCoords = CurrencyCoords[1].split(",")  
    ScourCoords = [int(ScourCoords[0]), int(ScourCoords[1])]
    print("ScourCoords: ", ScourCoords)
    ModNums = [int(num) for s in PModArray for num in re.findall(r'\d+', s)]
    ModName = [re.sub(r'\d+', '', s) for s in PModArray]
    if Fracture == "false":
        Fracture = False
    TabCoords = (int(TabCoords[0]),int(TabCoords[1]))
    if len(ModNums)>0:
        ModObject = dict(zip(ModName, ModNums))


    Counter = 0

    def Reroll():
        global Counter, Check, Check_lines, ModNumber
        stop = False
        while stop == False:
            pyautogui.moveTo(ScourCoords)
            pyautogui.rightClick()  
            pyautogui.moveTo(TabCoords)
            pyautogui.click()   
            time.sleep(SleepTimer)
            ModNumber = InitialModNumber
            pyautogui.moveTo(AlchCoords)
            pyautogui.rightClick()
            pyautogui.moveTo(TabCoords)
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
            
                        if len(NModArray)>0:
                            Exclusion = False
                            for ExclMod in NModArray:
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
        

    pyautogui.moveTo(TabCoords)

    
    pyautogui.keyDown("ctrl")
    pyautogui.press("c")
    pyautogui.keyUp("ctrl") 
    print("InitialBase", pyperclip.paste(),flush=True)
    Check = pyperclip.paste().lower()
    
    lines = Check.splitlines()
    for line in lines:
        if "rarity" in line:
            Rarity = line.replace("rarity:", "").strip().lower()
            print("Rarity: ", Rarity)
            break

    
    pyperclip.copy("") 
    if Rarity == "normal":
        Reroll()
    else: 
        print("RarityError")





except Exception as e:
    traceback.print_exc()
    print(f"Python Error: {str(e)}", file=sys.stderr)
    sys.exit(1)


