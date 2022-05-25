import ioc from './index';


describe('IoC', () => {
    afterEach(() => {
        ioc.reset();
    })

    test('should use correct instance after binding', () => {
        class MyModule {}

        ioc.bind('myModule', () => {
            return new MyModule();
        });

        const myModule = ioc.use('myModule');

        expect(myModule).toBeInstanceOf(MyModule);
    });

    test('should pass container and additional paramaters', () => {
        class MyModule {
            container;
            rest;

            constructor(container: any, ...rest: any[]) {
                this.container = container;
                this.rest = rest;
            }

            getContainer = () => this.container;
            getRest = () => this.rest;
        }

        ioc.bind('myModule', (container: any, ...rest: any[]) => {
            return new MyModule(container, ...rest);
        });

        const myModule = ioc.use('myModule', 1, 2, 3);

        expect(myModule.getContainer()).toBe(ioc);
        expect(myModule.getRest()).toEqual([1, 2, 3])
    });

    test('should throw when namespace is already in use', () => {
        class MyModule {}

        ioc.bind('myModule', () => {
            return new MyModule();
        });

        expect(() => {
            ioc.bind('myModule', () => {})
        }).toThrow('myModule is already bound');
    });

    test('should for circular dependencies', () => {
        class Module {}

        ioc.bind('myModule', () => {
            ioc.use('anotherModule');
            return new Module();
        });

        ioc.bind('anotherModule', () => {
            ioc.use('myModule');
            return new Module();
        })

        expect(() => {
            ioc.use('anotherModule')
        }).toThrow('circular dependency detected');
    });

    test('reset should clear all bindings', () => {
        class MyModule {}

        ioc.bind('myModule', () => {
            return new MyModule();
        });

        ioc.reset();

        expect(() => {
            ioc.bind('myModule', () => {});
        }).not.toThrow();
    });
});