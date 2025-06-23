import { AppRouter } from '../../../alarm-app/server/routers/_app';
import type { inferRouterInputs, inferRouterOutputs } from '@trpc/server';
import { createTRPCReact } from '@trpc/react-query';

// @ts-expect-error
export const trpc = createTRPCReact<AppRouter>();

// @ts-expect-error
export type RouterInput = inferRouterInputs<AppRouter>;

// @ts-expect-error
export type RouterOutput = inferRouterOutputs<AppRouter>;
