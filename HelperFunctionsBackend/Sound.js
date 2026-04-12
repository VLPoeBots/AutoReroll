import { exec } from "child_process";

export function PlaySound(Path) {
exec(`powershell -c (New-Object Media.SoundPlayer "${Path}").PlaySync();`);

}