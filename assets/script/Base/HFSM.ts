export class Timer {
    /** 开始时间戳 */
    private startTime: number;

    /** 结束时间戳 */
    private endTime: number;

    public get elapsed(): number {
        return Date.now() - this.startTime;
    }

    public get isEnd(): boolean {
        return this.elapsed >= this.endTime;
    }

    constructor() {
        this.startTime = Date.now();
    }

    public reset(endTime: number = 0): void {
        this.startTime = Date.now();
        this.endTime = endTime;
    }

    public static greaterThan(timer: Timer, duration: number): boolean {
        return timer.elapsed > duration;
    }

    public static lessThan(timer: Timer, duration: number): boolean {
        return timer.elapsed < duration;
    }

    public static greaterThanOrEqual(timer: Timer, duration: number): boolean {
        return timer.elapsed >= duration;
    }

    public static lessThanOrEqual(timer: Timer, duration: number): boolean {
        return timer.elapsed <= duration;
    }
}

export interface IActionable<TEvent> {
    onAction<TData>(trigger: TEvent, data?: TData): void;
}

export interface ITriggerable<TEvent = string> {
    trigger(trigger: TEvent): void;
}

export interface IStateBase<TStateId> {
    readonly needsExitTime: boolean;
    readonly name: TStateId;
}

export interface IStateMachine<TStateId> {
    /**
     * 告诉状态机，如果有一个状态转换待处理，现在是执行它的时候了
     */
    stateCanExit(): void;

    /**
     * 请求状态变化
     * @param name 状态id
     * @param forceInstantly
     */
    requestStateChange(name: TStateId, forceInstantly?: boolean): void;

    /**
     * 当前激活的状态
     */
    activeState: IStateBase<TStateId>;

    /**
     * 激活状态名称
     */
    activeStateName: TStateId;
}

export class StateBase<TStateId = string> implements IStateBase<TStateId> {
    public timer: Timer;
    public needsExitTime: boolean;
    public name: TStateId;
    public fsm: IStateMachine<TStateId>;

    /**
     * 初始化状态实例
     * @param needsExitTime 确定状态是否允许在转换时立即退出(false)，或者状态机是否应该等待直到状态准备好进行状态更改(true)
     */
    constructor(needsExitTime: boolean) {
        this.needsExitTime = needsExitTime;
        this.timer = new Timer();
    }

    /**
     * @zh
     * 在设置了name、fsm等值之后调用以初始化状态
     * @en
     * Called to initialize the state, after values like name, mono and fsm have been set
     */
    public init(): void { }

    /**
     * @zh
     * 当状态机转换到此状态(进入此状态)时调用
     * @en
     * Called when the state machine transitions to this state (enters this state)
     */
    public onEnter(): void {
        this.timer.reset();
    }

    /**
     * @zh
     * 在此状态处于活动状态时调用
     * @en
     * Called while this state is active
     * @param dt
     */
    public onLogic(): void { }

    /**
     * @zh
     * 该方法在此播放器暂停播放时触发。
     * @en
     * This method is called when this player pauses.
     */
    public onExit(): void { }

    /**
     * @zh
     * (仅当needsExitTime为true时):
     * 当一个状态从这个状态转换到另一个状态时调用。
     * 如果它可以退出，它应该调用fsm.stateCanExit()
     * 如果它现在不能退出，它应该在onLogic()中稍后调用fsm.stateCanExit()。
     * @en
     * (Only if needsExitTime is true):
     * Called when a state transition from this state to another state should happen.
     * If it can exit, it should call fsm.stateCanExit()
     * and if it can not exit right now, it should call fsm.stateCanExit() later in onLogic().
     */
    public onExitRequest(): void { }
}

/**
 * 状态转换基类
 */
export class TransitionBase<TStateId = string> {
    public from: TStateId;
    public to: TStateId;
    public forceInstantly: boolean;

    public fsm: IStateMachine<TStateId>;

