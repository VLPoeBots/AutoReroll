window.api.ToggleMute((event, data) => {
console.log("ToggleMute event received in preload.js with data:", data);
    localStorage.setItem("SoundMuted", data);

})