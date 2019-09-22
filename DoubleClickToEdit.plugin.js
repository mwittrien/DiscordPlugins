//META{"name":"DoubleClickToEdit","displayName":"DoubleClickToEdit","website":"https://github.com/Farcrada/Double-click-to-edit","source":"https://github.com/Farcrada/Double-click-to-edit/blob/master/DoubleClickToEdit.plugin.js"}*//

class DoubleClickToEdit {
    getName() { return "Double click to edit"; }
    getDescription() { return "Double click messages to edit them."; }
    getVersion() { return "0.7.8"; }
    getAuthor() { return "Farcrada, original by Jiiks"; }

    start() {
        let libraryScript = document.getElementById("ZLibraryScript");
        if (!libraryScript || !window.ZLibrary) {
            if (libraryScript) libraryScript.parentElement.removeChild(libraryScript);
            libraryScript = document.createElement("script");
            libraryScript.setAttribute("type", "text/javascript");
            libraryScript.setAttribute("src", "https://rauenzi.github.io/BDPluginLibrary/release/ZLibrary.js");
            libraryScript.setAttribute("id", "ZLibraryScript");
            document.head.appendChild(libraryScript);
        }

        if (window.ZLibrary) this.initialize();

        try {
            document.addEventListener('dblclick', this.handler);
        }
        catch(err) {
            console.error(this.getName(), "fatal error, plugin could not be started!", err);
            
            try {
                this.stop();
            }
            catch(err) {
                console.error(this.getName() + ".stop()", err);
            }
        }
    }

    initialize() {
        ZLibrary.PluginUpdater.checkForUpdate(this.getName(), this.getVersion(), "https://raw.githubusercontent.com/Farcrada/Double-click-to-edit/master/DoubleClickToEdit.plugin.js");
    }

    stop() {
        document.removeEventListener('dblclick', this.handler);
    }
    
    handler(e) {
        var editIndex = 1
        
        if(BdApi.getPlugin("GoogleTranslateOption") || 
           BdApi.getPlugin("PersonalPins"))
            if(BdApi.getPlugin("GoogleTranslateOption").started || 
               BdApi.getPlugin("PersonalPins").started)
                editIndex = 2;

        const message = e.target.closest('[class^=contentCozy]') || e.target.closest('[class^=messageCompact]');
        if (!message)
            return;
        
        const btn = message.querySelector('[class^=buttonContainer] [class^=button-]');
        if (!btn)
            return;
        
        btn.click();

        const popup = document.querySelector('[class^=container][role=menu]');
        if (!popup)
            return;

        const rii = popup[Object.keys(popup).find(k => k.startsWith('__reactInternal'))];
        if (!rii || !rii.memoizedProps || !rii.memoizedProps.children
            || !rii.memoizedProps.children.props || !rii.memoizedProps.children.props.children[editIndex]
            || !rii.memoizedProps.children.props.children[editIndex].props
            || !rii.memoizedProps.children.props.children[editIndex].props.action)
        {
            btn.click();
            return;
        }
        rii.memoizedProps.children.props.children[editIndex].props.action();
        return;
    }
}
