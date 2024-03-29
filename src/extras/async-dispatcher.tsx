const asyncDispatchMiddleware =
  (store: any) => (next: any) => (action: any) => {
    let syncActivityFinished = false;
    let actionQueue: any[] = [];

    function flushQueue() {
      actionQueue.forEach((a) => store.dispatch(a)); // flush queue
      actionQueue = [];
    }

    function asyncDispatch(asyncAction: any) {
      actionQueue = actionQueue.concat([asyncAction]);

      if (syncActivityFinished) {
        flushQueue();
      }
    }

    const actionWithAsyncDispatch = Object.assign({}, action, {
      asyncDispatch,
    });

    const res = next(actionWithAsyncDispatch);

    syncActivityFinished = true;
    flushQueue();

    return res;
  };

export default asyncDispatchMiddleware;