    constructor(from: TStateId, to: TStateId, forceInstantly: boolean = false) {
        this.from = from;
        this.to = to;
        this.forceInstantly = forceInstantly;
    }

    public init(): void { }

    /**
     * @zh
     * 当状态机进入“from”状态时调用
     * @en
     * Called when the state machine enters the "from" state
     */
    public onEnter(): void { }

    /**
     * @zh
     * 调用以确定状态机是否应该转换到<c>到</c>状态
     * @en
     * Called to determin whether the state machine should transition to the <c>to</c> state
     * @returns True if the state machine should change states / transition
     */
    public shouldTransition(): boolean {
        return true;
    }
}

export class ExceptionFormatter {
    public static format(context: string = null, problem: string = null, solution: string = null): string {
        let message: string = "\n";

        if (context != null) {
            message += "Context: " + context + "\n";
        }

        if (problem != null) {
            message += "Problem: " + problem + "\n";
        }

        if (solution != null) {
            message += "Solution: " + solution + "\n";
        }

        return message;
    }
}

export class StateNotFoundException<TState = string> {
    constructor(stateName: TState, context: string = null, problem: string = null, solution: string = null) {
        this.format(stateName, context, problem, solution);
    }

    private format(stateName: TState, context: string, problem: string, solution: string): string {
        if (problem == null) {
            problem = `The state "${stateName}" has not been defined yet / doesn't exist.`;
        }

        if (solution == null) {
            solution =
                "\n" +
                "1. Check that there are no typos in the state names and transition from and to names\n" +
                "2. Add this state before calling init / onEnter / onLogic / requestStateChange / ...";
        }

        return ExceptionFormatter.format(context, problem, solution);
    }
}

export class StateMachineNotInitializedException extends Error {
    public static format(context: string = null, problem: string = null, solution: string = null): string {
        if (problem == null) {
            problem = "The active state is null because the state machine has not been set up yet.";
        }

        if (solution == null) {
            solution = "Call fsm.setStartState(...) and fsm.init() or fsm.onEnter() " + "to initialize the state machine.";
        }

        return ExceptionFormatter.format(context, problem, solution);
    }

    constructor(context: string = null, problem: string = null, solution: string = null) {
        super();
        StateMachineNotInitializedException.format(context, problem, solution);
    }
}

export class ActionState<TStateId = string, TEvent = string> extends StateBase<TStateId> implements IActionable<TEvent> {
    // Lazy initialized
    private actionsByEvent: Map<TEvent, Function>;

    constructor(needsExitTime: boolean) {
        super(needsExitTime);
    }

    private addGenericAction(trigger: TEvent, action: Function): void {
        this.actionsByEvent = this.actionsByEvent ?? new Map();
        this.actionsByEvent.set(trigger, action);
    }

    private tryGetAndCastAction(trigger: TEvent): Function | null {
        const action = this.actionsByEvent.get(trigger);

        if (!action) {
            return null;
        }

        const target = action;

        if (!target) {
            throw new Error(
                `Trying to call the action '${trigger}'. The expected argument type (${"TTarget"}) does not match the type of the added action (${action}). Check that the type of action that was added matches the type of action that is called. \nE.g. AddAction<int>(...) => OnAction<int>(...) \nE.g. AddAction(...) => OnAction(...) \nE.g. NOT: AddAction<int>(...) => OnAction<bool>(...)`
            );
        }

        return target;
    }

    public addAction<TData>(trigger: TEvent, action: (data?: TData) => void): ActionState<TStateId, TEvent> {
        this.addGenericAction(trigger, action);
        return this;
    }

    public onAction<TData>(trigger: TEvent, data?: TData): void {
        this.tryGetAndCastAction(trigger)?.(data);
    }
}

/**
 * The "normal" state class that can run code on Enter, on Logic and on Exit,
 * while also handling the timing of the next state transition
 */
