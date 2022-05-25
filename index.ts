class Ioc {
    factories: Record<string, Function> = {};
    called = new Set();

    bind = (name: string, factory: Function) => {
        if (this.factories[name]) {
            throw new Error(`${name} is already bound`);
        }

        this.factories[name] = factory;
    }

    use = (name: string, ...rest: any[]) => {
        if (this.called.has(name)) {
            throw new Error('circular dependency detected');
        }

        this.called.add(name);
        const instance = this.factories[name](this, ...rest);
        this.called.delete(name);

        return instance;
    }

    reset = () => {
        this.factories = {};
    }
}

export default new Ioc();