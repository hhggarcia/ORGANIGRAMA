import { IEventSystem } from "../../ts-common/events";
import { View } from "../../ts-common/view";
import { Exporter } from "./helpers/Export";
import { Selection } from "./helpers/Selection";
import { ShapesCollection } from "./ShapesCollection";
import { Toolbar } from "./Toolbar";
import { DataEvents, DiagramEvents, ICoords, IDiagram, IDiagramConfig, IBaseShape, SelectionEvents, IDiagramEventHandlersMap, ICustomShapeParam, IAutoPlacement, TreeDirection, IBaseCoords } from "./types";
import { Id, ISelectionEventsHandlersMap } from "../../ts-common/types";
import { Editor, EditorEvents } from "./helpers/Editor";
import { CellManager, CellManagerEvents, ICellManagerHandlersMap } from "./helpers/CellManager";
import { IDataItem } from "../../ts-data";
export declare class Diagram extends View implements IDiagram {
    version: string;
    config: IDiagramConfig;
    events: IEventSystem<DataEvents | SelectionEvents | DiagramEvents | EditorEvents | CellManagerEvents, IDiagramEventHandlersMap | ICellManagerHandlersMap | ISelectionEventsHandlersMap>;
    data: ShapesCollection;
    selection: Selection;
    export: Exporter;
    toolbar: Toolbar;
    flowShapes: any;
    editor: Editor;
    cellManager: CellManager;
    _lastItemClickCoords: IBaseCoords;
    private _htmlevents;
    private _diagramSize;
    private _active;
    private _orgTypes;
    private _menu;
    private _backgroundPos;
    constructor(container: HTMLElement | any, config?: IDiagramConfig);
    addShape(type: string, parameters: ICustomShapeParam): void;
    locate(event: Event): IBaseShape;
    collapseItem(id: Id, dir?: TreeDirection): void;
    expandItem(id: Id, dir?: TreeDirection): void;
    getScrollState(): ICoords;
    scrollTo(x: number, y: number): void;
    showItem(id: Id, dir?: TreeDirection): void;
    autoPlace(config?: IAutoPlacement): void;
    getCurrentCoords(event: PointerEvent): IBaseCoords;
    findNearestConnector(event: PointerEvent): IDataItem;
    destructor(): void;
    protected _render(vm: any): any;
    protected _set_defaults(): void;
    protected _initEventsHandlers(): void;
    protected _init_struct(): void;
    protected _initEvents(): void;
    private _getContent;
    private _getPoint;
    private _getBackground;
}