export class State<TStateId = string, TEvent = string> extends ActionState<TStateId, TEvent> {
    /**
     * Initialises a new instance of the State class
     * @param onEnter A function that is called when the state machine enters this state
     * @param onLogic A function that is called by the logic function of the state machine if this state is active
     * @param onExit A function that is called when the state machine exits this state
     * @param canExit (Only if needsExitTime is true):
     *  Called when a state transition from this state to another state should happen.
     *  If it can exit, it should call fsm.StateCanExit()
     *  and if it can not exit right now, later in OnLogic() it should call fsm.StateCanExit()
     * @param needsExitTime Determins if the state is allowed to instantly
     *  exit on a transition (false), or if the state machine should wait until the state is ready for a
     *  state change (true)
     */
    constructor(
        private _onEnter: (state: State<TStateId, TEvent>) => void = null,
        private _onLogic: (state: State<TStateId, TEvent>) => void = null,
        private _onExit: (state: State<TStateId, TEvent>) => void = null,
        private _canExit: (state: State<TStateId, TEvent>) => boolean = null,
        needsExitTime: boolean = false
    ) {
        super(needsExitTime);
    }

    public onEnter(): void {
        this.timer.reset();
        this._onEnter?.(this);
    }

    public onLogic(): void {
        this._onLogic?.(this);
    }

    public onExit(): void {
        this._onExit?.(this);
    }

    public onExitRequest(): void {
        if (!this.needsExitTime || this._canExit?.(this)) {
            this.fsm.stateCanExit();
        }
    }
}

class WrappedState<TStateId, TEvent> extends StateBase<TStateId> implements ITriggerable<TEvent>, IActionable<TEvent> {
    constructor(
        private state: StateBase<TStateId>,
        private beforeOnEnter: (state: StateBase<TStateId>) => void = null,
        private afterOnEnter: (state: StateBase<TStateId>) => void = null,
        private beforeOnLogic: (state: StateBase<TStateId>) => void = null,
        private afterOnLogic: (state: StateBase<TStateId>) => void = null,
        private beforeOnExit: (state: StateBase<TStateId>) => void = null,
        private afterOnExit: (state: StateBase<TStateId>) => void = null
    ) {
        super(state.needsExitTime);
    }

    public init(): void {
        this.state.name = this.name;
        this.state.fsm = this.fsm;
        this.state.init();
    }

    public onEnter(): void {
        this.beforeOnEnter?.(this);
        this.state.onEnter();
        this.afterOnEnter?.(this);
    }

    public onLogic(): void {
        this.beforeOnLogic?.(this);
        this.state.onLogic();
        this.afterOnLogic?.(this);
    }

    public onExit(): void {
        this.beforeOnExit?.(this);
        this.state.onExit();
        this.afterOnExit?.(this);
    }

    public onExitRequest(): void {
        this.state.onExitRequest();
    }

    public trigger(trigger: TEvent): void {
        if (this.state["trigger"]) {
            this.state["trigger"](trigger);
        }
    }

    public onAction<TData>(trigger: TEvent, data?: TData): void {
        if (this.state["onAction"]) {
            this.state["onAction"]<TData>(trigger, data);
        }
    }
}

export class StateWrapper<TStateId = string, TEvent = string> {
    constructor(
        private beforeOnEnter: (state: StateBase<TStateId>) => void = null,
        private afterOnEnter: (state: StateBase<TStateId>) => void = null,
        private beforeOnLogic: (state: StateBase<TStateId>) => void = null,
        private afterOnLogic: (state: StateBase<TStateId>) => void = null,
        private beforeOnExit: (state: StateBase<TStateId>) => void = null,
        private afterOnExit: (state: StateBase<TStateId>) => void = null
    ) { }

    public wrap(state: StateBase<TStateId>): WrappedState<TStateId, TEvent> {
        return new WrappedState(state, this.beforeOnEnter, this.afterOnEnter, this.beforeOnLogic, this.afterOnLogic, this.beforeOnExit, this.afterOnExit);
    }
}

