export abstract class UIManager extends cc.Component {
    /** 存放UI的字典 */
    public static UIDic: Map<string, any> = new Map();
    /**
     * 打开一个UI页面
     * @param panelName UIConfig配置里面的名字
     * @param param 打开UI时传递的参数
     * @param isRemoveOther 是否删除所有的UI
     * @returns 
     */
    public static OpenUI(panelName: string, isRemoveOther: boolean = false, ...param: any): void {
        let config;
        if (UIConfig[panelName]) {
            config = UIConfig[panelName];
        }
        if (config == null) {
            console.error("未找到该UI的配置信息:" + panelName);
            return null;
        }
        if (!this.UIDic.has(panelName)) {
            if (isRemoveOther == true) {
                this.removeAllUI();
            }
            // this.CreateUI(config, ...param);
        } else {
            console.warn("已经打开过UI:" + panelName);
        }
    };
    /**
     * 关闭一个UI页面
     * @param panelName UIConfig配置里面的名字
     * @param param 关闭UI时传递的参数
     */
    public static CloseUI(panelName: string, ...param: any): void {
        let panel;
        panel = this.UIDic.get(panelName);

        if (panel) {
            this.UIDic.delete(panelName);
            if (panel.name == "") { return; }
            let component = panel.getComponent(panel.config.com);
            if (component && component.closeUI) {
                component.closeUI(...param);
            }
        } else {
            console.warn("已经关闭过UI:" + panelName);
        }
    };
    /**
     * 获取UI的Node
     * @param {*} panelName UI配置里面的名字
     */
    public static GetUI(panelName: string) {
        let panel = this.UIDic.get(panelName);
        if (panel != null) {
            return panel;
        } else {
            console.log("没有打开UI:" + panelName);
            return null;
        }
    };
    /**
     * 获取UI上的脚本
     * @param {*} panelName  UI的名字 
     */
    public static GetUIForComponent(panelName: string) {
        let panel = this.UIDic.get(panelName);
        if (panel != null) {
            return panel.getComponent(panel.config.com);
        } else {
            console.warn("没有打开UI:" + panelName);
            return null;
        }
    };
    /**
     * 创建一个UI
     * @param config UI配置config
     * @param param 传递参数
     * @returns 
     */
    // public static CreateUI(config: any, ...param: any): void {
    //     if (this.UIDic.get(config.name) != null) { return; }
    //     let parent = cc.director.getScene().getChildByName("Canvas");

    //     Tools.newPrefab(config.resUrl, parent, null, config.zIndex, (node: any) => {
    //         node.config = config;
    //         let component = node.getComponent(config.com);
    //         if (component && component.openUI) {
    //             component.openUI(...param);
    //             component.uiName = config.name;
    //         }
    //         // this.UIDic[config.name] = node;
    //         this.UIDic.set(config.name, node);
    //     });
    // };
    /**
     * 移除所有存放在字典里的UI
     */
    public static removeAllUI(): void {
        this.UIDic.forEach((value: any, key: any) => {
            // console.log("key:", key)
            this.CloseUI(key.toString());
        });
        // console.log("this.UIDic:", this.UIDic)
    };
    /** 从字典中移除所有UI */
    public static removeUIDic() {
        this.UIDic.clear();
    };

    public abstract openUI(...data: any);
    public abstract closeUI(...data: any);
    public abstract uiName: string;
    protected onDestroy(): void {
        UIManager.UIDic.delete(this.uiName);
    }
}
/**  name UI的名字  resUrl预制体加载路径或者名字 com绑定脚本的名字 */
var UIConfig = <any>{
    OverUI: { name: "OverUI", resUrl: "OverUI", com: "OverUI", zIndex: 99 },
    ReviveUI: { name: "ReviveUI", resUrl: "ReviveUI", com: "ReviveUI", zIndex: 99 },
    MatchingUI: { name: "MatchingUI", resUrl: "MatchingUI", com: "MatchingUI", zIndex: 99 },
    SkinUI: { name: "SkinUI", resUrl: "SkinUI", com: "SkinUI", zIndex: 99 },
    PackUI: { name: "PackUI", resUrl: "PackUI", com: "PackUI", zIndex: 99 },
    LuckUI: { name: "LuckUI", resUrl: "LuckUI", com: "LuckUI", zIndex: 99 },
    StartUseUI: { name: "StartUseUI", resUrl: "startUseUI", com: "StartUseUI", zIndex: 99 },


    PersonUI: { name: "PersonUI", resUrl: "PersonUI", com: "PersonUI", zIndex: 100 },
    LoadUI: { name: "LoadUI", resUrl: "LoadUI", com: "LoadUI", zIndex: 100 },
}