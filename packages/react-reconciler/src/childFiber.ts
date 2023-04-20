import { ReactElement } from 'shared/ReactTypes';
import { FiberNode, createFiberFromElement } from './fiber';
import { REACT_ELEMENT_TYPE } from 'shared/ReactSymbols';
import { HostText } from './workTags';
import { Placement } from './fiberFlags';

function ChildReconciler(shouldTrack: boolean) {
	function reconcileSingleElement(
		retrunFiber: FiberNode,
		currentFiber: FiberNode | null,
		element: ReactElement
	) {
		const fiber = createFiberFromElement(element);
		fiber.return = retrunFiber;
		return fiber;
	}

	function reconcileSingTextNode(
		retrunFiber: FiberNode,
		currentFiber: FiberNode | null,
		content: string | number
	) {
		const fiber = new FiberNode(HostText, { content }, null);
		fiber.return = retrunFiber;
		return fiber;
	}

	function placeSingleChild(fiber: FiberNode) {
		if (shouldTrack && fiber.alternate === null) {
			fiber.flags |= Placement;
		}
		return fiber;
	}

	return function reconcileChildFibers(
		returnFiber: FiberNode,
		currentFiber: FiberNode | null,
		newChild?: ReactElement
	) {
		// 判断当前fiber的类型
		if (typeof newChild === 'object' && newChild !== null) {
			switch (newChild.$$typeof) {
				case REACT_ELEMENT_TYPE:
					return placeSingleChild(
						reconcileSingleElement(returnFiber, currentFiber, newChild)
					);

				default:
					if (__DEV_) {
						console.warn('未实现的reconcile类型', newChild);
					}
					break;
			}
		}
		// TODO 多借点的情况 ul>li*3

		if (typeof newChild === 'string' || typeof newChild === 'number') {
			return placeSingleChild(
				reconcileSingTextNode(returnFiber, currentFiber, newChild)
			);
		}

		if (__DEV_) {
			console.warn('未实现的reconcile类型', newChild);
		}

		return null;
	};
}

export const reconcileChildFibers = ChildReconciler(true);
export const mountChildFibers = ChildReconciler(false);