export class Transition<TStateId = string> extends TransitionBase<TStateId> {
    public condition: (transition: Transition<TStateId>) => boolean;

    constructor(from: TStateId, to: TStateId, condition: (transition: Transition<TStateId>) => boolean = null, forceInstantly: boolean = false) {
        super(from, to, forceInstantly);
        this.condition = condition;
    }

    public shouldTransition(): boolean {
        if (!this.condition) {
            return true;
        }

        return this.condition(this);
    }
}

export class TransitionAfter<TStateId = string> extends TransitionBase<TStateId> {
    public delay: number;
    public condition: (transition: TransitionAfter<TStateId>) => boolean;
    public timer: Timer;

    constructor(from: TStateId, to: TStateId, delay: number, condition: (transition: TransitionAfter<TStateId>) => boolean = null, forceInstantly: boolean = false) {
        super(from, to, forceInstantly);
        this.delay = delay;
        this.condition = condition;
        this.timer = new Timer();
    }

    public onEnter(): void {
        this.timer.reset();
    }

    public shouldTransition(): boolean {
        if (this.timer.elapsed < this.delay) {
            return false;
        }

        if (this.condition == null) {
            return true;
        }

        return this.condition(this);
    }
}

export class TransitionAfterDynamic<TStateId = string> extends TransitionBase<TStateId> {
    public delayCalculator: (transition: TransitionAfterDynamic<TStateId>) => number;
    public condition: (transition: TransitionAfterDynamic<TStateId>) => boolean;
    public timer: Timer;

    constructor(
        from: TStateId,
        to: TStateId,
        delay: (transition: TransitionAfterDynamic<TStateId>) => number,
        condition: (transition: TransitionAfterDynamic<TStateId>) => boolean = null,
        forceInstantly: boolean = false
    ) {
        super(from, to, forceInstantly);
        this.delayCalculator = delay;
        this.condition = condition;
        this.timer = new Timer();
    }

    public onEnter(): void {
        this.timer.reset();
    }

    public shouldTransition(): boolean {
        if (this.timer.elapsed < this.delayCalculator(this)) {
            return false;
        }

        if (this.condition == null) {
            return true;
        }

        return this.condition(this);
    }
}

class WrappedTransition<TStateId> extends TransitionBase<TStateId> {
    constructor(
        private transition: TransitionBase<TStateId>,
        private beforeOnEnter: (transition: TransitionBase<TStateId>) => void = null,
        private afterOnEnter: (transition: TransitionBase<TStateId>) => void = null,
        private beforeShouldTransition: (transition: TransitionBase<TStateId>) => void = null,
        private afterShouldTransition: (transition: TransitionBase<TStateId>) => void = null
    ) {
        super(transition.from, transition.to, transition.forceInstantly);
    }

    public init(): void {
        this.transition.fsm = this.fsm;
    }

    public onEnter(): void {
        this.beforeOnEnter?.(this.transition);
        this.transition.onEnter();
        this.afterOnEnter?.(this.transition);
    }

    public shouldTransition(): boolean {
        this.beforeShouldTransition?.(this.transition);
        const shouldTransition = this.transition.shouldTransition();
        this.afterShouldTransition?.(this.transition);
        return shouldTransition;
    }
}

export class TransitionWrapper<TStateId = string> {
    constructor(
        private beforeOnEnter: (transition: TransitionBase<TStateId>) => void = null,
        private afterOnEnter: (transition: TransitionBase<TStateId>) => void = null,
        private beforeShouldTransition: (transition: TransitionBase<TStateId>) => void = null,
        private afterShouldTransition: (transition: TransitionBase<TStateId>) => void = null
    ) { }

    public wrap(transition: TransitionBase<TStateId>): WrappedTransition<TStateId> {
        return new WrappedTransition(transition, this.beforeOnEnter, this.afterOnEnter, this.beforeShouldTransition, this.afterShouldTransition);
    }
}

