import fs from 'fs';

export class Configuration {
    public url: string;
    public country: string;
    public state: string;
    public city: string;
    public department: string;

    constructor() {
        this.url = '';
        this.country = '';
        this.state = '';
        this.city = '';
        this.department = '';
    }

    static fromPath(configPath: string): Configuration {
        const configBuffer = fs.readFileSync(configPath);
        const config: Configuration = JSON.parse(configBuffer.toString());

        return config;
    }
}
