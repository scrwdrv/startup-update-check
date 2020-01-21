export default function checkUpdate(options: string | {
    name: string;
    version: string;
}): Promise<string | void>;
