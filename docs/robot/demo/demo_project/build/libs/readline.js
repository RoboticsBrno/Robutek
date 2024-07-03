import { stdout, stdin } from "stdio";
/**
 * A class for reading standard input line by line.
 */
export class readline {
    onGet(str) {
        if (this.echo) {
            stdout.write(str);
        }
        if (str == "\n") {
            if (this.resolve) {
                this.resolve(this.buffer);
            }
            this.buffer = "";
            this.promise = null;
            this.resolve = null;
            this.reject = null;
            return;
        }
        this.buffer += str;
        if (!this.closed) {
            stdin.get()
                .then((data) => this.onGet(data))
                .catch((reason) => {
                if (this.reject) {
                    this.reject(reason);
                }
            });
        }
    }
    constructor(echo = false) {
        this.buffer = "";
        this.promise = null;
        this.resolve = null;
        this.reject = null;
        this.closed = false;
        this.echo = echo;
    }
    read() {
        if (this.promise != null) {
            return Promise.reject("Already reading");
        }
        this.promise = new Promise((resolve, reject) => {
            this.resolve = resolve;
            this.reject = reject;
        });
        stdin.get()
            .then((data) => this.onGet(data))
            .catch((reason) => {
            if (this.reject) {
                this.reject(reason);
            }
        });
        return this.promise;
    }
    close() {
        this.closed = true;
        if (this.reject) {
            this.reject("Stopped");
        }
        this.buffer = "";
        this.promise = null;
        this.resolve = null;
        this.reject = null;
    }
}
