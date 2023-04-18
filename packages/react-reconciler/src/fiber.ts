import { Props, Key, Ref, ReactElement } from 'shared/ReactTypes';
import { FunctionCoponent, HostComponent, WorkTag } from './workTags';
import { NoFlags } from './fiberFlags';
import { Container } from 'hostConfig';

export class FiberNode {
	tag: WorkTag;
	key: Key;
	stateNode: any;
	type: any;
	pendingProps: Props;
	memoizedProps: Props | null;
	memoizedState: any;

	return: FiberNode | null;
	sibling: FiberNode | null;
	child: FiberNode | null;
	index: number;

	ref: Ref;

	alternate: FiberNode | null;

	updateQueue: unknown;

	flags: number;
	constructor(tag: WorkTag, pendingProps: Props, key: Key) {
		// 实例
		this.tag = tag;
		this.key = key;
		// 指向真实DOM
		this.stateNode = null;
		this.type = null;

		// 构成树状结构
		this.return = null; // 父节点
		this.sibling = null; // 指向右边的兄弟
		this.child = null;
		this.index = 0;

		this.ref = null;

		// 作为工作单元
		this.pendingProps = pendingProps;
		this.memoizedProps = null;
		this.memoizedState = null;
		this.updateQueue = null;

		this.alternate = null;

		// 副作用
		this.flags = NoFlags;
	}
}

export class FiberRootNode {
	container: Container;
	current: FiberNode;
	finishedWork: FiberNode | null;
	constructor(container: Container, hostRootFiber: FiberNode) {
		this.container = container;
		this.current = hostRootFiber;
		hostRootFiber.stateNode = this;
		this.finishedWork = null;
	}
}

export const createWorkInProgress = (
	current: FiberNode,
	pendingProps: Props
): FiberNode => {
	let wip = current.alternate;
	if (wip === null) {
		// 对应mount 初次加载的情况下没有对应的双缓存
		wip = new FiberNode(current.tag, pendingProps, current.key);

		wip.stateNode = current.stateNode;
		wip.alternate = current;
		current.alternate = wip;
	} else {
		// update
		wip.pendingProps = pendingProps;

		wip.flags = NoFlags;
	}
	wip.type = current.type;
	wip.updateQueue = current.updateQueue;
	wip.child = current.child;
	wip.memoizedState = current.memoizedState;
	wip.memoizedProps = current.memoizedProps;
	return wip;
};

export function createFiberFromElement(element: ReactElement) {
	const { type, key, props } = element;
	let fiberTag: WorkTag = FunctionCoponent;

	if (typeof type === 'string') {
		fiberTag = HostComponent;
	} else if (typeof type !== 'function' && __DEV_) {
		console.warn('未定义的type类型');
	}

	const fiber = new FiberNode(fiberTag, props, key);
	fiber.type = type;
	return fiber;
}
