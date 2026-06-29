import fs from "fs";
import path from "path";
import yaml from "yaml";
import { BrokerSchema } from "../../src/types";

export class BrokerSchemaLoader {
  private cache = new Map<string, BrokerSchema>();

  load(slug: string): BrokerSchema | null {
    if (this.cache.has(slug)) return this.cache.get(slug)!;

    const filePath = path.join(
      process.cwd(),
      "broker-engine",
      "registry",
      "brokers",
      `${slug}.yaml`
    );

    if (!fs.existsSync(filePath)) return null;

    const content = fs.readFileSync(filePath, "utf-8");
    const schema = yaml.parse(content) as BrokerSchema;
    this.cache.set(slug, schema);
    return schema;
  }

  loadAll(): BrokerSchema[] {
    const dir = path.join(process.cwd(), "broker-engine", "registry", "brokers");
    if (!fs.existsSync(dir)) return [];

    const files = fs.readdirSync(dir).filter((f) => f.endsWith(".yaml"));
    return files.map((f) => this.load(f.replace(".yaml", ""))).filter(Boolean) as BrokerSchema[];
  }

  invalidate(slug: string): void {
    this.cache.delete(slug);
  }
}

export const brokerSchemaLoader = new BrokerSchemaLoader();
