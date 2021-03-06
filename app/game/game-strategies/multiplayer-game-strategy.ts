import Transport from "../services/transport"
import {GameStrategy, TURN_ENDING_EVENTS} from "./game-strategy"
import {FieldState, } from "../utils/field-state"
import EventBus from "../../modules/event-bus"
import EVENTS from "../utils/events"

export default class MultiPlayerGameStrategy {
    private transport: Transport;
    private gameStrategy: GameStrategy;
    private fieldState: FieldState;
    private fieldDimension: number;
    private eventBus: EventBus;

    constructor() {
        this.transport = new Transport;
        this.gameStrategy = new GameStrategy;
        this.fieldDimension = parseInt(window.sessionStorage["fieldDimension"]);
        this.fieldState = new FieldState(this.fieldDimension);
        this.eventBus = new EventBus;

        this.gameStrategy.fieldState = this.fieldState;
        this.transport.sendMessage(JSON.stringify({
            class: "JoinGame"
        }));

        this.eventBus.on(EVENTS.GAME_STARTED, this.onGameStarted.bind(this));
        this.eventBus.on(EVENTS.TURN_ENDED, this.onTurnEnded.bind(this));
        this.eventBus.on(EVENTS.YOUR_TURN, () => {
            this.gameStrategy.emitTurnBegan();
        });

        this.eventBus.emit(EVENTS.MULTIPLAYER);
    }

    private onGameStarted(data): void {
        if (data.isFirst) {
            alert("Вы ходите первым");
            this.gameStrategy.emitTurnBegan();
        } else {
            alert("Вы ходите вторым");
        }
    }

    private onTurnEnded(data): void {
        if (data.event === TURN_ENDING_EVENTS.FIGURE_MOVED) {
            this.transport.sendPoints([data.point]);
        } else if (data.event === TURN_ENDING_EVENTS.WALL_PLACED) {
            this.transport.sendPoints([data.upperOrLeft, data.lowerOrRight]);
        }
    }
}