export interface Credentials {
    username: string;
    password: string;
}

export interface DatabaseScope {
    namespace: string;
    database: string;
}

export interface EndpointConfig {
    protocol: "ws" | "wss" | "http" | "https" | undefined;
    host: string;
    port: number | undefined;
}

export interface ConnectionConfig {
    credentials: Credentials,
    scope: DatabaseScope,
    endpoint: EndpointConfig,
}

export interface SurrealQueryResult<T> {
    time: string;
    status: string;
    result: T;
}