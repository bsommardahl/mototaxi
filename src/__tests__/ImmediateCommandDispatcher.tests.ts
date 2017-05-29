// tslint:disable
import { ImmediateCommandDispatcher } from '../dispatchers/ImmediateCommandDispatcher';

describe('The Command Dispatcher', () => {
    describe('when setting up a command dispatcher for the first time', () => {
        const domainEvent = { type: 'puppyFlattened' };
        const command = { type: 'stepOnPuppy' };
        const fakeHandler = {
            type: command.type,
            handle: (command) => { return domainEvent },
        };
        const dispatcher = new ImmediateCommandDispatcher([ fakeHandler ]);
        it('should register domain events that come from command handlers', () => {
            const obs = dispatcher.dispatch(command);
            obs.subscribe((e) => {
                   expect(e).toEqual(domainEvent);
               });
        });
    });
    describe('when dispatching a command with a typeless handler', () => {
        const command = { type: 'killMickey' };
        const domainEvent = { type: 'mickeyDead' };
        const matchingHandler = {
            killMickey: jest.fn().mockReturnValue(domainEvent),
        };
            
        const dispatcher = new ImmediateCommandDispatcher([ matchingHandler ]);
        dispatcher.dispatch(command);
        it('should handle the command', () => {
            expect(matchingHandler.killMickey.mock.calls.length).toEqual(1);
        });
    });
    describe('when dispatching a single command with one handler', () => {
        const command = { type: 'killMickey' };
        const domainEvent = { type: 'mickeyDead' };

        describe('without subscribing', () => {
            const matchingHandler = {
                [command.type]: jest.fn().mockReturnValue(domainEvent),
            };
            const dispatcher = new ImmediateCommandDispatcher([ matchingHandler ]);
            dispatcher.dispatch(command);
            it('should handle the command', () => {
                expect(matchingHandler[command.type].mock.calls.length).toEqual(1);
            });
        });
        describe('and subscribing to the domain event once', () => {
            const matchingHandler = {
                [command.type]: jest.fn().mockReturnValue(domainEvent),
            };
            const dispatcher = new ImmediateCommandDispatcher([ matchingHandler ]);
            const observable = dispatcher.dispatch(command);
            it('should handle the command', () => {
                expect(matchingHandler[command.type].mock.calls.length).toEqual(1);
            });
            it('should subscribe to the domain event', () => {
                observable.subscribe((e) => {
                    expect(e).toEqual(domainEvent);
                });
            });
        });
        describe('and subscribing to the domain event multiple times`', () => {
            const matchingHandler = {
                [command.type]: jest.fn().mockReturnValue(domainEvent),
            };
            const dispatcher = new ImmediateCommandDispatcher([ matchingHandler ]);
            const obs = dispatcher.dispatch(command);
            obs.subscribe();
            obs.subscribe();
                
            it('should only handle the command once', () => {
                expect(matchingHandler[command.type].mock.calls.length).toEqual(1);
            });
        });
    });
    describe('when dispatching a single command with multiple handlers', () => {
        const command = { type: 'killMickey' };
        const domainEvent = { type: 'mickeyDead' };

        describe('without subscribing', () => {
            const handler1 = {
                [command.type]: jest.fn().mockReturnValue(domainEvent),
            };
            const handler2 = {
                [command.type]: jest.fn().mockReturnValue(domainEvent),
            };
            const dispatcher = new ImmediateCommandDispatcher([ handler1, handler2 ]);
            dispatcher.dispatch(command);
            it('should handle the command using all handlers', () => {
                expect(handler1[command.type].mock.calls.length).toEqual(1);
                expect(handler2[command.type].mock.calls.length).toEqual(1);
            });
        });
        describe('and subscribing to the domain event', () => {
            const handler1 = {
                [command.type]: jest.fn().mockReturnValue(domainEvent),
            };
            const handler2 = {
                [command.type]: jest.fn().mockReturnValue(domainEvent),
            };
            const dispatcher = new ImmediateCommandDispatcher([ handler1, handler2 ]);
            const observable = dispatcher.dispatch(command);
            it('should handle the command', () => {
                expect(handler1[command.type].mock.calls.length).toEqual(1);
                expect(handler2[command.type].mock.calls.length).toEqual(1);
            });
            it('should subscribe to the domain event', () => {
                observable.subscribe((e) => {
                    expect(e).toEqual(domainEvent);
                });
            });
        });
    });
});
