import type { ModuleRunner } from '../runner'
import { interceptStackTrace } from './interceptor'

export function enableSourceMapSupport(runner: ModuleRunner): () => void {
  if (runner.options.sourcemapInterceptor === 'node') {
    if (typeof process === 'undefined') {
      throw new TypeError(
        `Cannot use "sourcemapInterceptor: 'node'" because global "process" variable is not available.`,
      )
    }
    if (typeof process.setSourceMapsEnabled !== 'function') {
      throw new TypeError(
        `Cannot use "sourcemapInterceptor: 'node'" because "process.setSourceMapsEnabled" function is not available. Please use Node >= 16.6.0.`,
      )
    }
    const isEnabledAlready = process.sourceMapsEnabled ?? false
    process.setSourceMapsEnabled(true)
    return () => !isEnabledAlready && process.setSourceMapsEnabled(false)
  }
  return interceptStackTrace(
    runner,
    typeof runner.options.sourcemapInterceptor === 'object'
      ? runner.options.sourcemapInterceptor
      : undefined,
  )
}