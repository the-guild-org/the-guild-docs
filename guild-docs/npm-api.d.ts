declare module 'npm-api' {
  import * as request from 'request';
  import * as through from 'through';
  import * as url from 'url';

  // TODO: Should we use types from existing package like `package-json`?
  // `npm-api` currently assumes that the response from the registry is a
  // `package.json`-like object, but does not enforce this.
  type PackageJson = {
    name: string;
    version: string;
  } & Record<string, unknown>;
  type PackageJsonDependencies = unknown;

  class List {
    constructor(name: string, view: View);

    query(params?: url.URLFormatOptions): Promise<request.Response>;
    url(query?: url.URLFormatOptions): string;
  }

  class View {
    constructor(name: string);

    query(params?: url.URLFormatOptions): Promise<(Buffer | string)[]>;
    stream(params?: url.URLFormatOptions): through.ThroughStream;
    url(query?: url.URLFormatOptions): string;
  }

  class Repo {
    constructor(name: string);

    package(version?: string): Promise<PackageJson>;
    version(version: string): Promise<PackageJson>;
    dependencies(version: string): PackageJsonDependencies;
    devDependencies(version: string): PackageJsonDependencies;
    prop(prop: string, version?: string): unknown;
  }

  class Maintainer {
    constructor(name: string);

    repos(): Promise<string[]>;
  }

  class NpmApi {
    List: typeof List;
    View: typeof View;
    Repo: typeof Repo;
    Maintainer: typeof Maintainer;

    // TODO: What is the type of options? As far as I can tell, it's only used when
    // calling the function returned from lib/plugins/downloads, which has 0 arguments.
    constructor(options?: unknown);

    // TODO: Confirm with package author that `reset` and `use` are not intended for public consumption.
    // reset(): void
    // use(fn: unknown): void

    view(name: string): View;

    list(name: string, view: string | View): List;

    repo(name: string): Repo;

    maintainer(name: string): Maintainer;
  }

  export = NpmApi;
}
