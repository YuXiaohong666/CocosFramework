import Singleton from "../Base/Singleton";
import ResManager from "../GameManager/ResManager";

/** 游戏常用工具类 */
export class Tools extends Singleton {
    /** 存储resArr脚本拖动的图片字典 */
    public static SpriteFrameDic: Map<string, cc.SpriteFrame> = new Map();
    /** 存储resArr脚本拖动的预制体字典 */
    public static PrefabDic: Map<string, cc.Prefab> = new Map();
    /** 存储resArr脚本拖动的音效字典 */
    public static AudioClipDic: Map<string, cc.AudioClip> = new Map();
    /**  resArr清理字典 */
    public static clearResDic() {
        this.AudioClipDic.clear();
        this.SpriteFrameDic.clear();
        this.PrefabDic.clear();
    }
    //-----------------------------节点预制体相关-------------------------------
    /**
     * 新建一个预制体在场景里
     * @param preName 预制体名字或url
     * @param callFunc 加载预制体 完成后回调
     * @param parent 存放预制体的父节点
     * @param Pos 预制体的坐标
     * @param zIndex 预制体的层级
     */
    public static newPrefab(preName: string, parent?: cc.Node, Pos?: cc.Vec2, zIndex = 0, callFunc?: (age?: cc.Node) => void): cc.Node {
        return NodeTools._ins.newPrefab(preName, callFunc, parent, Pos, zIndex);
    }
    /**
     * 新建一个图片在场景里
     * @param sprName 图片名字或url
     * @param callFunc 加载预制体 完成后回调
     * @param parent 存放预制体的父节点
     * @param Pos 预制体的坐标
     * @param zIndex 预制体的层级
     */
    public static newSprite(sprName: string, parent?: cc.Node, Pos?: cc.Vec2, zIndex = 0, callFunc?: (age?: cc.Node) => void): cc.Node {
        return NodeTools._ins.newSprite(sprName, callFunc, parent, Pos, zIndex);
    }
    /**
     * 设置一个节点的SpriteFrame
     * @param nodeT 节点的Node
     * @param sprUrl 图片的url或者存放到resArr的名字
     */
    public static setSpriteFrame(nodeT: cc.Node, sprUrl: string) {
        NodeTools._ins.setSpriteFrame(nodeT, sprUrl);
    }
    /** 设置一个节点的 groupIndex 包含子物体 */
    public static setNodeGroupIndex(nodeT: cc.Node, groupIndex: number) {
        NodeTools._ins.setNodeGroupIndex(nodeT, groupIndex);
    }
    /**
     * 设置一个Button的按下和松开的SpriteFrame
     * @param norUrl 默认状态的名字或者路径
     * @param preUrl 按下状态的名字或者路径
     */
    public static setBtnClickSpr(Btn: cc.Button, norUrl: string, preUrl: string) {
        NodeTools._ins.setBtnClickSpr(Btn, norUrl, preUrl);
    };
    /**
     * 节点的图片置灰色或者默认
     * @param state 0 默认  1 灰色 
     */
    public static setSpriteState(nodeT: cc.Node, state: number) {
        NodeTools._ins.setSpriteState(nodeT, state);
    };
    /** 切换父物体 不改变显示位置*/
    public static setNodeParent(node: cc.Node, parent: cc.Node) {
        NodeTools._ins.setNodeParent(node, parent);
    };
    //----------------------------------数学数组相关----------------------------------
    /**
     * 获取随机数
     * @param isInteger 是否随机整数  默认整数
     */
    public static random(x1: number, x2: number, isInteger = true): number {
        return MathTools._ins.random(x1, x2, isInteger);
    }
    /**
     * 根据概率数组 随机概率 返回数组的index
     * @param chooseArr 需要随机概率的数组 例如[0.05,0.1,0.2,0.3]
     */
    public static chooseRandom(chooseArr: Array<number>) {
        return MathTools._ins.chooseRandom(chooseArr);
    }
    /**
     * 传入一个弧度，返回一个Y轴折射后的弧度
     * @param rad 传入的弧度
     * @returns 经Y轴折射后的弧度
     */
    public static refractionY(rad: number) {
        return MathTools._ins.refractionY(rad);
    };
    /**
     * 传入一个弧度，返回一个X轴折射后的弧度
     * @param rad 传入的弧度
     * @returns 经X轴折射后的弧度
     */
    public static refractionX(rad: number) {
        return MathTools._ins.refractionX(rad);
    };
    /**
     * 重新打乱一个数组的顺序
     * @param Arr 要打乱的数组
     */
    public static againSortArr(Arr: Array<any>) {
        MathTools._ins.againSortArr(Arr);
    };
    /**
     * 将一个数组 按照里面的对象排序 
     * @param tempArr 传入的数组
     * @param sortName 对象属性名字
     * @param isReverse 是否倒序
     */
    public static sortArrForObject(tempArr: Array<any>, sortName: string, isReverse = false) {
        MathTools._ins.sortArrForObject(tempArr, sortName, isReverse);
    };
    /**
     * 取一定范围内不重复的数字
     * @param minNum 最小取值范围
     * @param maxNum 最大取值范围
     * @param getNum 取几个数字
     */
    public static getDiffNumRandom(minNum: number, maxNum: number, getNum: number) {
        return MathTools._ins.getDiffNumRandom(minNum, maxNum, getNum);
    };
    //--------------------------------向量坐标计算相关------------------------------------
    /**
     * 根据两个点  求角度
     * @param pos1 起始点坐标
     * @param pos2 结束点坐标
     * @param isVertical 是否以竖直方向为0度开始
     */
    public static getAngleForPos(pos1: cc.Vec2 | cc.Vec3, pos2: cc.Vec2 | cc.Vec3, isVertical = false): number {
        return VecTools._ins.getAngleForPos(this.getV2ForV3(pos1), this.getV2ForV3(pos2), isVertical);
    };
    /** 获取两个坐标之间的距离 */
    public static getDistance(pos1: cc.Vec2 | cc.Vec3, pos2: cc.Vec2 | cc.Vec3): number {
        return VecTools._ins.getDistance(this.getV2ForV3(pos1), this.getV2ForV3(pos2));
    };
    /** 通过V3 获取V2 */
    public static getV2ForV3(pos: cc.Vec2 | cc.Vec3): cc.Vec2 {
        return cc.v2(pos.x, pos.y);
    };
    /**
     * 根据一个角度和长度 计算相对应的坐标
     * @param angle 角度
     * @param len 该角度上的长度
     * @param startPos 初始的坐标
     */
    public static getPosForAngleLen(angle: number, len: number, startPos: cc.Vec2 = cc.v2(0, 0)) {
        return VecTools._ins.getPosForAngleLen(angle, len, startPos);
    }
    /**
     * 获取节点在另一个节点下的坐标
     * @param obj 节点
     * @param mainObj 相对于的另一个节点
     */
    public static getToNodePosForNode(obj: cc.Node, mainObj: cc.Node): cc.Vec2 {
        return VecTools._ins.getToNodePosForNode(obj, mainObj);
    };
    /** 获取节点的世界坐标 */
    public static getToWorldPosAR(obj: cc.Node) {
        return VecTools._ins.getToWorldPosAR(obj);
    }
    /**
     * 通过世界坐标 获取相对节点的坐标
     * @param worldPos 世界坐标
     * @param obj 相对节点下的
     */
    public static getToNodePosForWorld(worldPos: cc.Vec2, obj: cc.Node) {
        return VecTools._ins.getToNodePosForWorld(worldPos, obj);
    }
    //--------------------------------数组操作相关------------------------------------
    /** 根据value值 从数组里面移除 */
    public static removeArrForValue(tempArr: Array<any>, value: any) {
        return tempArr.splice(tempArr.indexOf(value), 1);
    }
    /** 从数组里面添加一个该数组里没有的元素 */
    public static addArrNoValue(tempArr: Array<any>, value: any) {
        if (tempArr.indexOf(value) < 0) {
            tempArr.push(value);
            return true;
        }
        return false;
    }
    /** 从数组指定位置 插入某个元素 */
    public static addArrIndex(tempArr: Array<any>, index: number, value: any) {
        return tempArr.splice(index, 0, value);
    }
    //--------------------------------其他------------------------------------
    /**
     *  字符串指定位置插入新字符 
     * @param str 需要操作的字符串
     * @param start 从那个位置开始插入
     * @param newStr 插入的新的字符
     */
    public static insertStrForIndex(str: string, start: number, newStr: string): string {
        return str.slice(0, start) + newStr + str.slice(start);
    };
    /**
     * 数字整数前边补零 并返回字符串
     * @param num 传入的数字
     * @param length 前边补几个零
     */
    public static prefixInteger(num: number, length = 2): string {
        return (Array(length).join('0') + num).slice(-length);
    };
}


