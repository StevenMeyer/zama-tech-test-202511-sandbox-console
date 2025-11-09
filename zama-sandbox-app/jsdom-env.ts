import JSDOMEnvironment from 'jest-environment-jsdom';
import { EnvironmentContext, JestEnvironmentConfig } from '@jest/environment';
import fetch, { Request } from 'node-fetch';

class FixedJSDOMEnvironment extends JSDOMEnvironment {
    constructor(config: JestEnvironmentConfig, context: EnvironmentContext) {
        super(config, context)
        /**
         * @note Opt-out from JSDOM using browser-style resolution
         * for dependencies. This is simply incorrect, as JSDOM is
         * not a browser, and loading browser-oriented bundles in
         * Node.js will break things.
         *
         * Consider migrating to a more modern test runner if you
         * don't want to deal with this.
         */
        this.customExportConditions = [''];

        setIfNonDefined.call(this, 'TextDecoder', TextDecoder)
        setIfNonDefined.call(this, 'TextEncoder', TextEncoder)
        setIfNonDefined.call(this, 'TextDecoderStream', TextDecoderStream)
        setIfNonDefined.call(this, 'TextEncoderStream', TextEncoderStream)
        setIfNonDefined.call(this, 'ReadableStream', ReadableStream)

        setIfNonDefined.call(this, 'Blob', Blob)
        setIfNonDefined.call(this, 'Headers', Headers)
        setIfNonDefined.call(this, 'FormData', FormData)
        setIfNonDefined.call(this, 'Request', Request)
        setIfNonDefined.call(this, 'Response', Response)
        setIfNonDefined.call(this, 'fetch', fetch)
        setIfNonDefined.call(this, 'structuredClone', structuredClone)
        setIfNonDefined.call(this, 'URL', URL)
        setIfNonDefined.call(this, 'URLSearchParams', URLSearchParams)

        setIfNonDefined.call(this, 'BroadcastChannel', BroadcastChannel)
        setIfNonDefined.call(this, 'TransformStream', TransformStream)
        setIfNonDefined.call(this, 'fetch', fetch);
    }
}

function setIfNonDefined(this: FixedJSDOMEnvironment, key: string, value: unknown) {
	if (!this.global[key]) {
		this.global[key] = value
	}
}

export default FixedJSDOMEnvironment;