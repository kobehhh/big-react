export type WorkTag =
	| typeof FunctionCoponent
	| typeof HostRoot
	| typeof HostComponent
	| typeof HostText;

export const FunctionCoponent = 0;
export const HostRoot = 3;

// 原生标签
export const HostComponent = 5;

// 文本
export const HostText = 6;