/** 节点相关 工具类 */
class NodeTools extends Singleton {
    /** 新建一个预制体在场景里 */
    public newPrefab(preName: string, callFunc?: (age?: cc.Node) => void, parent?: cc.Node, Pos?: cc.Vec2, zindex = 0): cc.Node {
        let prefab = Tools.PrefabDic.get(preName);
        let clone: cc.Node = null;
        if (prefab != null) {
            clone = cc.instantiate(prefab);
            if (parent) { parent.addChild(clone, zindex) };
            if (Pos) { clone.position = cc.v3(Pos.x, Pos.y, 0) };
            if (callFunc != null) {
                callFunc(clone);
            }
        } else {
            ResManager._ins.loadResPrefab(preName, callFunc, parent, Pos, zindex);
        }
        return clone;
    }
    /** 新建一个图片在场景里 */
    public newSprite(sprName: string, callFunc?: (age?: cc.Node) => void, parent?: cc.Node, Pos?: cc.Vec2, zindex = 0) {
        let sprite = new cc.Node();
        sprite.name = sprName;
        if (Tools.SpriteFrameDic.get(sprName) != null) {
            sprite.addComponent(cc.Sprite).spriteFrame = Tools.SpriteFrameDic.get(sprName);
            if (parent) { parent.addChild(sprite, zindex) };
            if (Pos) { sprite.position = cc.v3(Pos.x, Pos.y, 0) };
            if (callFunc != null) {
                callFunc(sprite);
            }
        } else {
            sprite.addComponent(cc.Sprite);
            ResManager._ins.loadResSpriteFrame(sprName, sprite, parent, Pos, zindex, callFunc);
        }
        return sprite;
    }
    /** 设置一个节点的SpriteFrame */
    public setSpriteFrame(nodeT: cc.Node, sprUrl: string) {
        if (Tools.SpriteFrameDic.get(sprUrl)) {
            nodeT.getComponent(cc.Sprite).spriteFrame = Tools.SpriteFrameDic.get(sprUrl)
        } else {
            ResManager._ins.loadResAny(sprUrl, cc.SpriteFrame, (spriteFrame: cc.SpriteFrame) => {
                nodeT.getComponent(cc.Sprite).spriteFrame = spriteFrame;
            })
        }
    }
    /** 设置一个节点的 groupIndex 包含子物体 */
    public setNodeGroupIndex(nodeT: cc.Node, groupIndex: number) {
        nodeT.groupIndex = groupIndex;
        for (let i = 0; i < nodeT.children.length; i++) {
            this.setNodeGroupIndex(nodeT.children[i], groupIndex);
        }
    }
    /** 设置一个Button的按下和松开的SpriteFrame */
    public setBtnClickSpr(Btn: cc.Button, norUrl: string, preUrl: string) {
        if (Tools.SpriteFrameDic.get(norUrl)) {
            Btn.getComponent(cc.Button).normalSprite = Tools.SpriteFrameDic.get(norUrl)
            Btn.getComponent(cc.Button).hoverSprite = Tools.SpriteFrameDic.get(norUrl)
            Btn.getComponent(cc.Button).pressedSprite = Tools.SpriteFrameDic.get(preUrl)
        } else {
            ResManager._ins.loadResAny(norUrl, cc.SpriteFrame, (spr: cc.SpriteFrame) => {
                Btn.getComponent(cc.Button).normalSprite = spr;
                Btn.getComponent(cc.Button).hoverSprite = spr;
            });
            ResManager._ins.loadResAny(preUrl, cc.SpriteFrame, (spr: cc.SpriteFrame) => {
                Btn.getComponent(cc.Button).pressedSprite = spr;
            });
        }
    };
    /** 图片置灰 或者  恢复 */
    public setSpriteState(nodeT: cc.Node, state: number) {
        let matUrl = state == 0 ? "builtin-2d-sprite" : "builtin-2d-gray-sprite";
        cc.loader.loadRes("materials/" + matUrl, cc.Material, function (error: any, Material: cc.Material) {
            if (error) {
                cc.error(error);
            } else {
                nodeT.getComponent(cc.Sprite).setMaterial(0, Material);
            }
        });
    };
    /** 切换父物体 不改变坐标 */
    public setNodeParent(node: cc.Node, parent: cc.Node) {
        let Pos = VecTools._ins.getToNodePosForNode(node, parent);
        node.parent = parent;
        node.position = cc.v3(Pos.x, Pos.y);
    };
}
/** 数学数组计算相关 工具类 */
class MathTools extends Singleton {
    /** 获取随机数 */
    public random(x1: number, x2: number, isInteger = true): number {
        if (isInteger) {
            return x1 + Math.floor(Math.random() * (x2 - x1 + 1));
        }
        return Math.random() * (x2 - x1) + x1;
    }
    /**  根据概率数组 随机概率 返回数组的index */
    public chooseRandom(chooseArr: Array<number>) {
        let total = 0;  //概率总值
        //首先计算出概率的总值，用来计算随机范围
        for (let i = 0; i < chooseArr.length; i++) {
            total += chooseArr[i];
        }
        let randNum = this.random(0, total, false)
        for (let i = 0; i < chooseArr.length; i++) {
            if (randNum < chooseArr[i] && chooseArr[i] > 0) {
                return i;
            } else {
                randNum -= chooseArr[i];
            }
        }
        return chooseArr.length - 1;
    }
    /** 弧度折射Y轴 */
    public refractionY(rad: number) {
        return Math.atan2(Math.sin(rad), -Math.cos(rad));
    };
    /** 弧度折射X轴 */
    public refractionX(rad: number) {
        return Math.atan2(-Math.sin(rad), Math.cos(rad));
    };
    /**
     * 重新洗牌 一个数组
     * @param Arr 
     */
    public againSortArr(Arr: Array<any>) {
        for (let i = 0; i < Arr.length; i++) {
            let tempR = Tools.random(0, Arr.length - 1);
            if (tempR != i) {
                let temp = Arr[i];
                Arr[i] = Arr[tempR];
                Arr[tempR] = temp;
            }
        }
    }
    /**
     * 根据对象属性对数组进行排序
     * @param tempArr 要排序的数组
     * @param sortName 对象属性 
     * @param isReverse 是否倒序
     */
    public sortArrForObject(tempArr: Array<any>, sortName: string, isReverse = false) {
        if (!isReverse) {
            tempArr.sort((a, b) => {
                return a[sortName] - b[sortName];
            });
        } else {
            tempArr.sort((a, b) => {
                return b[sortName] - a[sortName];
            });
        }
    };
    /**
     * 取一定范围内不重复的数字
     * @param minNum 最小数值
     * @param maxNum 最大数值
     * @param getNum 获取的个数
     * @returns 取值结果
     */
    public getDiffNumRandom(minNum: number, maxNum: number, getNum: number) {
        var arr = [];
        for (let i = minNum; i <= maxNum; i++) {
            arr.push(i);
        }
        const tempLen = arr.length - getNum;
        for (let i = 0; i < tempLen; i++) {
            let tempI = Tools.random(0, arr.length - 1);
            arr.splice(tempI, 1);
        }
        return arr;
    };
}
/** 向量坐标转换相关工具类 */
class VecTools extends Singleton {
    /**
     * 根据两个点，求角度
     * @param pos1 坐标点1
     * @param pos2 坐标点2
     * @param isVertical 是否垂直
     * @returns 两个坐标点的夹角
     */
    public getAngleForPos(pos1: cc.Vec2, pos2: cc.Vec2, isVertical = false): number {
        let rad = 0;
        if (isVertical) {
            rad = -Math.atan2(pos2.x - pos1.x, pos2.y - pos1.y);
        } else {
            rad = Math.atan2(pos2.y - pos1.y, pos2.x - pos1.x);
        }
        return cc.misc.radiansToDegrees(rad);
    }
    /**
     * 获取两个坐标之间的距离
     * @param pos1 坐标点1
     * @param pos2 坐标点2
     * @returns 两个坐标间的距离
     */
    public getDistance(pos1: cc.Vec2, pos2: cc.Vec2): number {
        return pos1.sub(pos2).mag();
    };
    /**
     * 根据一个角度和长度，计算相对应的坐标
     * @param angle 角度
     * @param len 长度
     * @param startPos 起始坐标
     * @returns 终点坐标
     */
    public getPosForAngleLen(angle: number, len: number, startPos: cc.Vec2 = cc.v2(0, 0)) {
        let rad = cc.misc.degreesToRadians(angle);
        return cc.v3(startPos.x + Math.cos(rad) * len, startPos.y + Math.sin(rad) * len);
    }
    /**
     * 获取节点在另一个节点下的坐标
     * @param obj 当前节点
     * @param mainObj 另一个节点
     * @returns 另一个节点下的坐标
     */
    public getToNodePosForNode(obj: cc.Node, mainObj: cc.Node): cc.Vec2 {
        let worldPos = obj.parent.convertToWorldSpaceAR(obj.position);
        let nodePos = mainObj.convertToNodeSpaceAR(worldPos)
        return cc.v2(nodePos.x, nodePos.y);
    };
    /**
     * 获取节点的世界坐标
     * @param obj 节点
     * @returns 节点的世界坐标
     */
    public getToWorldPosAR(obj: cc.Node) {
        return obj.parent.convertToWorldSpaceAR(obj.position);
    }
    /**
     * 通过世界坐标，获取相对节点的坐标
     * @param worldPos 世界坐标
     * @param obj 相当节点
     * @returns 相对节点的坐标
     */
    public getToNodePosForWorld(worldPos: cc.Vec2, obj: cc.Node) {
        return obj.convertToNodeSpaceAR(worldPos);
    }
}
