import * as fs from 'fs';

export class Configuration {
    public url: string;
    public country: string;
    public state: string;
    public city: string;
    public department: string;

    constructor() {}

    static fromPath(configPath: string): Configuration {
        const configBuffer = fs.readFileSync(configPath);
        const config: Configuration = JSON.parse(configBuffer.toString());

        return config;
    }
}