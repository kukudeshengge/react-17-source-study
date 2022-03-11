/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * @flow
 */

import {enableProfilerTimer} from 'shared/ReactFeatureFlags';

import type {Fiber, FiberRoot, ReactPriorityLevel} from './ReactInternalTypes';
import type {ReactNodeList} from 'shared/ReactTypes';

import {DidCapture} from './ReactFiberFlags';
import { enableLog } from 'shared/ReactFeatureFlags';
declare var __REACT_DEVTOOLS_GLOBAL_HOOK__: Object | void;

let rendererID = null;
let injectedHook = null;

export const isDevToolsPresent =
  typeof __REACT_DEVTOOLS_GLOBAL_HOOK__ !== 'undefined';

export function injectInternals(internals: Object): boolean {
  if (typeof __REACT_DEVTOOLS_GLOBAL_HOOK__ === 'undefined') {
    // No DevTools
    return false;
  }
  const hook = __REACT_DEVTOOLS_GLOBAL_HOOK__;
  if (hook.isDisabled) {
    // This isn't a real property on the hook, but it can be set to opt out
    // of DevTools integration and associated warnings and logs.
    // https://github.com/facebook/react/issues/3877
    return true;
  }
  if (!hook.supportsFiber) {

    // DevTools exists, even though it doesn't support Fiber.
    return true;
  }
  try {
    rendererID = hook.inject(internals);
    // We have successfully injected, so now it is safe to set up hooks.
    injectedHook = hook;
  } catch (err) {
    // Catch all errors because it is unsafe to throw during initialization.

  }
  // DevTools exists
  return true;
}



export function onCommitRoot(
  root: FiberRoot,
  priorityLevel: ReactPriorityLevel,
) {
  enableLog && console.log('onCommitRoot start')
  if (!__LOG_NAMES__.length || __LOG_NAMES__.includes('onCommitRoot')) debugger
  if (injectedHook && typeof injectedHook.onCommitFiberRoot === 'function') {
    try {
      // DidCapture === 0b0000000000,0100,0000;
      const didError = (root.current.flags & DidCapture) === DidCapture;
      if (enableProfilerTimer) {
        injectedHook.onCommitFiberRoot(
          rendererID,
          root,
          priorityLevel,
          didError,
        );
      } else {
        injectedHook.onCommitFiberRoot(rendererID, root, undefined, didError);
      }
    } catch (err) {

    }
  }
  enableLog && console.log('onCommitRoot end')
}

export function onCommitUnmount(fiber: Fiber) {
  if (injectedHook && typeof injectedHook.onCommitFiberUnmount === 'function') {
    try {
      injectedHook.onCommitFiberUnmount(rendererID, fiber);
    } catch (err) {

    }
  }
}
