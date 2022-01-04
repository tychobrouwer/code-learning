type GetWindowStateResult = overwolf.windows.GetWindowStateResult;
type OwWindowInfo = overwolf.windows.WindowInfo;
export class OWWindow {
    private _name: string | null;
    private _id: string | null;

    constructor(name: string | null = null) {
        this._name = name;
        this._id = null;
    }

    public async restore(): Promise<void> {
        let that = this;

        console.log('window: restored');

        return new Promise<void>(async (resolve) => {
            await that.assureObtained();
            let id: string = <string>that._id;

            overwolf.windows.restore(id, result => {
                if (!result.success)
                    console.error(`[restore] - an error occurred, windowId=${id}, reason=${result.error}`);

                resolve();
            })
        })
    }

    public async minimize(): Promise<void> {
        let that = this;

        console.log('window: minimized');

        return new Promise<void>(async resolve => {
            await that.assureObtained();
            let id: string = <string>that._id;

            overwolf.windows.minimize(id, () => { });
            return resolve();
        })
    }

    public async bringToFront(): Promise<void> {
        let that = this;

        console.log('window: minimized');

        return new Promise<void>(async resolve => {
            await that.assureObtained();
            let id: string = <string>that._id;

            overwolf.windows.bringToFront(id, true, () => { });
            return resolve();
        })
    }

    public async maximize(): Promise<void> {
        let that = this;

        console.log('window: maximized');

        return new Promise<void>(async resolve => {
            await that.assureObtained();
            let id: string = <string>that._id;
            overwolf.windows.maximize(id, () => { });
            return resolve();
        })
    }

    public async hide(): Promise<void> {
        let that = this;

        console.log('window: hidden');

        return new Promise<void>(async resolve => {
            await that.assureObtained();
            let id: string = <string>that._id;
            overwolf.windows.hide(id, () => { });
            return resolve();
        })
    }

    public async close() {
        let that = this;

        return new Promise(async resolve => {
            await that.assureObtained();
            let id: string = <string>that._id;

            const result = await this.getWindowState();
            if (!result.success) {
                console.error(result);
            }
            if (result.success && (result.window_state !== 'closed')) {
                await this.internalClose();
            }

            return resolve();
        })
    }

    public async changeWindowSize(windowId, width, height) {
        overwolf.windows.changeSize(windowId, width, height, (result) => {
            if (!result.success)
                console.error(result);
        })
    }

    public async changeWindowLocation(mode, windowId) {
        overwolf.windows.getCurrentWindow((result) => {
            if (!result.success)
                console.error(result);

            let windowWidth = result.window.width;
            let windowHeight = result.window.height;

            overwolf.utils.getMonitorsList((monitorRes) => {
                if (!result.success)
                    console.error(result);

                let monitorId: string = JSON.parse(localStorage.settings).monitorId;

                let monitorWidth = monitorRes.displays[monitorId].width;
                let monitorHeight = monitorRes.displays[monitorId].height;
                let left: number;
                let top: number;

                if (mode === 'center-center') {
                    left = monitorWidth / 2 - (windowWidth / 2);
                    top = monitorHeight / 2 - (windowHeight / 2);
                } else if (mode === 'center-right') {
                    left = (monitorWidth - windowWidth) - 20;
                    top = monitorHeight / 2 - (windowHeight / 2);
                } else if (mode === 'center-left') {
                    left = 20;
                    top = monitorHeight / 2 - (windowHeight / 2);
                }

                overwolf.windows.changePosition(windowId, Math.round(left), Math.round(top), (result) => {
                    if (!result.success)
                        console.error(result);
                })
            })
        })
    }

    public async scaleWindow(windowId, width, height, scale): Promise<void> {
        const that: any = this;

        return new Promise<void>(async resolve => {
            const newWidth = Math.round(width * scale);
            const newHeight = Math.round(height * scale);

            that.changeWindowSize(windowId, newWidth, newHeight);
            document.getElementsByTagName('main')[0].style.transform = `scale(${scale})`;

            if (windowId === 'in_game' || windowId === 'in_game_desktop_only') {
                document.getElementsByTagName('main')[0].style.width = `${Math.ceil(100 / scale * 10) / 10}%`;
                document.getElementsByTagName('main')[0].style.height = `calc(${Math.ceil(100 / scale * 10) / 10}% - 32px)`;
            } else if (windowId === 'in_lobby' || windowId === 'in_lobby_desktop_only') {
                document.getElementsByTagName('main')[0].style.width = `${Math.ceil(100 / scale * 10) / 10}%`;
                document.getElementsByTagName('main')[0].style.height = `calc(${Math.ceil(100 / scale * 10) / 10}% - 32px)`;
                (document.querySelector('#in-lobby .ad-lobby') as HTMLElement).style.bottom = `${Math.ceil(Math.pow(scale, -4) * 7 * 100) / 100}px`;
            } else {
                document.getElementsByTagName('main')[0].style.width = `${Math.ceil(100 / scale * 10) / 10}%`;
                document.getElementsByTagName('main')[0].style.height = `${Math.ceil(100 / scale * 10) / 10}%`;
            }

            if (windowId === 'in_lobby' || windowId === 'in_lobby_desktop_only') {
                if (scale <= 0.6) {
                    document.getElementById('shortcut-text').style.display = 'none';
                } else {
                    document.getElementById('shortcut-text').style.display = 'block';
                }
            }

            resolve();
        })
    }

    public dragMove(elem: HTMLElement) {
        elem.onmousedown = e => {
            e.preventDefault();
            overwolf.windows.dragMove(this._name);
        }
    }

    public async getMonitorsList(): Promise<any> {
        return new Promise<any>(async resolve => {
            overwolf.utils.getMonitorsList(data => {
                resolve(data);
            })
        })
    }

    public async getWindowState(): Promise<GetWindowStateResult> {
        let that = this;

        return new Promise<GetWindowStateResult>(async resolve => {
            await that.assureObtained();
            let id: string = <string>that._id;
            overwolf.windows.getWindowState(id, resolve);
        })
    }

    public static async getCurrentInfo(): Promise<OwWindowInfo> {
        return new Promise<OwWindowInfo>(async resolve => {
            overwolf.windows.getCurrentWindow(result => {
                resolve(result.window);
            })
        })
    }

    private obtain(): Promise<OwWindowInfo | null> {
        return new Promise((resolve, reject) => {
            const cb = res => {
                if (res && res.status === 'success' && res.window && res.window.id) {
                    this._id = res.window.id;

                    if (!this._name) {
                        this._name = res.window.name;
                    }

                    resolve(res.window);
                } else {
                    this._id = null;
                    reject();
                }
            };

            if (!this._name) {
                overwolf.windows.getCurrentWindow(cb);
            } else {
                overwolf.windows.obtainDeclaredWindow(this._name, cb);
            }
        })
    }

    private async assureObtained(): Promise<void> {
        let that = this;
        return new Promise<void>(async resolve => {
            await that.obtain();
            return resolve();
        })
    }

    private async internalClose(): Promise<void> {
        let that = this;

        return new Promise<void>(async (resolve, reject) => {
            await that.assureObtained();
            let id: string = <string>that._id;

            overwolf.windows.close(id, res => {
                if (res && res.success)
                    resolve();
                else
                    reject(res);
            })
        })
    }
}