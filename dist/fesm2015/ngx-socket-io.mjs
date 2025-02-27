import * as i0 from '@angular/core';
import { InjectionToken, NgModule } from '@angular/core';
import { Observable } from 'rxjs';
import { share } from 'rxjs/operators';
import * as io from 'socket.io-client';

class WrappedSocket {
    constructor(config) {
        this.config = config;
        this.subscribersCounter = {};
        this.eventObservables$ = {};
        this.emptyConfig = {
            url: '',
            options: {},
        };
        if (config === undefined) {
            config = this.emptyConfig;
        }
        const url = config.url;
        const options = config.options;
        const ioFunc = io.default ? io.default : io;
        this.ioSocket = ioFunc(url, options);
    }
    of(namespace) {
        this.ioSocket.of(namespace);
    }
    on(eventName, callback) {
        this.ioSocket.on(eventName, callback);
    }
    once(eventName, callback) {
        this.ioSocket.once(eventName, callback);
    }
    connect() {
        return this.ioSocket.connect();
    }
    disconnect(_close) {
        return this.ioSocket.disconnect.apply(this.ioSocket, arguments);
    }
    emit(_eventName, ..._args) {
        return this.ioSocket.emit.apply(this.ioSocket, arguments);
    }
    removeListener(_eventName, _callback) {
        return this.ioSocket.removeListener.apply(this.ioSocket, arguments);
    }
    removeAllListeners(_eventName) {
        return this.ioSocket.removeAllListeners.apply(this.ioSocket, arguments);
    }
    fromEvent(eventName) {
        if (!this.subscribersCounter[eventName]) {
            this.subscribersCounter[eventName] = 0;
        }
        this.subscribersCounter[eventName]++;
        if (!this.eventObservables$[eventName]) {
            this.eventObservables$[eventName] = new Observable((observer) => {
                const listener = (data) => {
                    observer.next(data);
                };
                this.ioSocket.on(eventName, listener);
                return () => {
                    this.subscribersCounter[eventName]--;
                    if (this.subscribersCounter[eventName] === 0) {
                        this.ioSocket.removeListener(eventName, listener);
                        delete this.eventObservables$[eventName];
                    }
                };
            }).pipe(share());
        }
        return this.eventObservables$[eventName];
    }
    fromOneTimeEvent(eventName) {
        return new Promise(resolve => this.once(eventName, resolve));
    }
}

/** Socket factory */
function SocketFactory(config) {
    return new WrappedSocket(config);
}
const SOCKET_CONFIG_TOKEN = new InjectionToken('__SOCKET_IO_CONFIG__');
class SocketIoModule {
    static forRoot(config) {
        return {
            ngModule: SocketIoModule,
            providers: [
                { provide: SOCKET_CONFIG_TOKEN, useValue: config },
                {
                    provide: WrappedSocket,
                    useFactory: SocketFactory,
                    deps: [SOCKET_CONFIG_TOKEN],
                },
            ],
        };
    }
}
SocketIoModule.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "13.3.12", ngImport: i0, type: SocketIoModule, deps: [], target: i0.ɵɵFactoryTarget.NgModule });
SocketIoModule.ɵmod = i0.ɵɵngDeclareNgModule({ minVersion: "12.0.0", version: "13.3.12", ngImport: i0, type: SocketIoModule });
SocketIoModule.ɵinj = i0.ɵɵngDeclareInjector({ minVersion: "12.0.0", version: "13.3.12", ngImport: i0, type: SocketIoModule });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "13.3.12", ngImport: i0, type: SocketIoModule, decorators: [{
            type: NgModule,
            args: [{}]
        }] });

/**
 * Generated bundle index. Do not edit.
 */

export { WrappedSocket as Socket, SocketIoModule };
//# sourceMappingURL=ngx-socket-io.mjs.map
