
/**
 * 动画工具类
 */
export class AniTools {
    /**
     * 在一个Lab 上逐字显示文字动画
     * @param lab  label 组件或者 text 组件
     * @param str  显示文字
     * @param time 多长时间显示完成
     */
    public static doLabStrAni(lab: cc.Label | cc.RichText, str: string, time: number) {
        lab.node.stopAllActions();
        lab.string = "";
        let strArr = str.split("");
        let index = 0;
        let iT = time / strArr.length;
        lab.node.runAction(cc.sequence(
            cc.callFunc(function () {
                lab.string = lab.string + strArr[index];
                index++;
            }),
            cc.delayTime(iT)
        ).repeat(strArr.length));
    };

    /**
     * 打开一个UI弹框的动画 
     * @param bgN 界面的背景
     * @param bodyN 从小放大的界面
     * @param iTime 播放时间
     * @param callFunc 播放完毕后回调
     */
    public static openUIAni(bgN: cc.Node, bodyN: cc.Node, iTime = 0.3, callFunc = () => { }) {
        bgN.opacity = 0;
        bodyN.scale = 0;
        bgN.runAction(cc.fadeTo(iTime, 100));
        bodyN.runAction(cc.sequence(
            cc.scaleTo(iTime, 1).easing(cc.easeBackOut()),
            cc.callFunc(callFunc)
        ));
    };
    /**
     * 关闭一个UI弹框的动画
     * @param bgN 界面的背景
     * @param bodyN 从小放大的界面
     * @param iTime 播放时间
     * @param callFunc 播放完毕后回调
     */
    public static closeUIAni(bgN: cc.Node, bodyN: cc.Node, iTime = 0.2, callFunc = () => { }) {
        bgN.runAction(cc.fadeOut(iTime));
        bodyN.runAction(cc.sequence(
            cc.scaleTo(iTime, 0).easing(cc.easeBackIn()),
            cc.callFunc(callFunc),
            cc.removeSelf(true)
        ));
    };
    /**
     * 按Node数组顺序  依次淡入或者淡出
     * @param {number} fadeT  淡入时间
     * @param {number} iTime  间隔时间
     * @param {Array} nodeArr  节点数组
     * @param {Array} isFadeOut  是否淡出
     */
    public static sortFadeToArr(nodeArr: Array<cc.Node>, fadeT = 0.3, iTime = 0.02, isFadeOut = false) {
        let toOpacity = isFadeOut ? 0 : 255;
        for (let i = 0; i < nodeArr.length; i++) {
            const obj = nodeArr[i];
            obj.opacity = 0;
            obj.runAction(cc.sequence(
                cc.delayTime(iTime * i),
                cc.fadeTo(fadeT, toOpacity)
            ));
        }
    };
    /**
     * 根据角度跳跃一定距离动画
     * @param  degress 角度
     * @param  downY 跳跃下降多少
     * @param  speed 速度
     * @param  len 跳跃高度
     * @param  deT 等待时间
     */
    public static jumpByDegressAni(obj: cc.Node, degress: number, downY = 0, len: number, speed: number, deT = 0) {
        let rad = cc.misc.degreesToRadians(degress);
        let tempP = cc.v2(Math.cos(rad) * len, Math.sin(rad) * len);
        let tempT = len / speed;

        obj.runAction(cc.sequence(
            cc.delayTime(deT),
            cc.jumpBy(tempT, cc.v2(tempP.x * 1.5, downY), len, 1),
            cc.removeSelf(true)
        ));
    };
    /**
     * node 按角度移动一段距离（由快至慢）
     * @param  degress 角度
     * @param  len 距离
     * @param  speed 速度
     * @param  isScale 是否边移动边缩小
     * @param  isFade 是否边移动边淡出
     */
    public static moveDegressAni(obj: cc.Node, degress?: number, len: number = 200, speed?: number, isScale = false, isFade = false) {
        degress = degress || this.returnRanNum(-180, 180);
        let rad = cc.misc.degreesToRadians(degress);
        let tempP = cc.v2(Math.cos(rad) * len, Math.sin(rad) * len);
        let tempT = len / speed;

        let tempS = isScale ? 0 : obj.scale;
        let tempF = isFade ? 0 : obj.opacity;

        obj.runAction(cc.sequence(
            cc.spawn(
                cc.scaleTo(tempT + 0.1, tempS),
                cc.moveBy(tempT, tempP).easing(cc.easeQuadraticActionOut()),
                cc.fadeTo(tempT + 0.1, tempF)
            ),
            cc.fadeOut(0.1),
            cc.removeSelf(true)
        ));
    };
    /**
     * 用BackOut线性moveBy回原来的位置
     * @param  iTime 
     * @param  moveX 
     * @param  moveY 
     */
    public static moveByOutInit(nodeT: cc.Node, iTime = 0.5, moveX = 0, moveY = 0) {
        nodeT.x += moveX;
        nodeT.y += moveY;
        nodeT.runAction(cc.moveBy(iTime, cc.v2(-moveX, -moveY)).easing(cc.easeBackOut()));
    };
    /**
     * 图片闪红动画
     * @param iTime 闪的时间
     * @param iNum 闪几次
     * @param callFunc 闪完后的回调
     */
    public static sprRedAni(nodeT: cc.Node, iTime: number, iNum: number, callFunc?: any) {
        let tempNum = 0;
        nodeT.runAction(cc.sequence(
            cc.delayTime(iTime),
            cc.callFunc(function (target) {
                target.color = cc.Color.RED;
            }),
            cc.delayTime(iTime),
            cc.callFunc(function (target) {
                target.color = cc.Color.WHITE;
                tempNum++;
                if (tempNum >= iNum && callFunc != null) {
                    callFunc();
                }
            })
        ).repeat(iNum));
    };
    /**
     * Node摇摆动画
     * @param {*} sAngle 摇摆角度
     * @param {*} iTime 时间
     * @param {*} delT 摇摆一次等待时间
     * @param {*} isRe 是否循环
     */
    public static shakeAni(nodeT: cc.Node, isRe = false, sAngle = 10, iTime = 0.1, delT = 2) {
        let act = cc.sequence(
            cc.rotateBy(iTime, sAngle),
            cc.rotateBy(iTime, -sAngle),
            cc.rotateBy(iTime, -sAngle),
            cc.rotateBy(iTime, sAngle),
            cc.rotateBy(iTime, sAngle),
            cc.rotateBy(iTime, -sAngle),
            cc.delayTime(delT)
        );
        if (isRe) {
            nodeT.runAction(act.repeatForever());
        } else {
            nodeT.runAction(act);
        }
    };
    //获取随机值
    public static returnRanNum(x1: number, x2: number) {
        return x1 + Math.floor(Math.random() * (x2 - x1 + 1));
    };
}