import helmet from 'helmet';

type ReadonlyOptions = NonNullable<Parameters<typeof helmet>[0]>;

type HelmetOptions = { -readonly [P in keyof ReadonlyOptions]: ReadonlyOptions[P] };

export default HelmetOptions;