class StateBundle<TStateId, TEvent> {
    // By default, these fields are all null and only get a value when you need them
    // => Lazy evaluation => Memory efficient, when you only need a subset of features
    public state: StateBase<TStateId>;
    public transitions: TransitionBase<TStateId>[];
    public triggerToTransitions: Map<TEvent, TransitionBase<TStateId>[]>;

    public addTransition(transition: TransitionBase<TStateId>): void {
        this.transitions = this.transitions ?? [];
        this.transitions.push(transition);
    }

    public addTriggerTransition(trigger: TEvent, transition: TransitionBase<TStateId>): void {
        this.triggerToTransitions = this.triggerToTransitions ?? new Map();

        let transitionsOfTrigger = this.triggerToTransitions.get(trigger);

        if (!transitionsOfTrigger) {
            transitionsOfTrigger = [];
            this.triggerToTransitions.set(trigger, transitionsOfTrigger);
        }

        transitionsOfTrigger.push(transition);
    }
}

export class StateMachine<TOwnId = string, TStateId = TOwnId, TEvent = string>
    extends StateBase<TOwnId>
    implements ITriggerable<TEvent>, IStateMachine<TStateId>, IActionable<TEvent> {
    private startState = { state: null, hasState: false };
    private pendingState = { state: null, isPending: false };
    private nameToStateBundle: Map<TStateId, StateBundle<TStateId, TEvent>> = new Map();
    private _activeState: StateBase<TStateId> = null;
    private activeTransitions: Array<TransitionBase<TStateId>> = new Array();
    private activeTriggerTransitions: Map<TEvent, Array<TransitionBase<TStateId>>> = new Map();
    private transitionsFromAny: Array<TransitionBase<TStateId>> = new Array();
    private triggerTransitionsFromAny: Map<TEvent, TransitionBase<TStateId>[]> = new Map();

    get activeState(): StateBase<TStateId> {
        this.ensureIsInitializedFor("Trying to get the active state");
        return this._activeState;
    }

    get activeStateName(): TStateId {
        return this.activeState.name;
    }

    /**
     * 是否是此状态
     * @param state 状态
     */
    public isState(state: TStateId): boolean {
        return this.activeStateName === state;
    }

    getStateIds() {
        return [...this.nameToStateBundle.values()].map((it) => it.state.name);
    }

    private get isRootFsm(): boolean {
        return this.fsm == null;
    }

    constructor(needsExitTime: boolean = true) {
        super(needsExitTime);
    }

    private ensureIsInitializedFor(context: string): void {
        if (this._activeState == null) {
            throw new StateMachineNotInitializedException(context);
        }
    }

    /**
     * 当前状态可以退出了
     */
    public stateCanExit(): void {
        if (this.pendingState.isPending) {
            this.changeState(this.pendingState.state);
            this.pendingState = { isPending: false, state: null };
        }

        // 告诉父级状态机、子级状态可以退出了
        this.fsm?.stateCanExit();
    }

    /**
     * 请求退出
     */
    public override onExitRequest(): void {
        if (this.activeState.needsExitTime) {
            this.activeState.onExitRequest();
            return;
        }

        this.fsm?.stateCanExit();
    }

    /**
     * 切换状态
     * @param name 状态id
     */
    private changeState(name: TStateId): void {
        this._activeState?.onExit();

        if (!this.nameToStateBundle.has(name)) {
            throw new StateNotFoundException<TStateId>(name, "Switching states");
        }

        const bundle = this.nameToStateBundle.get(name);
        this.activeTransitions = bundle.transitions ?? [];
        this.activeTriggerTransitions = bundle.triggerToTransitions ?? new Map();

        this._activeState = bundle.state;
        this._activeState.onEnter();

        this.activeTransitions.forEach((activeTransition) => activeTransition.onEnter());

        this.activeTriggerTransitions.forEach((transitions) => transitions.forEach((transition) => transition.onEnter()));
    }

    /**
     * 请求切换状态
     * @param state 状态名称
     * @param forceInstantly 是否强制切换
     */
    public requestStateChange(state: TStateId, forceInstantly: boolean = false): void {
        if (!this.activeState.needsExitTime || forceInstantly) {
            this.changeState(state);
        } else {
            this.pendingState = { state, isPending: true };
            this.activeState.onExitRequest();
            /**
             * If it can exit, the activeState would call
             * -> state.fsm.StateCanExit() which in turn would call
             * -> fsm.ChangeState(...)
             */
        }
    }

    /**
     * 尝试转换状态
     * @param transition 转换
     */
    private tryTransition(transition: TransitionBase<TStateId>): boolean {
        if (!transition.shouldTransition()) {
            return false;
        }

        this.requestStateChange(transition.to, transition.forceInstantly);

        return true;
    }

    /**
     * 设置开始状态
     * @param state 状态名称
     */
    public setStartState(state: TStateId): void {
        this.startState = { state, hasState: true };
    }

    /**
     * 状态机初始化
     */
    public init(): void {
        if (!this.isRootFsm) {
            return;
        }

        this.onEnter();
    }

    public onEnter(): void {
        if (!this.startState.hasState) {
            throw new StateMachineNotInitializedException(
                "Running OnEnter of the state machine.",
                "No start state is selected. " + "The state machine needs at least one state to function properly.",
                "Make sure that there is at least one state in the state machine before" + "before running Init() or OnEnter() by calling fsm.AddState(...)."
            );
        }
        this.changeState(this.startState.state);

        this.transitionsFromAny.forEach((transition) => transition.onEnter());

        this.triggerTransitionsFromAny.forEach((transitions) => transitions.forEach((transition) => transition.onEnter()));
    }

    public onLogic(): void {
        this.ensureIsInitializedFor("Running OnLogic");

        // Try the "global" transitions that can transition from any state
        for (const transition of this.transitionsFromAny) {
            if (transition.to === this.activeState.name) {
                continue;
            }
            if (this.tryTransition(transition)) {
                break;
            }
        }

        // Try the "normal" transitions that transition from one specific state to another
        for (const transition of this.activeTransitions) {
            if (this.tryTransition(transition)) {
                break;
            }
        }

        this.activeState.onLogic();
    }

    public onExit(): void {
        if (this.activeState != null) {
            this.activeState.onExit();
            // By setting the activeState to null, the state's onExit method won't be called
            // a second time when the state machine enters again (and changes to the start state)
            this._activeState = null;
        }
    }

    /**
     * 获取或创建一个状态的状态包
     * @param name 状态名称
     */
    private getOrCreateStateBundle(name: TStateId): StateBundle<TStateId, TEvent> {
        if (!this.nameToStateBundle.has(name)) {
            const bundle = new StateBundle<TStateId, TEvent>();
            this.nameToStateBundle.set(name, bundle);
        }
        return this.nameToStateBundle.get(name);
    }

    public addState(name: TStateId, state: StateBase<TStateId>): void;
    public addState(
        name: TStateId,
        onEnter?: (state: State<TStateId, TEvent>) => void,
        onLogic?: (state: State<TStateId, TEvent>) => void,
        onExit?: (state: State<TStateId, TEvent>) => void,
        canExit?: (state: State<TStateId, TEvent>) => boolean,
        needsExitTime?: boolean
    ): void;

    public addState(
        name: TStateId,
        options: {
            onEnter?: (state: State<TStateId, TEvent>) => void;
            onLogic?: (state: State<TStateId, TEvent>) => void;
            onExit?: (state: State<TStateId, TEvent>) => void;
            canExit?: (state: State<TStateId, TEvent>) => boolean;
            needsExitTime?: boolean;
        }
    ): void;

    public addState(...args: any[]): void {
        const name: TStateId = args.shift();
        if (args[0] instanceof StateBase) {
            this._addState(name, args[0]);
            return;
        }

        const obj = args[0];
        if (obj && typeof obj === "object" && obj.constructor === Object) {
            const { onEnter = null, onLogic = null, onExit = null, canExit = null, needsExitTime = null } = args[0];
            this._addState(name, new State<TStateId, TEvent>(onEnter, onLogic, onExit, canExit, needsExitTime));
            return;
        }

        const [onEnter = null, onLogic = null, onExit = null, canExit = null, needsExitTime = null] = args;
        if (onEnter == null && onLogic == null && onExit == null && canExit == null) {
            this._addState(name, new StateBase<TStateId>(needsExitTime));
            return;
        }

        this._addState(name, new State<TStateId, TEvent>(onEnter, onLogic, onExit, canExit, needsExitTime));
    }

    private _addState(name: TStateId, state: StateBase<TStateId>) {
        state.fsm = this;
        state.name = name;
        state.init();

        const bundle = this.getOrCreateStateBundle(name);
        bundle.state = state;
        if (this.nameToStateBundle.size == 1 && !this.startState.hasState) {
            this.setStartState(name);
        }
    }

    /**
     * 初始化状态
     * @param transition 转换状态
     */
    private initTransition(transition: TransitionBase<TStateId>): void {
        transition.fsm = this;
        transition.init();
    }

    public addTransition(transition: TransitionBase<TStateId>): void;
    public addTransition(from: TStateId, to: TStateId, condition?: (transition: Transition<TStateId>) => boolean, forceInstantly?: boolean): void;
    public addTransition(...args: any[]): void {
        if (args[0] instanceof TransitionBase) {
            this._addTransition(args[0]);
            return;
        }

        const [from, to, condition, forceInstantly] = args;
        this._addTransition(this.createOptimizedTransition(from, to, condition, forceInstantly));
    }
    private _addTransition(transition: TransitionBase<TStateId>): void {
        this.initTransition(transition);
        const bundle = this.getOrCreateStateBundle(transition.from);
        bundle.addTransition(transition);
    }

    public addTransitionFromAny(transition: TransitionBase<TStateId>): void;
    public addTransitionFromAny(from: TStateId, to: TStateId, condition: (transition: Transition<TStateId>) => boolean, forceInstantly: boolean): void;
    public addTransitionFromAny(...args: any[]): void {
        if (args[0] instanceof TransitionBase) {
            this._addTransitionFromAny(args[0]);
            return;
        }

        const [from, to, condition, forceInstantly] = args;
        this._addTransitionFromAny(this.createOptimizedTransition(from, to, condition, forceInstantly));
    }
    private _addTransitionFromAny(transition: TransitionBase<TStateId>): void {
        this.initTransition(transition);
        this.transitionsFromAny.push(transition);
    }

    public addTriggerTransition(trigger: TEvent, transition: TransitionBase<TStateId>): void;
    public addTriggerTransition(trigger: TEvent, from: TStateId, to: TStateId, condition: (transition: Transition<TStateId>) => boolean, forceInstantly: boolean): void;
    public addTriggerTransition(...args: any[]): void {
        const trigger: TEvent = args.shift();
        if (args[0] instanceof TransitionBase) {
            this._addTriggerTransition(trigger, args[0]);
            return;
        }

        const [from, to, condition, forceInstantly] = args;
        this._addTriggerTransition(trigger, this.createOptimizedTransition(from, to, condition, forceInstantly));
    }
    private _addTriggerTransition(trigger: TEvent, transition: TransitionBase<TStateId>) {
        this.initTransition(transition);
        const bundle = this.getOrCreateStateBundle(transition.from);
        bundle.addTriggerTransition(trigger, transition);
    }

    public addTriggerTransitionFromAny(trigger: TEvent, transition: TransitionBase<TStateId>): void;
    public addTriggerTransitionFromAny(
        trigger: TEvent,
        from: TStateId,
        to: TStateId,
        condition: (transition: Transition<TStateId>) => boolean,
        forceInstantly: boolean
    ): void;
    public addTriggerTransitionFromAny(...args: any[]): void {
        const trigger: TEvent = args.shift();
        if (args[0] instanceof TransitionBase) {
            this._addTriggerTransitionFromAny(trigger, args[0]);
            return;
        }

        const [from, to, condition, forceInstantly] = args;
        this._addTriggerTransitionFromAny(trigger, this.createOptimizedTransition(from, to, condition, forceInstantly));
    }
    private _addTriggerTransitionFromAny(trigger: TEvent, transition: TransitionBase<TStateId>): void {
        this.initTransition(transition);
        if (!this.triggerTransitionsFromAny.has(trigger)) {
            this.triggerTransitionsFromAny.set(trigger, new Array<TransitionBase<TStateId>>());
        }
        this.triggerTransitionsFromAny.get(trigger).push(transition);
    }

    /**
     * 尝试触发事件
     * @param trigger 触发事件
     */
    private tryTrigger(trigger: TEvent): boolean {
        this.ensureIsInitializedFor("Checking all trigger transitions of the active state");

        if (this.triggerTransitionsFromAny.has(trigger)) {
            const triggerTransitions = this.triggerTransitionsFromAny.get(trigger);
            for (const transition of triggerTransitions) {
                if (this.activeState.name == transition.to) {
                    continue;
                }

                if (this.tryTransition(transition)) {
                    return true;
                }
            }
        }

        if (this.activeTriggerTransitions.has(trigger)) {
            const triggerTransitions = this.activeTriggerTransitions.get(trigger);
            for (const transition of triggerTransitions) {
                if (this.tryTransition(transition)) {
                    return true;
                }
            }
        }

        return false;
    }

    /**
     * 触发事件
     * @param trigger 事件
     */
    public trigger(trigger: TEvent): void {
        if (this.tryTrigger(trigger)) {
            return;
        }

        if (this.activeState["trigger"]) {
            this.activeState["trigger"](trigger);
        }
    }

    public triggerLocally(trigger: TEvent): void {
        this.tryTrigger(trigger);
    }

    public getState(name: TStateId): StateBase<TStateId> {
        if (!this.nameToStateBundle.has(name)) {
            throw new StateNotFoundException<TStateId>(name, "Getting a state");
        }

        return this.nameToStateBundle.get(name).state;
    }

    public onAction<TData>(trigger: TEvent, data?: TData): void {
        this.ensureIsInitializedFor("Running onAction of the active state");
        if (this.activeState["onAction"]) {
            this.activeState["onAction"](trigger, data);
        }
    }

    private createOptimizedTransition(from: TStateId, to: TStateId, condition: (transition: Transition<TStateId>) => boolean = null, forceInstantly: boolean = false) {
        if (condition == null) {
            return new TransitionBase<TStateId>(from, to, forceInstantly);
        }

        return new Transition<TStateId>(from, to, condition, forceInstantly);
    }
}

export class HybridStateMachine<TOwnId = string, TStateId = TOwnId, TEvent = string> extends StateMachine<TOwnId, TStateId, TEvent> {
    constructor(
        private _onEnter: (state: HybridStateMachine<TOwnId, TStateId, TEvent>) => void = null,
        private _onLogic: (state: HybridStateMachine<TOwnId, TStateId, TEvent>) => void = null,
        private _onExit: (state: HybridStateMachine<TOwnId, TStateId, TEvent>) => void = null,
        needsExitTime: boolean = false
    ) {
        super(needsExitTime);
    }

    public override onEnter(): void {
        super.onEnter();
        this.timer.reset();
        this._onEnter?.(this);
    }

    public override onLogic(): void {
        super.onLogic();
        this._onLogic?.(this);
    }

    public override onExit(): void {
        super.onExit();
        this._onExit?.(this);
    }
}
