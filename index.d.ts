export declare class LchColorWheel {
    readonly options: Readonly<Partial<typeof LchColorWheel.defaultOptions> & {
        appendTo: HTMLElement;
    }>;
    static defaultOptions: {
        wheelDiameter: number;
        wheelThickness: number;
        handleDiameter: number;
        drawsRgbValidityBoundary: boolean;
        maxChroma: number;
        onChange: (lchColorWheel: LchColorWheel) => unknown;
    };
    wheelDiameter: number;
    wheelThickness: number;
    handleDiameter: number;
    drawsRgbValidityBoundary: boolean;
    readonly maxChroma: number;
    onChange: (lchColorWheel: LchColorWheel) => unknown;
    readonly rootElement: HTMLDivElement;
    readonly hueWheelElement: HTMLCanvasElement;
    readonly hueHandleElement: HTMLDivElement;
    readonly lcSpaceElement: HTMLCanvasElement;
    readonly lcHandleElement: HTMLDivElement;
    private _rgb;
    private _lch;
    get lch(): [number, number, number];
    set lch(lch: [number, number, number]);
    get rgb(): [number, number, number];
    set rgb(rgb: [number, number, number]);
    constructor(options: Readonly<Partial<typeof LchColorWheel.defaultOptions> & {
        appendTo: HTMLElement;
    }>);
    private _setLch;
    redraw(): void;
    private _redrawHueWheel;
    private _redrawHueHandle;
    private _redrawLcSpace;
    private _redrawLcHandle;
    private _requestRedrawLcSpace_;
    private _requestRedrawLcSpace;
}
