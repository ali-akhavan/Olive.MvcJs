import { ModalHelper } from 'olive/components/modal';
import Waiting from 'olive/components/waiting';
import { ServiceContainer } from "./di/serviceContainer";
export default class OlivePage {
    private services;
    modalHelper: ModalHelper;
    waiting: typeof Waiting;
    constructor();
    protected initializeServices(): void;
    protected configureServices(services: ServiceContainer): void;
    private fixAlertIssues;
    protected _initializeActions: any[];
    protected onInit(action: any): void;
    protected _preInitializeActions: any[];
    protected onPreInit(action: any): void;
    protected onViewChanged(container?: JQuery, trigger?: any, newPage?: boolean, firstTime?: boolean): void;
    protected initialize(): void;
    protected enableCustomCheckbox(): void;
    protected enableCustomRadio(): void;
    protected goBack(target: any): boolean;
    protected customizeValidationTooltip(): void;
    protected refresh(keepScroll?: boolean): boolean;
    private getService;
}
